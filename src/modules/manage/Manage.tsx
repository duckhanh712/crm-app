import { observer } from 'mobx-react';
import React, { Component } from 'react'
import { menuStore } from '../menu/menuStore'
import { manageStore } from './manageStore';
import { callApi } from './../../utils/callAPI';
import {  Button, Pagination} from 'antd';
import ModalRegister from './components/ModalRegister';
// import { notify } from './../../common/notify/NotifyService';
import AlertResetPw from "./components/AlertResetPw";
import "./style.scss"

@observer
class Manage extends Component<any> {
  private overlay = React.createRef<HTMLDivElement>();
  private checkRef: boolean = true;
  componentDidMount() {
    menuStore.changeOption("3Manage");
    this.requestAPI();
    document.addEventListener('click', this.handleClickOutside);
  }
  componentWillUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
  }
  handleClickOutside = (e: any) => {
    const {target} = e;
    const node = this.overlay.current;
    this.checkRef = !this.checkRef;
    if (node) {
      if (!node.contains(target) && this.checkRef) {
          manageStore.showAlert = false;
      }
  }
  }
  requestAPI = async () => {
    manageStore.loading = true;
    const resultApi = await callApi(
      `/v1/crawlers/auth/users?page=${manageStore.currentPage}&limit=${manageStore.pageSize}`,
      "GET",
      {},
      true
    );
    if (resultApi.result.status === 200) {
      // manageStore.getDate(resultApi.result.data);
      manageStore.data = resultApi.result.data.data;
      manageStore.totalShops = resultApi.result.data.pagination.total_elements;
      manageStore.totalPage = Math.ceil(resultApi.result.data.pagination.total_elements / manageStore.pageSize);
    }
    manageStore.loading = false;
  };
  onChange = (page: number) => {
    manageStore.currentPage = page;
    this.requestAPI();
  } 
  render() { 
    return (
      <React.Fragment>
        { manageStore.showAlert &&
          <div className="alert-reset-main" ref= {this.overlay}>
            <AlertResetPw /> 
          </div>
        }
        <Button type="primary" onClick={() => manageStore.handleModal = true}>Register</Button>
        {manageStore.handleModal && <ModalRegister apiListUser={this.requestAPI} />}
        {manageStore.loading ? 
        <React.Fragment>
          <div className="loading d-flex-content" style={{display: "flex", justifyContent: "center", alignItems: "center", marginTop: "142px"}}>
            <img src="/assets/img/loading_data.gif" style={{width: "10%"}} alt="loading"/>
          </div>
        </React.Fragment>
        : 
        <React.Fragment>
          <div className="container-table"> 
            <div className="ant-table ant-table-bordered">
              <div className="ant-table-container">
                <div className="ant-table-content">
                  <table style={{tableLayout: 'auto'}}>
                    <thead className="ant-table-thead">
                      <tr>
                        <th className="ant-table-cell">Email</th>
                        <th className="ant-table-cell">Name</th>
                        <th className="ant-table-cell">Role</th>
                        <th className="ant-table-cell">Reset</th>
                      </tr>
                    </thead>
                    <tbody className="ant-table-tbody">
                      {manageStore.data.map((item: any, index: number) => (
                        <tr className="ant-table-row ant-table-row-level-0" key="index">
                          <td className="ant-table-cell">{item.email}</td>
                          <td className="ant-table-cell">{item.name}</td>
                          <td className="ant-table-cell">{item.role}</td>
                          <td className="ant-table-cell" style={{width: "60px"}}>
                            {/* <div className="dropdown show-dropdown option-main">
                              <span data-toggle="dropdown" aria-expanded="false"> */}
                                  <img src="/assets/icon/reset.png" className={`img-reset ${manageStore.animationReset && manageStore.infoBoxResetPw?.animationResetIndex === index ? "image-reset" : ""}`} 
                                    style={{width: "60%", borderRadius: "50%"}} alt="reset"
                                    onClick={() => {
                                      manageStore.setInfoBoxResetPw(index, item?.email)
                                    }}
                                  />
                              {/* </span> */}
                              {/* <ul className="dropdown-menu confirm-reset-box">
                                <Button type="primary" 
                                  onClick={() => {manageStore.animationReset = true; manageStore.animationResetIndex = index;
                                  this.handleResetPw(item.email)}}>
                                  Xác nhận
                                </Button>
                              </ul> */}
                            {/* </div> */}
                          </td>
                        </tr>
                      ))}
                    </tbody> 
                  </table> 
                </div>
              </div>
            </div>  
          </div>
          
          <Pagination current={manageStore.currentPage} onChange={this.onChange} total={manageStore.totalPage * 10} showSizeChanger={false} />
        </React.Fragment>
        }
      </React.Fragment>
    )
  }
}
export default React.memo(Manage)