/* eslint-disable @typescript-eslint/no-unused-vars */
// import { distributorStore } from '../distributorStore';
import { notify } from '../../../../common/notify/NotifyService';

export default class myDistributorParam extends URLSearchParams {
    constructor(search: String | null){
        super(search + "");
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
          limit = 15;
        } else if(limit > 1000){
          notify.show("Số sản phẩm không vượt quá 2000", "error");
          limit = 2000;
        }
        return parseInt(limit);
      }
}