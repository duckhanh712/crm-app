/* eslint-disable array-callback-return */
/* eslint-disable eqeqeq */
import { DownOutlined } from "@ant-design/icons";
import { Button, DatePicker, Dropdown, Input, Menu, Pagination, Select, Table } from 'antd';
import axios from "axios";
import fileDownload from 'js-file-download';
import { observer } from "mobx-react";
import moment from 'moment';
import React, { Component } from "react";
import * as Config from "../../../contants/config";
import { callApi } from "../../../utils/callAPI";
import storageService from "../../../utils/storageService";
import { menuStore } from "../../menu/menuStore";
import { Moment } from './../../../common/Moment';
import { notify } from './../../../common/notify/NotifyService';
import ModalNote from './components/ModalNote';
import myCrawlSellerParam from "./components/myCrawlSellerParam";
import { crawlSellerStore } from "./crawlSellerStore";
import "./style.scss";


interface CrawlSellerProps {
  history: { push: (path: string) => any };
  location: { search: string };
}
const { Option } = Select;
const { RangePicker } = DatePicker;

@observer
class CrawlSeller extends Component<CrawlSellerProps, any> {

  private regexIdSearch = /sp.\d+/g;
  private dataPost: string[] = [];
  private dataExcelDraft: any = [];
  constructor(props: any) {
    super(props);
    this.state = { dataExcel: [], test: false };
  }

  funMenu = (arr: any, callback: (str: string) => any): React.ReactElement<any, any> => (
    <Menu>
      {arr.map((item: any, id: number) => (
        <Menu.Item key={id} icon={<i className="mdi mdi-crosshairs-gps" />} onClick={() => callback(item)}>
          {item !== 0 && item !== 1 ?
            item : null
          }
          {item === 1 && "TRUE"}
          {item === 0 && "FALSE"}
        </Menu.Item>
      ))}
    </Menu>
  )
  funMenuProductSort = (arr: any, callback: (str: string) => any): React.ReactElement<any, any> => (
    <Menu>
      {arr.map((item: any, id: number) => (
        <Menu.Item key={id} icon={<i className="mdi mdi-crosshairs-gps" />} onClick={() => callback(item)}>
          {item !== 0 && item !== 1 ?
            item : null
          }
          {item === 1 && "DESC"}
          {item === 0 && "ASC"}
        </Menu.Item>
      ))}
    </Menu>
  )
  handleFilterProduct: any = (str: string | number) => {
    crawlSellerStore.product = str;
    crawlSellerStore.currentPage = 1;
    this.requestAPI();

  }
  handleFilterEmail: any = (str: string | number) => {
    crawlSellerStore.filterEmail = str;
    crawlSellerStore.currentPage = 1;
    this.requestAPI();
  }
  handleFilterApproveState: any = (str: string) => {
    crawlSellerStore.approveState = str;
    crawlSellerStore.currentPage = 1;
    this.requestAPI();
  }

  componentDidMount() {
    menuStore.changeOption("4whole");
    this.requestProductCount()
    this.requestAPI();
  }
  componentDidUpdate(prevProps: Readonly<CrawlSellerProps>, prevState: Readonly<any>, snapshot?: any) {
    if (prevProps.location.search !== this.props.location.search) {
      this.requestAPI();
    }
  }
  handleInput = (evt: any) => {
    // const regex = /(([0-9])+([0-9]{3})\b)/g;
    // if (regex.test(evt.target.value) && evt.target.value < 2000 ){
    if (evt.target.value < 300) {
      crawlSellerStore.pageSize = evt.target.value;
    } else {
      notify.show("Yêu cầu nhập số, không quá 300", "error");
    }
  }
  change = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      this.props.history.push(`/seller-zasi?page=${crawlSellerStore.currentPage}&limit=${crawlSellerStore.pageSize}`);
    }
  }
  requestProductCount = async () => {
    const url = `/v1/crawlers/wholesale/products`
    const resultApi = await callApi(
      url,
      "GET",
      {},
      true
    );
    if (resultApi.result.status === 200) {
      crawlSellerStore.totalProducts = resultApi.result.data.products_total;
      crawlSellerStore.productsApprove = resultApi.result.data.products_approved;
      crawlSellerStore.productDraft = resultApi.result.data.products_draft;
    }
  }
  requestAPI = async () => {
    
    let url: string = "/";
    if (this.props.location.search) {
      crawlSellerStore.loading = true;
      const params = new myCrawlSellerParam(this.props.location.search)
      crawlSellerStore.currentPage = params.getPage;
      crawlSellerStore.pageSize = params.getLimit;
      crawlSellerStore.q = params.getQuery;
      const approveState: string = crawlSellerStore.approveState === "ALL" ? "" : `&approve_state=${crawlSellerStore.approveState}`;
      const product: string = crawlSellerStore.product ==="ALL" ? "" : `&product=${crawlSellerStore.product}`;
      url = `/v1/crawlers/wholesale/shops?page=${crawlSellerStore.currentPage}&limit=${crawlSellerStore.pageSize}${approveState}&emails=${crawlSellerStore.filterEmail}${product}`;
      const resultApi = await callApi(
        url,
        "GET",
        {},
        true
      );
      if (resultApi.result.status === 200) {
        crawlSellerStore.getDate(resultApi.result.data.data);
        crawlSellerStore.data = resultApi.result.data.data;
        this.setState({
          dataExcelDraft: resultApi.result.data.data,
        })
        this.dataExcelDraft = resultApi.result.data.data;
        crawlSellerStore.totalShops = resultApi.result.data.pagination.total_elements;
        crawlSellerStore.totalPage = Math.ceil(resultApi.result.data.pagination.total_elements / crawlSellerStore.pageSize);
        // console.log("data : ", resultApi.result.data.data);
      }
      crawlSellerStore.loading = false;
    } else {
      this.props.history.push(`/seller-zasi?page=${crawlSellerStore.currentPage}&limit=${crawlSellerStore.pageSize}`);
    }
  };

  columns: any = [
    { title: "ID", dataIndex: "_id" },
    {
      title: "Shop", dataIndex: "Name",
      render: (Name: any) => (
        <span style={{ color: "#6ACFF7", cursor: "pointer" }} onClick={() => this.showDetail(Name._id)} >{Name.name}</span>
      )
    },
    {
      title: "Phone Numbers", dataIndex: "phone_numbers", width: "187px",
      render: (phone_numbers: string[]) => (
        <>
          {phone_numbers.length > 0 ?
            <React.Fragment>
              <div className="dropdown show-dropdown option-main open">
                <span data-toggle="dropdown" aria-expanded="true">
                  <i className="fas fa-phone" style={{ margin: "7px 17px", color: "#f54b24" }}></i>
                  <span>
                    {phone_numbers[0]} &nbsp;
                    <i className="fas fa-angle-down" />
                  </span>
                </span>
                <ul className="dropdown-menu">
                  {phone_numbers.map((phone_number: string, index: number) => {
                    return (
                      <li key={index}>
                        <i className="fas fa-phone" style={{ margin: "7px 17px", color: "#f54b24" }}></i>
                        <span>{phone_number}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </React.Fragment>
            :
            <span style={{ opacity: "0.7", margin: "0 15px" }}>null</span>
          }
        </>
      ),
    },
    // { title: "Total Products", dataIndex: "product_total" },
    { title: "Products Crawl", dataIndex: "product_crawled" },
    { title: "Products Approve", dataIndex: "product_approve" },
    {
      title: "Action", dataIndex: "link",
      render: (link: any) => (
  
          <a style={{ color: "#6ACFF7", cursor: "pointer" }} href={link} target="blank">go to shop</a>
      
      )
    },
    {
      title: "Approve State", dataIndex: "approve_state",
      render: (str: string) => {
        switch (str) {
          case "INIT":
            return (
              <button className="btn-gradient-danger">INIT</button>
            )
          case "APPROVED":
            return (
              <button className="btn-gradient-info">APPROVED</button>
            )
          default:
            return;
        }
      }
    },
  ];

  showDetail = (str: string) => {
    this.props.history.push(`/seller-zasi/shop-detail?id=${str}`);
  }
  onChange = (page: number) => {
    crawlSellerStore.currentPage = page;
    this.props.history.push(`/seller-zasi?page=${crawlSellerStore.currentPage}&limit=${crawlSellerStore.pageSize}`);
  }

  handleApprove = async () => {
    const resultApi = await callApi(
      `/v1/crawlers/wholesale/approved-shops`,
      "POST",
      {
        "shop_ids": this.dataPost,
        "type": 2
      },
      true
    );
    if (resultApi.result.status === 200) {
      crawlSellerStore.selectedRowKeys = [];
      notify.show("System Approved ", "success");
      this.requestAPI();
      // console.log("data : ", resultApi.result.data.pagination.total_elements);
    }
  }
  handleChangeInput = (e: any) => {
    crawlSellerStore.q = e.target.value;
  }
  requestSearch = async (e: any) => {
    e.preventDefault();
    let url = `/v1/crawlers/wholesale/shops-search?key=${crawlSellerStore.q}`;
    const resultApi = await callApi(
      url,
      "GET",
      {},
      true
    );
    if (resultApi.result.status === 200) {
      if (resultApi.result.data.data === undefined) {
        crawlSellerStore.loading = false;
        notify.show("Không tìm thấy kết quả !", "error");
        return null;
      }
      crawlSellerStore.getDate(resultApi.result.data.data);
      crawlSellerStore.data = resultApi.result.data.data;
      this.setState({
        dataExcelDraft: resultApi.result.data.data,
      })
      this.dataExcelDraft = resultApi.result.data.data;
      crawlSellerStore.totalPage = 1;
    }
    crawlSellerStore.loading = false;
  };
  filterDate = (e: any) => {
    crawlSellerStore.startDate = Moment.getDate(e[0]._d.getTime(), "yyyy-mm-dd"); // _d -> date 
    crawlSellerStore.endDate = Moment.getDate(e[1]._d.getTime(), "yyyy-mm-dd"); // _d -> date 
    crawlSellerStore.selectFilterDate = true;
    this.requestAPI();
  }
  resetFilterDate = () => {
    crawlSellerStore.selectFilterDate = false;
    this.requestAPI();
  }
  render() {
    const rowSelection: any = {
      onChange: (selectedRowKeys: any, selectedRows: any) => {
        crawlSellerStore.selectedRowKeys = selectedRowKeys;
        if (crawlSellerStore.selectedRowKeys.length > 0) {
          crawlSellerStore.getToExcelBySelect = true;
        }
        else {
          crawlSellerStore.getToExcelBySelect = false;
        }
        this.dataPost = selectedRowKeys;
      },
      selectedRowKeys: crawlSellerStore.selectedRowKeys,
    };
    return (
      <React.Fragment>
        {crawlSellerStore.showBoxNote && <ModalNote />}
        <div className="nav-table">
          <div className="left-option">
            <div className="search-field d-none d-md-block" style={{ width: "250px", height: "33px", margin: "10px", marginTop: "35px" }}>
              <form className="d-flex align-items-center h-100" onSubmit={this.requestSearch}>
                <div className="input-group">
                  <div className="input-group-prepend bg-transparent">
                    <i className="input-group-text border-0 mdi mdi-magnify" style={{ backgroundColor: "#F2EDF3" }} />
                  </div>
                  <input type="text" className="form-control bg-transparent border-0" placeholder="Search ..."
                    value={crawlSellerStore.q} onChange={this.handleChangeInput}
                  />
                </div>
              </form>
            </div>
        
            <div className="flex-col p-2">
              <p className="title-filter"><i className="mdi mdi-crosshairs-gps" />Approve State </p>
              <Dropdown overlay={() => this.funMenu(["ALL", "INIT", "APPROVED"], this.handleFilterApproveState)}>
                <Button style={{ minWidth: "111px" }}>
                  {crawlSellerStore.approveState} <DownOutlined />
                </Button>
              </Dropdown>
            </div>
            <div className="flex-col p-2">
              <p className="title-filter"><i className="mdi mdi-crosshairs-gps" /> Product Sort </p>
              <Dropdown overlay={() => this.funMenuProductSort(["ALL", 1, 0], this.handleFilterProduct)}>
                <Button>
                  {crawlSellerStore.product == 0 && "ASC"}
                  {crawlSellerStore.product == 1 && "DESC"}
                  {crawlSellerStore.product === "ALL" && "ALL"}
                  <DownOutlined />
                </Button>
              </Dropdown>
            </div>
          </div>
          <div className="right-option">

            <Button type="primary" disabled={this.dataPost.length <= 0}
              style={{ border: "none", margin: "0 10px 5px" }} onClick={this.handleApprove}>
              Approve
            </Button>
          </div>
        </div>
        {crawlSellerStore.loading ?
          <React.Fragment>
            <div className="loading d-flex-content" style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "142px" }}>
              <img src="/assets/img/loading_data.gif" style={{ width: "10%" }} alt="loading" />
            </div>
          </React.Fragment>
          :
          <React.Fragment>
            <p className="p-header-table d-flex justify-content-between">
              <span style={{ display: 'flex' }}>
                Total : {crawlSellerStore.totalShops} shops &ensp; | &ensp;
                Số lượng shop 1 trang :
                <Input name="pageSize" className="pageSize" placeholder="quantity"
                  onKeyDown={this.change} onChange={this.handleInput} value={crawlSellerStore.pageSize} />
              </span>
              <span>
                Products Total: {crawlSellerStore.totalProducts} &ensp; | &ensp; Products Approved: { crawlSellerStore.productsApprove} &ensp; | &ensp; Products Draft: { crawlSellerStore.productDraft}
              </span>
            </p>
            <div className="container-table">
              <Table rowSelection={rowSelection} dataSource={crawlSellerStore.data} columns={this.columns} bordered pagination={false} />
            </div>

            <Pagination current={crawlSellerStore.currentPage} onChange={this.onChange} total={crawlSellerStore.totalPage * 10} showSizeChanger={false} />
          </React.Fragment>
        }
      </React.Fragment>
    );
  }
}

export default React.memo(CrawlSeller)