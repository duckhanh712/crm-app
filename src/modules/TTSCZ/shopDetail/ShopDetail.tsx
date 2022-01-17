import React, { Component } from 'react'
import { observer } from "mobx-react"
import {shopDetailStore} from "./shopDetailStore";
import myShopDetailParam from "./components/myShopDetailParam";
import { Button } from 'antd'
import About from "./components/About";
import Product from "./components/Product";
import { callApi } from './../../../utils/callAPI';


@observer
class ShopDetail extends Component<any> {
  myRef: any;
  constructor(props: any) {
    super(props)
    this.myRef = React.createRef()   // Create a ref object 
  }
  componentDidMount() {
    this.myRef.current.scrollTo(0, this.myRef.current.offsetTop);
    this.requestAPI();
    shopDetailStore.productState = "STATE";
    shopDetailStore.showAbout = true;
  }
  requestAPI = async () => {
    shopDetailStore.loading = true;
    if(this.props.location.search){ 
      const params = new myShopDetailParam(this.props.location.search)
      shopDetailStore.id = params.getId;
      if(shopDetailStore.id === ""){
        this.props.history.push(`/seller-tts-cz`) ;
      } 
      const resultApi = await callApi(
        `/v1/crawlers/wholesale/shops/${shopDetailStore.id}`,
        "GET",
        {},
        true
        )

      if (resultApi.result.status === 200) {
        // shopDetailStore.data = resultApi.result.data;
        shopDetailStore.info = resultApi.result.data;
        shopDetailStore.loading = false;
      }
    }
    else {
      this.props.history.push(`/seller-tts-cz`)  ;
    }
  }
  showProducts = () => {

    shopDetailStore.showAbout = false;
    console.log(this.props.history);
  }
  render() {
    return (
      <React.Fragment >
        <div ref={this.myRef}>
        <div className="nav-option" style={{backgroundColor: "#fff"}}>
          <div className={shopDetailStore.showAbout ? "about active" : "about" } onClick={() => shopDetailStore.showAbout = true}>ABOUT</div>
          <div className={shopDetailStore.showAbout ? "product" : " product active" } onClick={this.showProducts}>PRODUCT</div>
 
          {shopDetailStore.showAbout &&  
            <React.Fragment>
              <Button type="primary" className="btn-back" onClick={() => this.props.history.push("/seller-tts-cz")}>
                Back
              </Button>
            </React.Fragment>
          }
        </div>
        <div className="info-main shop-detail" >
        {shopDetailStore.showAbout ? 
          <About/>
          :
          <Product history={this.props.history}/>
          // <Product id={shopDetailStore.id} history={this.props.history}/>
        }

        </div>
        </div>
      </React.Fragment>
    )
  }
}
export default React.memo(ShopDetail)