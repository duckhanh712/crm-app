/* eslint-disable @typescript-eslint/no-unused-vars */
import { crawlSellerStore } from '../crawlSellerStore';
import { notify } from '../../../../common/notify/NotifyService';

export default class myCrawlSellerParam extends URLSearchParams {
  constructor(search: String | null){
    super(search + "");
    Object.setPrototypeOf(this, myCrawlSellerParam.prototype)
  }

  get getPhone(): any{
    let phone: any = this.get('phone_numbers') || null;
    if(phone === undefined || phone == null){
      phone = "ALL";
    }
    return phone;
  }
  get getProduct(): any{
    let product: any = this.get('product') || null;
    if(product === undefined || product == null){
      product = "ALL";
    }
    return product;
  }
  get getEmail(): any{
    let phone: any = this.get('emails') || null;
    if(phone === undefined || phone == null){
      phone = "ALL";
    }
    return phone;
  }
  get getQuery(): any{
    let query: any = this.get('q') || null;
    if(query === undefined || query == null){
      query = "";
    }
    return query;
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
    } else if(limit > 1000){
      notify.show("Số sản phẩm không vượt quá 2000", "error");
      limit = 2000;
    }
    return parseInt(limit);
  }

}
