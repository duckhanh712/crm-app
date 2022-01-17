import { observable } from 'mobx';
import { Moment } from '../../common/Moment';

class CrawlSellerStore {
  private currentDate: Date = new Date();
  @observable endDate: string = Moment.getDate(this.currentDate.getTime(),"yyyy-mm-dd");
  @observable startDate: string = Moment.getDate(new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1).getTime(), "yyyy-mm-dd");
  @observable selectFilterDate: boolean = false;
  @observable q: string = "";
  @observable data: any = [];
  @observable approveState: string = "INIT";
  @observable state: string = "ALL";
  @observable product: any = "1";
  @observable currentPage: number = 1;
  @observable totalPage: number = 1;
  @observable productsApprove: number = 0;
  @observable totalProducts: number = 0;
  @observable productDraft: number = 0;
  @observable pageSize: number = 15;
  @observable selectedRowKeys: any = [];
  @observable totalShops: number = 0; 
  @observable phone: any = "ALL";
  @observable filterEmail: any = "ALL";
  @observable filterCategory: any = "ALL";
  @observable filterCall: any = "ALL";
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
      item.handleArrayPhone = item.phone_numbers.join("-/-/-");
      item.Phone = { phone_numbers: item.phone_numbers , phone_number: item.phone_number }
      item.calling.shop_id = item._id;
      item.calling.phone_numbers = item.phone_numbers;
      item.calling.draftStatus = item.calling.status;
      return item;
    }) 
  }
}

export const crawlSellerStore = new CrawlSellerStore();