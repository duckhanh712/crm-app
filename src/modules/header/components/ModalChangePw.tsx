import React, { Component } from 'react'
import { Modal } from 'antd';
import { observer } from 'mobx-react';
import { Input } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';

// import StorageService from '../../../utils/storageService';
import { headerStore } from '../headerStore'
import { callApi } from './../../../utils/callAPI';
import { notify } from './../../../common/notify/NotifyService';

@observer
export default class ModalChangePw extends Component {

  handleSubmit = () => {
    // e.preventDefault();
    // console.log("submit");
    (async () => {
      const resultAPI = await callApi(
        "/v1/crawlers/auth/user/password", 
        "PUT",
        {
          "password_old": headerStore.account.password_old,
          "password_new": headerStore.account.password_new,
          "confirm_password": headerStore.account.confirm_password
        }, 
        true
      );
      if (resultAPI.result.status === 200) {
        notify.show(`Sửa mật khẩu thành công`, 'success');
        headerStore.handleModal = false;
      } else{
        notify.show("Mật khẩu cũ chưa chính xác ", "error");
      }
    })();
  } 
  componentWillUnmount() {
    headerStore.clearErrorAccount();    
  }
  
  render() {
    return ( 
      <React.Fragment>
        <Modal title="Thay đổi mật khẩu" style={{color: "#f54b24"}} visible={headerStore.handleModal} width={1000} onCancel={() => headerStore.handleModal = false} onOk={this.handleSubmit}>
        <div className="login-page" style={{top: "0"}}>
        <div className="form-login" style={{width: "100%"}}>
          {/* <h3 style={{margin: "20px 0px", color: "#f54b24"}}> Thay đổi mật khẩu</h3> */}
          <form onSubmit={this.handleSubmit}>
            {/* <input className="formControl" required type="password" style={{color: "#000"}}
              placeholder="Mật khẩu cũ " name="password_old" onChange={(e) => headerStore.getUser(e)}
            /> */}
            <Input.Password
              placeholder="Mật khẩu cũ"
              name="password_old" onChange={(e) => headerStore.getUser(e)}
              iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
            <p className="p-error">
              {headerStore.errorAccount.password_old}
            </p>
            {/* <input className="formControl" required type="password" style={{color: "#000"}}
              placeholder="Mật khẩu mới" name="password_new" onChange={(e) => headerStore.getUser(e)}
            /> */}
            <Input.Password
              placeholder="Mật khẩu mới"
              name="password_new" onChange={(e) => headerStore.getUser(e)}
              iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
            <p className="p-error">
              {headerStore.errorAccount.password_new}
            </p>
            {/* <input className="formControl" required type="password" style={{color: "#000"}}
              placeholder="Nhập lại mật khẩu" name="confirm_password" onChange={(e) => {headerStore.getUser(e); headerStore.checkPw();}}
            /> */}
            <Input.Password
              placeholder="Nhập lại mật khẩu"
              name="confirm_password" onChange={(e) => {headerStore.getUser(e); headerStore.checkPw();}}
              iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
            <p className="p-error">
              {headerStore.errorAccount.confirm_password}
            </p>
            <div className="forget">
              {/* <p onClick={() => loginStore.checkForget()} style={{cursor: "pointer"}}>Quên mật khẩu ?</p> */}
            </div>
            {/* <button className="button-login" type="submit"
              // disabled={!loginStore.isValidLogin}
              onClick={() => this.handleSubmit}
            >
              Save
            </button> */}
          </form>
        </div>
  
      </div>

      </Modal>
      </React.Fragment>
    )
  }
}
