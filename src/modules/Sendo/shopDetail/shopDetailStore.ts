// import { error } from './../../common/notify/index';
import { validate } from '../../../common/Handler';
import { observable } from 'mobx';
import { Moment } from '../../../common/Moment';


class ShopDetailStore {
  endDate(arg0: string, startDate: (arg0: string, startDate: any, arg2: string, endDate: any) => void, arg2: string, endDate: any) {
    throw new Error("Method not implemented.");
  }
  startDate(arg0: string, startDate: any, arg2: string, endDate: any) {
    throw new Error("Method not implemented.");
  } 
  @observable edit: boolean = false; 
  @observable search: boolean = false; 
  @observable loading: boolean = false; 
  @observable infoSeller : any = {};
  @observable editCate: boolean = false; 
  @observable errorInfo: any = {};
  @observable showAbout: boolean = true;
  @observable id: string = ""; 
  @observable q: string = "";  
  @observable data: any = {};
  @observable info: any = {};
  @observable currentProduct: any ={};
  @observable arrImgProduct: any ={};
  @observable infoProducts: any[] = [];
  @observable shop: any = {};
  @observable pageSizeProducts: number = 10;
  @observable currentPage: number = 1;
  @observable totalPage: number = 1;
  @observable totalProducts: number = 0;
  @observable selectedRowKeys: string[] = [];
  @observable handleModal: boolean = false;
  @observable handleModalLog: boolean = false;
  @observable editCallingState: boolean = false;
  @observable product_id: string = "";
  @observable productState: string = "STATE";
  @observable dataModalLog: any[] = [];
  editDetail = () => { 
    this.edit = !this.edit;
  }

  changeInfo = (e: React.ChangeEvent<HTMLInputElement>) => {
    var { name, value} = e.target;
    this.infoSeller = {
      ...this.infoSeller,
      [name]: value,
    }
    validate(name, value, this.errorInfo);
  }
  updateDetailShop = (keyValue: string, newValue: string) => {
    this.info = {
      ...this.info,
      [keyValue]: newValue
    };
  }
  updateDetailProduct = (keyValue: string, newValue: string) => {
    this.infoProducts = {
      ...this.infoProducts,
      [keyValue]: newValue
    };
  }
  getDate = (data: any) => {
    data.map((item: any, key: number) => {
      // var dateStr = JSON.parse("\"2014-01-01T23:28:56.782Z\"");
      item.key = item._id;
      var str = "\"" + item.updated_at + "\"";
      var dateStr = JSON.parse(str);
      var date = new Date(dateStr);
      item.nameConvert = {
        name: item.name,
        _id: item._id
      }
      item.updated_at = Moment.getDate(date.getTime(),"dd/mm/yyyy");
      return item;
    })
  }
  getDateLog = (data: any) => {
    data.map((item: any, key: number) => {
      // var dateStr = JSON.parse("\"2014-01-01T23:28:56.782Z\"");
      var str = "\"" + item.created_at + "\"";
      var dateStr = JSON.parse(str);
      var date = new Date(dateStr);
      item.created_at = Moment.getDate(date.getTime(),"dd/mm/yyyy") + " - " + 
        date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
      return item;
    })
  }
}
export const shopDetailStore = new ShopDetailStore(); 