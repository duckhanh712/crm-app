
import { observable } from 'mobx';
import { validate } from '../../common/Handler';
import { Moment } from './../../common/Moment';

class ManageStore {
  @observable data: any = [];
  @observable currentPage: number = 1;
  @observable totalPage: number = 1;
  @observable pageSize: number = 15;
  @observable selectedRowKeys: any = [];
  @observable totalShops: number = 0; 
  @observable loading: boolean = false;
  @observable handleModal: boolean = false;  
  @observable animationReset: boolean = false;  
  @observable animationResetIndex: number = 0;  
  @observable showAlert: boolean = false; 
  @observable infoBoxResetPw: any = {}; 
  @observable account: any = {
    name: "",
    email: "",
    password: "",
    confirm_password: "",
    role: "ADMIN"
  }
  @observable errorAccount: any = {
    name: "",
    email: "",
    password: "",
    confirm_password: "",
  }
  setInfoBoxResetPw = (index: number, email: string | null) => {
    this.showAlert = true;
    this.infoBoxResetPw.animationResetIndex = index;
    this.infoBoxResetPw.email = email;
  }
  checkCondition = () => {
    if(this.errorAccount.name !== "" || this.errorAccount.email !== "" || this.errorAccount.password !== "" || this.errorAccount.confirm_password !== ""){
      return false;
    }
    if(this.account.name === "" || this.account.email === "" || this.account.password === "" || this.account.confirm_password === ""){
      return false;
    }
    return true;
  }
  getUser(e: React.ChangeEvent<HTMLInputElement>){
    let { name, value} = e.target;
    this.account = {
      ...this.account,
      [name]: value,
    }
    validate(name, value, this.errorAccount)
    // this.isValidLogin = this.errorAccount.password === "";
  }
  checkPw = () => {
    if(this.account.confirm_password !== this.account.password) {
      this.errorAccount.confirm_password = "Mật khẩu không khớp";
    }else {
      this.errorAccount.confirm_password = ""; 
    }
  }
  getDate = (data: any) => {
    data.map((item: any, key: number) => {
      item.key = item._id;
      // var dateStr = JSON.parse("\"2014-01-01T23:28:56.782Z\"");
      var str = "\"" + item.updated_at + "\"";
      var dateStr = JSON.parse(str);
      var date = new Date(dateStr);
      item.updated_at = Moment.getDate(date.getTime(),"dd/mm/yyyy");
      return item;
    }) 
  }
}

export const manageStore = new ManageStore();