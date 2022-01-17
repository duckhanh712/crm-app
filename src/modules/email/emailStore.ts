
import { observable } from 'mobx';
import { Moment } from './../../common/Moment';

class EmailStore {
  private currentDate: Date = new Date();
  @observable dataList: any[] = [];
  @observable dataDetailShop: any[] = [];
  @observable dataModalEmail: any[] = [];
  @observable showDetail: boolean = false;
  @observable endDate: string = Moment.getDate(this.currentDate.getTime(),"yyyy-mm-dd");
  @observable startDate: string = Moment.getDate(new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1).getTime(), "yyyy-mm-dd");
  @observable endDateDetailShop: string = Moment.getDate(this.currentDate.getTime(),"yyyy-mm-dd");
  @observable startDateDetailShop: string = Moment.getDate(new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1).getTime(), "yyyy-mm-dd");
  @observable loading: boolean = false;
  @observable currentPageListManage: number = 1;
  @observable currentPageDetailShop: number = 1;
  @observable totalPageListManage: number = 1;
  @observable totalPageDetailShop: number = 1;
  @observable pageSize: number = 15; 
  @observable totalShops: number = 0; 
  @observable totalShopsDetailShop: number = 0; 
  @observable totalShopsModalEmail: number = 0; 
  @observable handleModal: boolean = false;
  @observable modalErrorMessage: string = "";
  @observable file_name: string = "";
  @observable title_email: string = "";
  @observable date_send: string = "";
  @observable template: string = "REGISTER";
  funcShowDetail = () => {
    this.showDetail =true;
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

export const emailStore = new EmailStore();