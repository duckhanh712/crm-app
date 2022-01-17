/* eslint-disable @typescript-eslint/no-unused-expressions */
import { observer } from 'mobx-react';
import React, { Component } from 'react'

import {notify} from "../../common/notify/NotifyService";
import { commonStore } from '../../common/commonStore';
import { callApi } from '../../utils/callAPI';
import { loginStore } from './loginStore';

import "./style.scss";
import StorageService from '../../utils/storageService';
import { observable } from 'mobx';

@observer
class LoginPage extends Component<any> {
  @observable private actionAnimation: boolean = true;
  stars = () => {
    let count = 50;
    let i = 0;
    while(i < count && this.actionAnimation){
      let star = document.createElement("i");
      let x = Math.floor(Math.random() * window.innerWidth);

      let duration = Math.random() * 1;
      let h = Math.random() * 100;

      star.style.left = x + "px";
      star.style.width = 1 + "px";
      star.style.height = 50 + h + "px";
      star.style.animationDuration = duration + "s";
      document.querySelector('.imglogo')?.appendChild(star);
      i++;
    }
  }
  handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // StorageService.setToken("abc");
    // window.location.href = "/";
    const { email, password } = loginStore.user;
    const user = {
      email,
      password,
    };
    (async () => {
      const resultAPI = await callApi("/v1/crawlers/auth/login", "POST", user , false);
      if (resultAPI.result.status > 300 && resultAPI.result.status !== 400) {
        notify.show(`Email hoặc Password không chính xác`, 'error');
    } else {
      if (resultAPI.result.status === 400) {
        notify.show(`Email hoặc Password không chính xác`, 'error');
        // notify.show(`${resultAPI.error}`, 'error');
      } else {
          let token: string = resultAPI.result.data.token;
          StorageService.setName(resultAPI.result.data.name);
          StorageService.setRole(resultAPI.result.data.role);
          StorageService.setToken(token);
          // document.cookie = "tokenSeller=" + token + ";domain=" + "";
          // document.cookie = "tokenSeller=" + token + ";domain=" + Config.REACT_APP_DOMAIN + "";
          // notify.show(`Đăng nhập thành công`, "success");
          commonStore.checkshowFormLogin();
          // window.location.href = "/"; 
          // updateFcmToken().finally();
        }
      }
      })();
    // notify.show(`Đăng nhập thành công`, "success");
    // commonStore.checkshowFormLogin();
  }
  componentDidMount() {
    // this.stars();
    commonStore.setNamePage("Login")
  }
  
  render() {
    return (
      <div className="login-page">
        <div className="imglogo">
          {/* <img src="./assets/img/light-bulb.png" alt="light" className="icon-light" onClick={() => this.actionAnimation = !this.actionAnimation} /> */}
          <a href="https://chozoi.vn/" style={{textAlign: "center"}}>
            <img src="./assets/img/logo-home.png" alt="logo" />
          </a>
        </div> 
        <div className="form-login">
          <h3 style={{margin: "20px 0px"}}>Đăng nhập để sử dụng CRM Page</h3>
          <form onSubmit={this.handleSubmit}>
            <input className="formControl" required
              placeholder=" Email hoặc số điện thoại " name="email" onChange={(e) => loginStore.getUser(e)}
            />
            <p className="p-error">
              {loginStore.errorUser.email}
            </p>
            <input className="formControl" required type="password"
              placeholder=" Mật khẩu" name="password" onChange={(e) => loginStore.getUser(e)}
            />
            <p className="p-error">
              {loginStore.errorUser.password}
            </p>
            <div className="forget">
              <p onClick={() => loginStore.checkForget()} style={{cursor: "pointer"}}>Quên mật khẩu ?</p>
            </div>
            <button className="button-login" type="submit"
              // disabled={!loginStore.isValidLogin}
              // onClick={this.handleSubmit}
            >
              Đăng nhập ngay
            </button>
          </form>
        </div>
  
      </div>

    );
  }
}
export default React.memo(LoginPage)