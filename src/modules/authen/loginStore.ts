import { validate } from './../../common/Handler';
import { observable} from "mobx";

// type user ={
//   email: string;
//   name: string;
//   password: string;
//   confirm_password: string;
// }

class LoginStore {
  @observable showFormLogin: boolean = true;
  @observable login: boolean = false;
  @observable forgetPw: boolean = false;
  @observable redirect: boolean = false;

  checkshowFormLogin(){
    this.showFormLogin = !this.showFormLogin;
  }
  checkForget() {
    this.login = false;
    this.forgetPw = !this.forgetPw;
  }
  back() {
    this.login = true;
    this.forgetPw = !this.forgetPw;
  }

  @observable user: any = {
    email: "",
    name: "",
    password: "",
    confirm_password: "",
  }
  @observable errorUser: any = {
    email: "",
    name: "",
    password: "",
    confirm_password: "",
  }

  @observable isValidLogin: boolean = true;
  @observable isValidForget: boolean = true;

  getUser(e: React.ChangeEvent<HTMLInputElement>){
    let { name, value} = e.target;
    this.user = {
      ...this.user,
      [name]: value,
    }
    // console.log("user : ", this.user.email);
    validate(name, value, this.errorUser)
    this.isValidLogin = this.errorUser.email === "" && this.errorUser.password === ""
  }

}

export const loginStore = new LoginStore();