import { observable } from 'mobx';
import { Moment } from '../../common/Moment';

class ShopStateStore {
  @observable state: String = "";
  @observable data: any = [];
  @observable selectedRowKeys: number = 1; 
  getDate = (data: any) => {
    data.map((item: any, key: number) => {
      // var dateStr = JSON.parse("\"2014-01-01T23:28:56.782Z\"");
      var str = "\"" + item.updated_at + "\"";
      // console.log(str);
      var dateStr = JSON.parse(str);
      var date = new Date(dateStr);
      item.updated_at = Moment.getDate(date.getTime(),"dd/mmyyyy");
      return null;
    })
  }
}

export const shopStateStore = new ShopStateStore();