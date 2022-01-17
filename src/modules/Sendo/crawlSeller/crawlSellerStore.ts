import { observable } from 'mobx';
import { Moment } from '../../../common/Moment';

class CrawlSellerStore {
  private currentDate: Date = new Date();
  @observable endDate: string = Moment.getDate(this.currentDate.getTime(),"yyyy-mm-dd");
  @observable startDate: string = Moment.getDate(new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1).getTime(), "yyyy-mm-dd");
  @observable selectFilterDate: boolean = false;
  @observable q: string = "";
  @observable data: any = [];
  @observable approveState: string = "INIT";
  @observable product: any = "1";
  @observable currentPage: number = 1;
  @observable totalPage: number = 1;
  @observable pageSize: number = 15;
  @observable selectedRowKeys: any = [];
  @observable productsApprove: number = 0;
  @observable totalProducts: number = 0;
  @observable productDraft: number = 0;
  @observable totalShops: number = 0; 
  @observable filterEmail: any = "ALL";
  @observable loading: boolean = false;
  @observable getToExcelBySelect: boolean = false;
  @observable showBoxNote: boolean = false;
  @observable calling: any = {};
  @observable animationReset: boolean = false;
  @observable animationResetIndex: number = 1;
  resetFilterDate = () => {
    this.endDate = "";
    this.startDate = "";
  }
  getDate = (data: any) => {
    data.map((item: any, key: number) => {
      item.key = item._id;
      // var dateStr = JSON.parse("\"2014-01-01T23:28:56.782Z\"");
      var str = "\"" + item.updated_at + "\"";
      var dateStr = JSON.parse(str);
      var date = new Date(dateStr);
      item.UserName = { username: item.username, _id: item._id}
      item.Name = { name: item.name, _id: item._id}
      item.updated_at = Moment.getDate(date.getTime(),"dd/mm/yyyy");
      return item;
    }) 
  }
}

export const crawlSellerStore = new CrawlSellerStore();