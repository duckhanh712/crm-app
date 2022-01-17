import { Button, Input, message, Upload } from 'antd'
  import { observer } from 'mobx-react'
import React, { Component } from 'react'

import "./style.scss"
import * as Config from "../../contants/config";
import {crawlingStore} from "./crawlingStore"; 
import { callApi } from '../../utils/callAPI';
import { notify } from '../../common/notify/NotifyService';
import { UploadOutlined } from '@ant-design/icons';
import { menuStore } from '../menu/menuStore';
import ModalCrawling from './components/ModalCrawling';
import ModalFile from './components/ModalFile';
import { observable } from 'mobx';
import storageService from "../../utils/storageService";
// import { logOut } from '../../common/Handler';


interface CrawlingProps {
  history: { push: (path: string) => any };
  location: { search: string };
}

@observer
class Crawling extends Component<CrawlingProps, any> {
  // private readonly inputRef: React.RefObject<any> = createRef();
  private dataPost: string[] = [];
  @observable fileList: any = [];
  private rsFile: any = [];
  private arrayRawShop: any = [];
  private arrayConvertedShop: any = [];
  componentDidMount() {
    // this.inputRef.current!.focus();
    
    menuStore.changeOption("14Crawl");
  }

  dataSend = (data : any) => {
    for (const shop in data) {
      this.dataPost.push(data[shop]);
     };
  }
  requestAPI = async () => {
    this.dataSend(crawlingStore.shops); 
    // console.log("data : ", this.dataPost); 
    crawlingStore.loading = true;
    const resultApi = await callApi(
      `/v1/crawlers/shopee/converted-shops`,
      "POST",
      {
        "shop_links": this.dataPost
      },
      true
      );
    // console.log("status : ",resultApi.result.status );
    this.dataPost = [];
    if (resultApi.result.status === 200) {
      crawlingStore.data = resultApi.result.data;
      // notify.show(`Crawling shops ... ! `, "success");
      this.arrayRawShop = resultApi.result.data.rawShop;
      this.arrayConvertedShop = resultApi.result.data.convertedShop;
      crawlingStore.activeModal = true;
      crawlingStore.cancel();
    }else {
      notify.show(`Đường Link không hợp lệ !!! `, "warning");
      crawlingStore.cancel();
    }
    crawlingStore.loading = false;
  };
  change = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if(event.key === "Enter"){
      this.handleAddItem();
      // this.inputRef.current!.focus();
    }
  }
  cancel = () => {
    this.dataPost = [];
    crawlingStore.cancel();
  }
  handleAddItem = () => {
    crawlingStore.items ++;
    crawlingStore.itemsMap.push(crawlingStore.items);
    // this.inputRef.current!.focus();
  }
  handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name , value} = event.target; 
    crawlingStore.updateShops(name, value);
  }
  propsUpload: any = {
    name: 'file',
    action: Config.API_URL+`v1/crawlers/shopee/converted-shops-file?file`,
    headers: {
      // authorization: 'authorization-text',
      "x-chozoi-token": storageService.getToken()
    },
    onChange: (info: any) => {
      // console.log("info : ", info);
      this.fileList = [...info.fileList];
      // this.fileList = [info.fileList[info.fileList.length - 1]];
      if (info.file.status === 'done' && info.fileList[0].response !== undefined) {
        // console.log("check ");
        this.handleFile(info.fileList[0].response);
        crawlingStore.activeModalFile = true;
        message.success(`${info.file.name} file uploaded successfully`);
      } else if(info.file?.error?.status === 401) {
        notify.show("Phiên đăng nhập hết hạn", "warning");
        storageService.removeToken();
        window.location.href = "/";
      }
      else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };
  handleFile = (data: any) => {
    this.rsFile = data;
  }
  render() {
    const length = crawlingStore.itemsMap.length;
    return (
      !crawlingStore.loading ?
      <React.Fragment> 
        <Upload {...this.propsUpload} fileList={this.fileList} className="load-file">
          <Button icon={<UploadOutlined />}>Click to Upload</Button>
        </Upload>
        {crawlingStore.itemsMap.map((item, index) => {
          return (
            <div className="item" key={index} style={{width : "70%"}}>
              {index + 1 === length ? 
              // {index + 1 === crawlingStore.itemsMap.length ? 
                <Input name={item.toString()} placeholder="https:// ..." style={{margin: "10px "}} autoFocus
                      onKeyDown={this.change} onChange={this.handleInput} value= {crawlingStore.shops[item]} />
                :
                <Input name={item.toString()} placeholder="https:// ..." style={{margin: "10px "}} onKeyDown={this.change} 
                        onChange={this.handleInput} value= {crawlingStore.shops[item]}  />
              }
              <i className="fas fa-minus-circle" style={{color: "#f54b24", fontSize: "27px"}} onClick={() => crawlingStore.deletePropShops(item)}></i> 
            </div>
          )
        })}
        <Button type="primary" size={"large"} style={{margin : "10px", width: "99px"}} onClick={this.handleAddItem}>
            Add
        </Button>
          <hr></hr>
        {crawlingStore.activeModal && <ModalCrawling rawShop={this.arrayRawShop} convertedShop={this.arrayConvertedShop}/> }  
        {crawlingStore.activeModalFile && <ModalFile rsFile={this.rsFile} convertedShop={this.arrayConvertedShop}/> }  
        <Button type="primary" size={"large"} style={{margin : "10px", width: "99px"}} onClick={this.requestAPI} disabled={crawlingStore.valid}>
          Insert
        </Button>
        <Button type="primary" size={"large"} style={{margin : "10px", width: "99px", backgroundColor: "#f7a922"}} onClick={this.cancel}>
          Cancel
        </Button>
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
export default React.memo(Crawling)