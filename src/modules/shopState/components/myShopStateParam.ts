import { shopStateStore } from '../shopStateStore';
// import { Moment } from '../../../common/Moment';

export default class myShopStateParam extends URLSearchParams {
  constructor(search: String | null){
    super(search + "");
    Object.setPrototypeOf(this, myShopStateParam.prototype)
  }

  get getState(): String{
    let state: any = this.get('state') || null;
    if(state === undefined || state == null){
      state = "all";
    }
    return state;
  }

}
