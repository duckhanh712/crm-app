/* eslint-disable array-callback-return */
/* eslint-disable eqeqeq */
import { DownOutlined } from "@ant-design/icons";
import { Button, DatePicker, Dropdown, Input, Menu, Pagination, Select, Table } from 'antd';
// import axios from "axios";
// import { observable } from 'mobx';
import { observer } from "mobx-react";
// import moment from 'moment';
import React, { Component } from "react";
// import { CSVLink } from "react-csv";
// import * as Config from "../../contants/config";
import { callApi } from '../../../utils/callAPI'
// import storageService from "../../utils/storageService";
import { menuStore } from "../../menu/menuStore";
// import { Moment } from './../../common/Moment';
import { notify } from '../../../common/notify/NotifyService';
// import ModalNote from './components/ModalNote';
import myDistributorParam from "./components/myDistributorParam";
import { distributorStore } from "./distributorStore";
import "./style.scss";


interface DistributorsProps {
  history: { push: (path: string) => any };
  location: { search: string };
}


@observer
class Distributor extends Component<DistributorsProps, any> {

  constructor(props: any) {
    super(props);
    this.state = {
      name: ''
    }
  }


  funMenu = (arr: any, callback: (str: string) => any): React.ReactElement<any, any> => (
    <Menu>
      {arr.map((item: any, id: number) => (
        <Menu.Item key={id} icon={<i className="mdi mdi-crosshairs-gps" />} onClick={() => callback(item)}>
          
          {item === 1 && "TRUE"}
          {item === 0 && "FALSE"}
          {item === "/tim-nha-phan-phoi-thuc-pham" && 'Thực phẩm'}
          {item === "/tim-nha-phan-phoi-dien-may-cong-nghe" && 'Điện máy - công nghệ'}
          {item === "/tim-nha-phan-phoi-thoi-trang" && 'Thời trang'}
          {item === "/tim-nha-phan-phoi-suc-khoe-va-sac-dep" && 'Sức khỏe và sắc đẹp'}
          {item === "/tim-nha-phan-phoi-me-va-be" && 'Mẹ và bé'}
          {item === "/tim-nha-phan-phoi-nha-cua-va-doi-song" && 'Nhà cửa và đời sống'}
          {item === "/tim-nha-phan-phoi-sach-van-phong-pham" && 'Sách - văn phòng phẩm'}
          {item === "/tim-nha-phan-phoi-may-moc-thiet-bi-cong-nghiep" && 'Máy móc, Thiết bị công nghiệp'}
          {item === "/tim-nha-phan-phoi-o-to-xe-may" && 'Ô tô - xe máy'}
          {item === "/tim-nha-phan-phoi-xay-dung" && 'Xây dựng'}
          {item === "/tim-nha-phan-phoi-nong-nghiep" && 'Nông nghiệp'}
          {item === "/tim-nha-phan-phoi-y-duoc" && 'Y - Dược'}
          {item === "/tim-nha-phan-phoi-dich-vu" && 'Dịch vụ'}
          {item === "ALL" && "ALL"}
        </Menu.Item>
      ))}
    </Menu>
  );


  componentDidMount() {
    menuStore.changeOption("4Distributor");
    distributorStore.q = '';
    this.requestAPI();
  }


  requestAPI = async () => {
    let url: string = "/";
    distributorStore.loading = true;
    const params = new myDistributorParam(this.props.location.search)
    distributorStore.currentPage = params.getPage;
    distributorStore.pageSize = params.getLimit;
    const simplCategory: string = distributorStore.category === "ALL" ? "" : `&category=${distributorStore.category}`;
    url = `/v1/crawlers/distributor/index?page=${distributorStore.currentPage}&limit=${distributorStore.pageSize}${simplCategory}`;
    

    const resultApi = await callApi(
      url,
      "GET",
      {},
      true
    );
    distributorStore.loading = false;

    if (resultApi.result.status === 200) {
      window.scroll(0, 0)
      distributorStore.data = resultApi.result.data.data;
      distributorStore.totalShops = resultApi.result.data.pagination.total_elements;
      distributorStore.totalPage = Math.ceil(resultApi.result.data.pagination.total_elements / distributorStore.pageSize);
      // console.log("data : ", resultApi.result.data.data);

    }


  };


  handleFilterCategory: any = (str: string) => {
    distributorStore.category = str;
    distributorStore.currentPage = 1;
    distributorStore.q = '';
    this.requestAPI();
  }

  columns: any = [
    {
      title: "ID", dataIndex: "_id",
      render: (_id: any) => (
        <span style={{ color: "#6ACFF7", cursor: "pointer" }} onClick={() => this.showDetail(_id)} >{_id}</span>
      )
    },
    {
      title: "Phone", dataIndex: "phone",
      //   render: (phone: any) => (
      //   <span style={{color: "#6ACFF7", cursor: "pointer"}} onClick={() => console.log(phone)} >{phone}</span>
      // ) 
    },
    {
      title: "Category", dataIndex: "category", key: "category",
      render: (category: any) => (
        <React.Fragment>
          {category?.category_name ? category?.category_name : "null"}
        </React.Fragment>
      )
    },

    { title: "Industry", dataIndex: "industry" },
    { title: "Area", dataIndex: "priority_area" },
    { title: "Contact", dataIndex: "contact_name" },

  ];

  showDetail = (str: string) => {
    this.props.history.push(`/distributor-detail?id=${str}`);
  }
  requestSearch = async (e: any) => {
    e.preventDefault();
    let url = `/v1/crawlers/distributor/search?key=${distributorStore.q}` 
    const resultApi = await callApi(
      url,
      "GET",
      {},
      true
    );
    if (resultApi.result.status === 200) {
      if (resultApi.result.data.data === undefined) {
        distributorStore.loading = false;
        notify.show("Không tìm thấy kết quả !", "error");
        return null;
      }else {
        window.scroll(0, 0)
        distributorStore.data = resultApi.result.data.data;
      
        
        // console.log("data : ", resultApi.result.data.data);
  
      }
     
      distributorStore.loading = false;
    }
  };
  handleInput = (evt: any) => {
    // const regex = /(([0-9])+([0-9]{3})\b)/g;
    // if (regex.test(evt.target.value) && evt.target.value < 2000 ){
    if (evt.target.value < 300) {
      distributorStore.pageSize = evt.target.value;
    } else {
      notify.show("Yêu cầu nhập số, không quá 300", "error");
    }
  }
  change = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      this.props.history.push(`/distributor?page=${distributorStore.currentPage}&limit=${distributorStore.pageSize}`);

    }
  }
  onChange = (page: number) => {
    this.props.history.push(`/distributor?page=${page}&limit=${distributorStore.pageSize}`);
    this.requestAPI();
  }
  handleChangeInput = (e: any) => {

    distributorStore.q = e.target.value;
    
  }
  handleKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      this.requestSearch(e)
    }
  }
  render() {
    if (distributorStore.loading) {
      return <React.Fragment>
        <div className="loading d-flex-content" style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "142px" }}>
          <img src="/assets/img/loading_data.gif" style={{ width: "10%" }} alt="loading" />
        </div>
      </React.Fragment>
    } else return (
      <React.Fragment>
        <div className="nav-table">
          <div className="left-option">
            <div className="search-field d-none d-md-block" style={{ width: "250px", height: "33px", margin: "10px", marginTop: "35px" }}>
              <form className="d-flex align-items-center h-100" onSubmit={this.requestSearch} >
                <div className="input-group">
                  <div className="input-group-prepend bg-transparent">
                    <i className="input-group-text border-0 mdi mdi-magnify" style={{ backgroundColor: "#F2EDF3" }} />
                  </div>
                  <input type="text" className="form-control bg-transparent border-0" placeholder="Search by industry: gia vi"
                    value={distributorStore.q} onChange={this.handleChangeInput} onKeyDown={this.handleKeyDown}
                  />
                </div>
              </form>
            </div>
            <div className="flex-col p-2">
              <p className="title-filter"><i className="mdi mdi-crosshairs-gps" />Category </p>
              {/* <Dropdown overlay={this.menuState}> */}
              <Dropdown overlay={() => this.funMenu(["ALL", "/tim-nha-phan-phoi-thuc-pham", "/tim-nha-phan-phoi-dien-may-cong-nghe", "/tim-nha-phan-phoi-thoi-trang", "/tim-nha-phan-phoi-suc-khoe-va-sac-dep", '/tim-nha-phan-phoi-me-va-be', '/tim-nha-phan-phoi-nha-cua-va-doi-song', '/tim-nha-phan-phoi-sach-van-phong-pham', '/tim-nha-phan-phoi-may-moc-thiet-bi-cong-nghiep', '/tim-nha-phan-phoi-o-to-xe-may', '/tim-nha-phan-phoi-xay-dung', '/tim-nha-phan-phoi-nong-nghiep', '/tim-nha-phan-phoi-y-duoc', '/tim-nha-phan-phoi-dich-vu'], this.handleFilterCategory)}>
                <Button >
                  {distributorStore.category === "/tim-nha-phan-phoi-thuc-pham" && 'Thực phẩm'}
                  {distributorStore.category === "/tim-nha-phan-phoi-dien-may-cong-nghe" && 'Điện máy - công nghệ'}
                  {distributorStore.category === "/tim-nha-phan-phoi-thoi-trang" && 'Thời trang'}
                  {distributorStore.category === "/tim-nha-phan-phoi-suc-khoe-va-sac-dep" && 'Sức khỏe và sắc đẹp'}
                  {distributorStore.category === "/tim-nha-phan-phoi-me-va-be" && 'Mẹ và bé'}
                  {distributorStore.category === "/tim-nha-phan-phoi-nha-cua-va-doi-song" && 'Nhà cửa và đời sống'}
                  {distributorStore.category === "/tim-nha-phan-phoi-sach-van-phong-pham" && 'Sách - văn phòng phẩm'}
                  {distributorStore.category === "/tim-nha-phan-phoi-may-moc-thiet-bi-cong-nghiep" && 'Máy móc, Thiết bị công nghiệp'}
                  {distributorStore.category === "/tim-nha-phan-phoi-o-to-xe-may" && 'Ô tô - xe máy'}
                  {distributorStore.category === "/tim-nha-phan-phoi-xay-dung" && 'Xây dựng'}
                  {distributorStore.category === "/tim-nha-phan-phoi-nong-nghiep" && 'Nông nghiệp'}
                  {distributorStore.category === "/tim-nha-phan-phoi-y-duoc" && 'Y - Dược'}
                  {distributorStore.category === "/tim-nha-phan-phoi-dich-vu" && 'Dịch vụ'}
                  {distributorStore.category === "ALL" && "ALL"}
                  <DownOutlined />
                </Button>
              </Dropdown>
            </div>
          </div>
        </div>
        <React.Fragment>
          <div className="container-table">
            <Table dataSource={distributorStore.data} columns={this.columns} bordered pagination={false} />
          </div>
          <React.Fragment>
            <p className="p-header-table">
              <span style={{ display: 'flex' }}>
                Total : {distributorStore.totalShops} shops &ensp; / &ensp;
                Số lượng sản phẩm 1 trang :
                <Input name="pageSize" className="pageSize" placeholder="quantity"
                  onKeyDown={this.change} onChange={this.handleInput} value={distributorStore.pageSize} />
              </span>
            </p>

            <Pagination current={distributorStore.currentPage} onChange={this.onChange} total={distributorStore.totalPage * 10} showSizeChanger={false} />
          </React.Fragment>

        </React.Fragment>
      </React.Fragment>
    );
  }
}

export default React.memo(Distributor)