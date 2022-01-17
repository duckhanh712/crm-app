/* eslint-disable @typescript-eslint/no-unused-vars */
import { emailStore } from '../emailStore';
import { headerStore } from './../../header/headerStore';

export default class myEmailParam extends URLSearchParams {
  constructor(search: String | null){
    super(search + "");
    Object.setPrototypeOf(this, myEmailParam.prototype)
  }

  get getPhone(): any{
    let phone: any = this.get('phone_numbers') || null;
    if(phone === undefined || phone == null){
      phone = "ALL";
    }
    return phone;
  }
  get getState(): string{
    let state: any = this.get('state') || null;
    if(state === undefined || state == null){
      state = "STATE";
    }
    return state;
  }
  get getPage(): number{
    let page: any = this.get("page") || null ;
    if(page === undefined || page == null){
      page = 1;
    }
    return parseInt(page);
  }
  get getLimit(): number{
    let limit: any = this.get("limit") || null ;
    if(limit === undefined || limit == null){
      limit = 1;
    }
    return parseInt(limit);
  }

}
