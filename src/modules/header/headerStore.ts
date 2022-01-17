/* eslint-disable array-callback-return */
import { observable } from 'mobx';
import { validate } from '../../common/Handler';

class HeaderStore {

  @observable handleModal: boolean = false;
  
  @observable account: any = {
    password_old: "",
    password_new: "",
    confirm_password: "",
  }
  @observable errorAccount: any = {
    password_old: "",
    password_new: "",
    confirm_password: "",
  }

  @observable isValidLogin: boolean = true;
  @observable isValidForget: boolean = true;

  clearErrorAccount(){
    this.errorAccount.password_old = this.errorAccount.password_new = this.errorAccount.confirm_password = ""
  }
  getUser(e: React.ChangeEvent<HTMLInputElement>){
    let { name, value} = e.target;
    this.account = {
      ...this.account,
      [name]: value,
    }
    validate(name, value, this.errorAccount)
    this.isValidLogin = this.errorAccount.password === "";
  }
  checkPw = () => {
    if(this.account.password_new !== this.account.confirm_password) {
      this.errorAccount.confirm_password = "Mật khẩu không khớp";
    }else {
      this.errorAccount.confirm_password = ""; 
    }
  }
}

export const headerStore = new HeaderStore();