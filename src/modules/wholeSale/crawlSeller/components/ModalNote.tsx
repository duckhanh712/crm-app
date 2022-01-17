import React, { Component } from 'react'
import { crawlSellerStore } from './../crawlSellerStore';
import { Modal, Select } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { observer } from 'mobx-react';
import { notify } from './../../../../common/notify/NotifyService';
import { callApi } from './../../../../utils/callAPI';

const { Option } = Select;

@observer
class ModalNote extends Component<any> {
  cancel = () => {
    crawlSellerStore.showBoxNote = false;
    notify.show("Trạng thái chưa được lưu", "error");
  }
  handleInputNote = (event: any) => {
    const { name , value} = event.target; 
    crawlSellerStore.calling[name] = value;
  }
  handleSelectPhone = (value: any) => {
    crawlSellerStore.calling.phone_number = value;
  }
  handleSaveNote = async (calling: any) => {
    const resultApi = await callApi(
      `/v1/crawlers/mail/phone-status`,
      "PUT",
      {
        "calling": crawlSellerStore.calling
      },
      true
    );
    // console.log("status : ", resultApi.result.status);
    if (resultApi.result.status === 200) {
      notify.show("Đã thay đổi trạng thái", "success");
      // this.requestAPI();
      crawlSellerStore.showBoxNote = false;
    }
  }
  render() {
    return (
      <React.Fragment>
        <Modal title="Note" visible={crawlSellerStore.showBoxNote} onCancel={this.cancel} onOk={this.handleSaveNote} >
          <div className="modal-note-main">
          &ensp; &ensp; Số điện thoại : 
            <Select defaultValue={crawlSellerStore.calling.phone_number} style={{width: 120, marginLeft: "10px" }} onChange={this.handleSelectPhone}>
              {crawlSellerStore.calling.phone_numbers && crawlSellerStore.calling.phone_numbers.map((item: string, index: number) => (
                <Option value={item}>{item}</Option>
              ))}
            </Select>
            <TextArea defaultValue={crawlSellerStore.calling.note} style={{minHeight: "200px"}} name="note" placeholder="Note ..." onChange={this.handleInputNote}/>
          </div>
        </Modal>
      </React.Fragment>
    )
  }
}
export default React.memo(ModalNote)