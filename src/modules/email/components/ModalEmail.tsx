import React, { Component } from 'react'
import { Modal, Upload, message, DatePicker, Select ,Table} from 'antd';
import { emailStore } from './../emailStore';
import { observer } from 'mobx-react';
import { Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { observable } from 'mobx';
import moment from 'moment';

import * as Config from "../../../contants/config";
import storageService from "../../../utils/storageService";
import { notify } from './../../../common/notify/NotifyService';
import { callApi } from '../../../utils/callAPI';

const { Option } = Select;

@observer 
class ModalEmail extends Component<any> {
  @observable fileList: any = [];
  private rsFile: any = {};
  cancel = () => {
    emailStore.handleModal = false;
  } 
  propsUpload: any = {
    name: 'file',
    action: Config.API_URL+`v1/crawlers/mail/uploads`,
    headers: {
      "x-chozoi-token": storageService.getToken()
    },
    onChange: async (info: any) => {
      this.fileList = [info.fileList[info.fileList.length - 1]];
      if (info.file.status === 'done' && info.fileList[0].response !== undefined) {
        this.handleFile(info.fileList[0].response);
        emailStore.modalErrorMessage = "";
        message.success(`${info.file.name} file uploaded successfully`);
      } else if(info.file?.error?.status === 404) {
        emailStore.modalErrorMessage = info.fileList[0].response.message;
        notify.show(info.fileList[0].response.message, "warning");
      } else if(info.file?.error?.status === 401) {
        notify.show("Phiên đăng nhập hết hạn", "warning");
        storageService.removeToken();
        window.location.href = "/";
      }
      else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };
  handleFile = (data: any) => {
    emailStore.dataModalEmail = data.shop;
    emailStore.file_name = data.file_name;
  }
  
  columns: any = [
    { title: "Market ", dataIndex: "market", 
      render: () => (<p>Shopee</p>)
    },
    { title: "ID", dataIndex: "_id"},
    { title: "UserName", dataIndex: "username"},
    { title: "Email", dataIndex: "email"},
  ];
  handleInput = (e: any) => {
    const {value} = e.target;
    emailStore.title_email = value;
  }
  onChange(value: any, dateString: any) {
    emailStore.date_send = value._d.toISOString();
  }
  onOk(value: any) {
    // console.log('onOk: ', value._d.toISOString());
    emailStore.date_send = value._d.toISOString();
  }
  handleSelect = (value: any) => {
    emailStore.template = value;
  }
  disabledDate(current: any) {
    // Can not select days before today and today
    // console.log("curr : ", moment().startOf('day'));
    return current && current < moment().startOf('day');
    // return current ;
  }
  requestAPI = async () => {
    const resultApi = await callApi(
      `/v1/crawlers/mail/manage?page=${emailStore.currentPageListManage}&limit=${emailStore.pageSize}`,
      "GET",
      {},
      true
    );
    if (resultApi.result.status === 200) {
      emailStore.getDate(resultApi.result.data.data);
      emailStore.dataList = resultApi.result.data.data;
      emailStore.totalShops = resultApi.result.data.pagination.total_elements;
      emailStore.totalPageListManage = Math.ceil(resultApi.result.data.pagination.total_elements / emailStore.pageSize);
      // console.log("data : ", resultApi.result.data.data);
    }
    emailStore.loading = false;
  };
  handleSendEmail = async () => {
    const resultApi = await callApi(
      `/v1/crawlers/mail/send-mail`,
      "POST",
      {
        "title": emailStore.title_email,
        "template": emailStore.template,
        "file_name": emailStore.file_name,
        "date_sent": emailStore.date_send
      },
      true
    );
    if (resultApi.result.status === 200) {
      notify.show("Successful ! ", "success");
      emailStore.handleModal = false;
      this.requestAPI();
    }
  }
  render() { 
    return (
      <React.Fragment>
        <Modal visible={emailStore.handleModal} width={1000} onCancel={this.cancel} onOk={() => this.handleSendEmail()} >
          <div className="title-modal-email modal-email-style">
            <div className="step">
              <h3>Title</h3>
              <input placeholder= "Title of Email" name="title" onChange={this.handleInput}/>
            </div> 
            <div className="step"> 
              <h3>File</h3>
              <Upload {...this.propsUpload} fileList={this.fileList} className="load-file-email">
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
              </Upload>
              <p className="p-error">
              {emailStore.modalErrorMessage}
              </p>
              {/* <input type="file" name="file" onChange={this.handleF}/> */}
            </div>
            <div className="step">
              <h3>Email Template</h3>
              <Select defaultValue="REGISTER" style={{ width: 120 }} onChange={(value) => this.handleSelect(value)}>
                <Option value="REGISTER">REGISTER</Option>
              </Select>
              {/* <input placeholder= "Title of Email" value="REGISTER"/> */}
            </div>
            <div className="step">
              <h3>Time Start</h3> 
              {/* <Space direction="vertical" size={3}> */}
                <DatePicker showTime style={{height: "37px"}} 
                  disabledDate={this.disabledDate} onChange={this.onChange} onOk={this.onOk}/>
              {/* </Space> */}
            </div>
          </div>
          <div className="table-email" style={{marginTop: "30px"}}> 
          <Table
            dataSource={emailStore.dataModalEmail} columns={this.columns}
            bordered pagination={{defaultPageSize: 5}} />
          </div>
        </Modal>
      </React.Fragment>
    )
  }
}
export default React.memo(ModalEmail)