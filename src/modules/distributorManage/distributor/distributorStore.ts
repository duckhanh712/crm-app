import { observable } from 'mobx';
import { Moment } from '../../../common/Moment';

class DistributorStore {

  // private currentDate: Date = new Date();
  @observable q: string = "";
  @observable data: any = [];
  @observable currentPage: number = 1;
  @observable totalPage: number = 1;
  @observable pageSize: number = 15;
  @observable loading: boolean = false;
  @observable animationReset: boolean = false;
  @observable animationResetIndex: number = 1;
  @observable totalShops: number = 0; 
  @observable category: string = "ALL";
  
}

export const distributorStore =  new DistributorStore();