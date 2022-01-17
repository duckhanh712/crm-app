// import { validate } from './../../common/Handler';
import { observable } from 'mobx';
// import { Moment } from './../../common/Moment';

class DistributorDetailStore {
    // @observable edit: boolean = false; 
    @observable loading: boolean = false; 
    @observable infoSeller : any = {};
    @observable errorInfo: any = {};
    @observable showAbout: boolean = true;
    @observable id: string = "";  
    @observable data: any = {};
    @observable info: any = {};
    // @observable currentProduct: any ={};
    // @observable arrImgProduct: any ={};
    // @observable infoProducts: any[] = [];
    @observable shop: any = {};
    @observable pageSizeProducts: number = 10;
    @observable currentPage: number = 1;
    @observable totalPage: number = 1;
    @observable totalProducts: number = 0;
    // @observable selectedRowKeys: string[] = [];
    // @observable handleModal: boolean = false;
    // @observable handleModalLog: boolean = false;
    // @observable editCallingState: boolean = false;
    // @observable product_id: string = "";
    // @observable productState: string = "STATE";
    // @observable dataModalLog: any[] = [];
}
export const distributorDetailStore = new DistributorDetailStore();