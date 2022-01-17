import { Button } from 'antd'
import { observer } from 'mobx-react';
import React, { Component } from 'react'
import {Select} from "antd"
import { notify } from '../../../common/notify/NotifyService';
import { callApi } from '../../../utils/callAPI';
import {shopDetailStore} from "../shopDetailStore";
import TextArea from 'antd/lib/input/TextArea';
import { toJS } from 'mobx';

const { Option } = Select;

@observer
export default class CallCheck extends Component {
  private callStatusBuffer : string = "";
  handleLogCallingState = async () => {
    const resultApi = await callApi(
      `/v1/crawlers/mail/phone-log/${shopDetailStore.id}`,
      "GET",
      {},
      true
    );
    if (resultApi.result.status === 200) {
      shopDetailStore.getDateLog(resultApi.result.data.data);
      resultApi.result.data.data.reverse();
      shopDetailStore.dataModalLog = resultApi.result.data.data;
      shopDetailStore.handleModalLog = true; 
    }
  } 
  handleEditCallingState = () => {
    if(this.callStatusBuffer === "")
      this.callStatusBuffer = toJS(shopDetailStore.info.calling);
    shopDetailStore.editCallingState = !shopDetailStore.editCallingState;
  }
  handleCancelCallingState = () => {
    shopDetailStore.info.calling = this.callStatusBuffer;
    shopDetailStore.editCallingState = false;
  }
  handleUpdateCallingState = async () => {
    shopDetailStore.info.calling.shop_id = shopDetailStore.id;
    const resultApi = await callApi(
      `/v1/crawlers/mail/phone-status`,
      "PUT",
      {
      "calling": shopDetailStore.info.calling
      },
      true
    );
    if (resultApi.result.status === 200) {
      notify.show("Đã thay đổi trạng thái", "success");
      this.callStatusBuffer = ""; 
      shopDetailStore.editCallingState = false;
    }
  }
  handleSelectCallState = (value: any) => {
    shopDetailStore.info.calling.status = value;
  }
  handleInput = (event: any) => {
    const {value} = event.target; 
    shopDetailStore.info.calling.note = value;
  }
  elementDetail = (title: string, content: any, name: string) => {
    return (
      <React.Fragment>
        <p> 
          <span className="span-title"><i className="mdi mdi-crosshairs-gps"/>{title}</span> 
          { shopDetailStore.editCallingState ?
            <TextArea value={content} style={{minHeight: "30px", width: "70%", margin: "10px"}} name={name} onChange={this.handleInput}/>
          :
            <TextArea value={content} style={{minHeight: "30px", width: "70%", margin: "0px"}} readOnly/>
          }
        </p>
      </React.Fragment>
    )
  }
  elementSelectBox = (title: string, content: any, name: string) => {
    return (
      <React.Fragment>
        <p>
          <span className="span-title"><i className="mdi mdi-crosshairs-gps"/>{title}</span> 
          { shopDetailStore.editCallingState ? 
            // <Input placeholder={title} name={name} defaultValue={content} onChange={this.handleInput} />
            <Select defaultValue={content} style={{ width: 120, marginLeft: "5px" }} onChange={(value) => this.handleSelectCallState(value)}>
              <Option value="Done">Done</Option>
              <Option value="Not Contact">Not Contact</Option>
              <Option value="Later">Later</Option>
              <Option value="Refuse">Refuse</Option>
              <Option value="Unclear">Unclear</Option>
            </Select>
            :
            <span> {content ? content : "null"} </span> 
          }
        </p>
      </React.Fragment>
    )
  }
  render() {
    return (
      <table className="table-about about-product">
        <tr>
          <th style={{paddingLeft: "37px"}}>Calling Check</th>
          <th style={{textAlign: "right"}} >
            <Button type="primary" style={{backgroundColor: "#f4b653"}} className="log-btn-detail" onClick={this.handleLogCallingState}>
              Log
            </Button>
            {!shopDetailStore.editCallingState ?
            <Button type="primary" style={{backgroundColor: "#f54b24", margin: "5px 20px"}}  className="approve-btn-detail" onClick={this.handleEditCallingState}>
              Edit
            </Button>
            :
            <React.Fragment>
              <Button type="primary" className="approve-btn-detail" onClick={this.handleUpdateCallingState}>
                Update
              </Button>
              <Button type="primary" className="approve-btn-detail" style={{backgroundColor: "#f54b24", margin: "5px 10px"}} onClick={this.handleCancelCallingState}>
                Cancel
              </Button>
            </React.Fragment>
            }
          </th> 
        </tr>
        <tr>
          <td>
            {this.elementSelectBox("State", shopDetailStore.info?.calling?.status, "calling.status")}
            {this.elementDetail("Note", shopDetailStore.info?.calling?.note, "calling.note")}
          </td>
          <td>
          </td>
        </tr>
      </table>
      
    )
  }
}
