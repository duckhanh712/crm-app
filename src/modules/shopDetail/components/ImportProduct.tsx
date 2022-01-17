import { Button, Input, message } from 'antd'
import { observer } from 'mobx-react'
import React, { Component } from 'react'
import * as Config from "../../../contants/config";
import { productStore} from "./productStore"; 
import { callApi } from '../../../utils/callAPI';
import { notify } from '../../../common/notify/NotifyService';
import { menuStore } from '../../menu/menuStore';
import { observable } from 'mobx';
import { shopDetailStore } from "../shopDetailStore";
import storageService from "../../../utils/storageService";
// import { logOut } from '../../common/Handler';

@observer
class ImportProduct extends Component {
  // private readonly inputRef: React.RefObject<any> = createRef();
  private dataPost: string[] = [];
  @observable fileList: any = [];
  private rsFile: any = [];
  private arrayRawShop: any = [];
  private arrayConvertedShop: any = [];
  componentDidMount() {
    // this.inputRef.current!.focus();
    menuStore.changeOption("1Crawl");
  }
  dataSend = (data : any) => {
    for (const shop in data) {
      this.dataPost.push(data[shop]);
     };
  }
  requestAPI = async () => {
    this.dataSend(productStore.shops); 
    // console.log("data : ", this.dataPost); 
    productStore.loading = true;
    const resultApi = await callApi(
      `/v1/crawlers/shopee/shop/${shopDetailStore.id}/product-crawler`,
      "POST",
      {
        "product": this.dataPost[0]
      },
      true
      );

    this.dataPost = [];
    notify.show(`Crawling ! `, "success");
    if (resultApi.result.status === 200) {
      productStore.data = resultApi.result.data;
      notify.show(`${productStore.data.message} ! `, productStore.data.status);
      productStore.cancel();
    }else {
      productStore.data = resultApi.result.data;
      notify.show(`${productStore.data.message} ! `, productStore.data.status);
      productStore.cancel();
    }
    productStore.loading = false;
  };
  change = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if(event.key === "Enter"){
      this.requestAPI();
    }
  }
  cancel = () => {
    this.dataPost = [];
    productStore.cancel();
  }
  handleAddItem = () => {
    productStore.items ++;
    productStore.itemsMap.push(productStore.items);
    // this.inputRef.current!.focus();
  }
  handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name , value} = event.target; 
    productStore.updateShops(name, value);
  }
  handleFile = (data: any) => {
    this.rsFile = data;
  }
  render() {
    const length = productStore.itemsMap.length;
    return (
      !productStore.loading ?
      <React.Fragment> 
        <h4 style={{marginLeft: "10px"}}>Import Product</h4>
        {productStore.itemsMap.map((item, index) => {
          return (
            <div className="item" key={index} style={{justifyContent: `left`}}>
              {index + 1 === length ? 
                <Input name={item.toString()} placeholder="https:// ..." style={{margin: "10px "}} 
                      onKeyDown={this.change} onChange={this.handleInput} value= {productStore.shops[item]} />
                :
                <Input name={item.toString()} placeholder="https:// ..." style={{margin: "10px "}} onKeyDown={this.change} 
                        onChange={this.handleInput} value= {productStore.shops[item]}  />
              }
            </div>
          )
        })}
        
        <Button type="primary" size={"large"} style={{margin : "10px", width: "99px"}} onClick={this.requestAPI} disabled={productStore.valid}>
          Insert
        </Button>
        <Button type="primary" size={"large"} style={{margin : "10px", width: "99px", backgroundColor: "#f7a922"}} onClick={this.cancel}>
          Cancel
        </Button>
        <hr></hr>
      </React.Fragment> 
      :
      <React.Fragment>
        <div className="loading d-flex-content" style={{display: "flex", justifyContent: "center", alignItems: "center", marginTop: "142px"}}>
          <img src="/assets/img/loading_data.gif" style={{width: "10%"}} alt="loading"/>
        </div>
      </React.Fragment>
    )
  }
}
export default React.memo(ImportProduct)