import React, { Component } from 'react'
import { Input, Modal } from 'antd';
import { observer } from 'mobx-react';
import { EyeTwoTone, EyeInvisibleOutlined } from '@ant-design/icons';
import { callApi } from './../../../utils/callAPI';
import { manageStore } from './../manageStore';
import { notify } from './../../../common/notify/NotifyService';

@observer
class ModalRegister extends Component<any> {
  handleSubmit = () => {
    if(!manageStore.checkCondition()){
      notify.show("Yêu cầu nhập đúng các thông tin ! ", "error");
      return null;
    }
    (async () => {
      const resultAPI = await callApi(
        "/v1/crawlers/auth/register", 
        "POST",
        {
          "name": manageStore.account.name,
          "email": manageStore.account.email,
          "password": manageStore.account.password,
          "role": manageStore.account.role
        },
        true 
      );
      if (resultAPI.result.status === 201) {
        notify.show("Tạo tài khoản thành công", "success");
        this.props.apiListUser();
        manageStore.handleModal = false;
      } else {
        notify.show("Email có thể đã bị trùng", "error");
      }
    })();
  }
  render() {
    return ( 
      <React.Fragment>
        <Modal title="Đăng kí tài khoản" style={{color: "#f54b24"}} visible={manageStore.handleModal} width={1000} onCancel={() => manageStore.handleModal = false} onOk={this.handleSubmit}>
        <div className="login-page" style={{top: "0"}}>
        <div className="form-login" style={{width: "100%"}}>
          <form onSubmit={this.handleSubmit}>
            <Input placeholder="Name" required
              name="name" onChange={(e) => manageStore.getUser(e)}
            />
            <p className="p-error">
              {manageStore.errorAccount.name}
            </p>
            <Input placeholder="Email" required
              name="email" onChange={(e) => manageStore.getUser(e)}
            />
            <p className="p-error">
              {manageStore.errorAccount.email}
            </p>
            <Input.Password placeholder="Mật khẩu" required
              style={{margin: "10px", padding: "0", height: "33px"}}
              name="password" onChange={(e) => manageStore.getUser(e)}
            />
            <p className="p-error">
              {manageStore.errorAccount.password}
            </p>
            <Input.Password placeholder="Nhập lại mật khẩu" required
              style={{margin: "10px", padding: "0", height: "33px"}}
              name="confirm_password" onChange={(e) => {manageStore.getUser(e); manageStore.checkPw();}}
              iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
            <p className="p-error">
              {manageStore.errorAccount.confirm_password}
            </p>
            <div className="forget">
            </div>
          </form>
        </div>
  
      </div>

        </Modal>
      </React.Fragment>
    )
  }
}
export default React.memo(ModalRegister)