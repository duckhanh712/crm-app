import { DownOutlined } from "@ant-design/icons";
import { Button, DatePicker, Dropdown, Input, Menu, Pagination, Select, Table } from 'antd';
import axios from "axios";
import fileDownload from 'js-file-download';
import { observer } from "mobx-react";
import moment from 'moment';
import React, { Component } from "react";
import { CSVLink } from "react-csv";
import * as Config from "../../contants/config";
import { callApi } from "../../utils/callAPI";
import storageService from "../../utils/storageService";
import { menuStore } from "../menu/menuStore";
import { Moment } from './../../common/Moment';
import { notify } from './../../common/notify/NotifyService';
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
  // private regexTextSearch = /SHOPEE.\d+/g;
  private regexIdSearch = /sp.\d+/g;
  private regexIdSearchCZ = /cz.\d+/g;
  private dataPost: string[] = [];
  private dataExcelDraft: any = [];
  constructor(props: any) {
    super(props);
    this.state = { dataExcel: [], test: false };
  }
  headersExcel = [
    { label: "_id", key: "_id" },
    { label: "name", key: "name" },
    { label: "email", key: "email" },
    { label: "place", key: "place" },
    { label: "country", key: "country" },
    { label: "is_official_shop", key: "is_official_shop" },
    { label: "rating_normal", key: "rating_normal" },
    { label: "rating_bad", key: "rating_bad" },
    { label: "rating_good", key: "rating_good" },
    { label: "cancellation_rate", key: "cancellation_rate" },
    { label: "status", key: "status" },
    { label: "shop_location", key: "shop_location" },
    { label: "shopid", key: "shopid" },
    { label: "item_count", key: "item_count" },
    { label: "follower_count", key: "follower_count" },
    { label: "account.username", key: "account.username" },
    { label: "account.following_count", key: "account.following_count" },
    { label: "Phone numbers", key: "handleArrayPhone" },
  ];
  down = async () => {
    var token = storageService.getToken();
    var newHeaders = {
      "responseType": 'blob',
      "x-chozoi-token": token
    }
    axios.get(Config.API_URL + `v1/crawlers/shopee/download-file/converted`, { headers: newHeaders })
      .then((res) => {
        fileDownload(res.data, "data-crawl-excel.csv");
      },
        (error) => {
          if (error.response && error.response.status === 401) {
            notify.show('Phiên đăng nhập hết hạn', 'error')
            storageService.removeToken();
            window.location.href = "/"
          }
          // return error.response
        }
      )
  }
  getDaTaToExcel = async () => {
    var anotherOne = this.dataPost;
    this.setState({
      dataExcel: await this.dataExcelDraft.filter(function (array_el: any) {
        return anotherOne.filter(function (anotherOne_el: any) {
          return anotherOne_el === array_el._id;
        }).length === 1
      })
    })
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
  funMenuCate = (arr: any, callback: (str: string) => any): React.ReactElement<any, any> => (
    <Menu>
      {arr.map((item: any, id: number) => (
        <Menu.Item key={id} icon={<i className="mdi mdi-crosshairs-gps" />} onClick={() => callback(item)}>
          {item !== 0 && item !== 1 ?
            item : null
          }
          {item === 328 && "Thể thao & Du lịch"}
        
        </Menu.Item>
      ))}
    </Menu>
  )

  handleFilterPhone: any = (str: string | number) => {
    crawlSellerStore.phone = str;
    crawlSellerStore.currentPage = 1;
    this.props.history.push(`/seller-info?page=${crawlSellerStore.currentPage}&limit=${crawlSellerStore.pageSize}&phone_numbers=${str}`)
  }
  handleFilterProduct: any = (str: string | number) => {
    crawlSellerStore.product = str;
    crawlSellerStore.currentPage = 1;
    this.requestAPI();

  }
  handleFilterCategory: any = (str: string | number) => {
    crawlSellerStore.filterCategory = str;
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
  handleFilterState: any = (str: string) => {
    crawlSellerStore.state = str;
    crawlSellerStore.currentPage = 1;
    this.requestAPI();
  }
  handleFilterCallState: any = (str: string) => {
    crawlSellerStore.filterCall = str;
    crawlSellerStore.currentPage = 1;
    this.requestAPI();
  }
  componentDidMount() {
    menuStore.changeOption("1Crawl");
    this.requestProductCount();
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
      this.props.history.push(`/seller-info?page=${crawlSellerStore.currentPage}&limit=${crawlSellerStore.pageSize}&phone_numbers=${crawlSellerStore.phone}`)
    }
  }
  requestProductCount = async () => {
    const url = `/v1/crawlers/shopee/products`
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
      crawlSellerStore.phone = params.getPhone;
      crawlSellerStore.currentPage = params.getPage;
      crawlSellerStore.pageSize = params.getLimit;
      crawlSellerStore.q = params.getQuery;
      const categoryFilter: string = crawlSellerStore.filterCategory === "ALL" ? "" : `&category=${crawlSellerStore.filterCategory}`;
      var callState: string = crawlSellerStore.filterCall === "ALL" ? "" : `&calling=${crawlSellerStore.filterCall}`;
      var approveState: string = crawlSellerStore.approveState === "ALL" ? "" : `&approve_state=${crawlSellerStore.approveState}`;
      var simplState: string = crawlSellerStore.state === "ALL" ? "" : `&state=${crawlSellerStore.state}`;
      var date: string = !crawlSellerStore.selectFilterDate ? "" : `&start=${crawlSellerStore.startDate}&end=${crawlSellerStore.endDate}`;
      const product: string = crawlSellerStore.product === "ALL" ? "" : `&product=${crawlSellerStore.product}`;
      url = `/v1/crawlers/shopee/converted-shops?page=${crawlSellerStore.currentPage}&limit=${crawlSellerStore.pageSize}${simplState}${approveState}${callState}${date}&phone_numbers=${crawlSellerStore.phone}&emails=${crawlSellerStore.filterEmail}${product}${categoryFilter}`
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
      this.props.history.push(`/seller-info?page=${crawlSellerStore.currentPage}&limit=${crawlSellerStore.pageSize}&phone_numbers=${crawlSellerStore.phone}`)
    }
  };
  handleSelectCallState = (value: any, calling: any) => {
    crawlSellerStore.calling = calling;
    crawlSellerStore.calling.status = value;
    crawlSellerStore.showBoxNote = true;
  }
  handleRefetch = async (id: string) => {
    notify.show("Hệ thống đang xử lí ... ", "success")
    const resultApi = await callApi(
      `/v1/crawlers/shopee/converted-shops/processing`,
      "POST",
      {
        "shop_id": id
      },
      true
    );
    if (resultApi.result.status === 200) {
      if (resultApi.result.data.new_product === 0) {
        notify.show("Không có sản phẩm nào được lấy thêm", "warning")
        return;
      }
      crawlSellerStore.data.map((item: any, index: number) => {
        if (item.id === id) {
          item.total_products += resultApi.result.data.new_product;
        }
      })
      notify.show(`Số sản phẩm có thể lấy thêm ${resultApi.result.data.new_product}`, "success")
      // crawlSellerStore.data = resultApi.result.data.new_product;
    }
  }
  handleResetShop = async (link: string) => {
    crawlSellerStore.data = crawlSellerStore.data.filter((item: any) => item.link !== link);
    const resultApi = await callApi(
      `/v1/crawlers/shopee/shop-reset`,
      "POST",
      {
        "shop": [link]
      },
      true
    );
    if (resultApi.result.status === 200) {
      notify.show(`Shop đang được crawl lại `, "success")
    }
  }
  columns: any = [
    { title: "ID", dataIndex: "_id" },
    {
      title: "Username", dataIndex: "UserName",
      render: (UserName: any) => (
        <span style={{ color: "#6ACFF7", cursor: "pointer" }} onClick={() => this.showDetail(UserName._id)} >{UserName.username}</span>
      )
    },
    {
      title: "Shop", dataIndex: "Name",
      render: (Name: any) => (
        <span style={{ color: "#6ACFF7", cursor: "pointer" }} onClick={() => this.showDetail(Name._id)} >{Name.name}</span>
      )
    },
    {
      title: "Phone Numbers", dataIndex: "Phone", width: "187px",
      render: (Phone: any) => (
        <>
          {Phone.phone_numbers.length > 0 ?
            <React.Fragment>
              <div className="dropdown show-dropdown option-main open">
                <span data-toggle="dropdown" aria-expanded="true">
                  <i className="fas fa-phone" style={{ margin: "7px 17px", color: "#f54b24" }}></i>
                  <span>
                    {Phone.phone_numbers[0]} &nbsp;
                    <i className="fas fa-angle-down" />
                  </span>
                </span>
                <ul className="dropdown-menu">
                  {Phone.phone_numbers.map((phone_number: string, index: number) => {
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

            <span><i className="fas fa-phone" style={{ margin: "7px 17px", color: "#f54b24" }}></i>{Phone.phone_number ? Phone.phone_number : '-------------------'}</span>
          }
        </>
      ),
    },
    {
      title: "Email", dataIndex: "emails", width: "187px",
      render: (emails: string[]) => (
        <React.Fragment>
          {emails.length > 0 ?
            <React.Fragment>
              <div className="dropdown show-dropdown option-main open">
                <span data-toggle="dropdown" aria-expanded="true">
                  <span>
                    {emails[0]} &nbsp;
                    <i className="fas fa-angle-down" />
                  </span>
                </span>
                <ul className="dropdown-menu">
                  {emails.map((email: string, index: number) => {
                    return (
                      <li key={index}>
                        <span style={{ margin: "5px" }}>{email}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </React.Fragment>
            :
            <span style={{ opacity: "0.7", margin: "0 15px" }}>null</span>
          }
        </React.Fragment>
      ),
    },
    // { title: "Total Products", dataIndex: "total_products" },
    { title: "Products", dataIndex: "product_crawled" },
    { title: "Products Approve", dataIndex: "product_approve" },
    // {
    //   title: "State", dataIndex: "state",
    //   render: (state: string) => {
    //     switch (state) {
    //       case "INIT":

    //       case "DONE":
    //         return (
    //           <button className="btn-gradient-info">DONE</button>
    //         )
    //       case "PROCESSING":
    //         return (
    //           <button className="btn-gradient-primary">PROCESSING</button>
    //         )
    //       case "REJECT":
    //         return (
    //           <button className="btn-gradient-dark">REJECT</button>
    //         )
    //       default:
    //         return;
    //     }
    //   }
    // },
    {
      title: "Approve State", dataIndex: "approve_state",
      render: (str: string) => {
        switch (str) {
          case "INIT":
            return (
              <button className="btn-gradient-success">INIT</button>
            )
          case "APPROVED":
            return (
              <button className="btn-gradient-info">APPROVED</button>
            )
          case "FAIL":
            return (
              <button className="btn-gradient-danger">FAIL</button>
            )
          default:
            return;
        }
      }
    },
    {
      title: "Refresh Products", dataIndex: "_id", width: 45,
      render: (_id: string) => (
        <React.Fragment>
          <img src="/assets/icon/reset.png" alt="reset"
            onClick={() => this.handleRefetch(_id)}
            className="image-refetch" />
        </React.Fragment>
      )
    },
    // {
    //   title: "Call State", dataIndex: "calling",
    //   render: (calling: any) => {
    //     return (
    //       <React.Fragment>
    //         <div className="select-call-state">
    //           <Select defaultValue={calling?.status} style={{ width: 120 }} onChange={(value) => this.handleSelectCallState(value, calling)}>
    //             <Option value="Done">Done</Option>
    //             <Option value="Not Contact">Not Contact</Option>
    //             <Option value="Later">Later</Option>
    //             <Option value="Refuse">Refuse</Option>
    //             <Option value="Unclear">Unclear</Option>
    //           </Select>
    //         </div>
    //       </React.Fragment>
    //     )
    //   }
    // },
    {
      title: "Reset Shop", dataIndex: "link",
      render: (link: string) => {
        return (
          <React.Fragment>
            <button className="btn-gradient-warning text-dark" onClick={() => this.handleResetShop(link)}>Reset</button>
          </React.Fragment>
        )
      }
    },
 
  ];

  showDetail = (str: string) => {
    this.props.history.push(`/shop-detail?id=${str}`);
  }
  onChange = (page: number) => {
    crawlSellerStore.currentPage = page;
    this.props.history.push(`/seller-info?page=${crawlSellerStore.currentPage}&limit=${crawlSellerStore.pageSize}&phone_numbers=${crawlSellerStore.phone}`)
  }
  // handleRefreshShop = async () => {
  //   notify.show("Chức năng đang phát triển", "warning");
  //   // const resultApi = await callApi(
  //   //   `/v1/crawlers/shopee/converted-shops/processing`,
  //   //   "POST",
  //   //   {
  //   //     "shop_ids": this.dataPost,
  //   //   },
  //   //   true
  //   //   );
  //   // if (resultApi.result.status === 200) {
  //   //   crawlSellerStore.selectedRowKeys = [];
  //   //   notify.show("System is ReFetching", "success");
  //   //   return ;
  //   // }
  // }
  handleApprove = async () => {
    const resultApi = await callApi(
      `/v1/crawlers/shopee/approved-shops`,
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
    let url = "";
    if (this.regexIdSearch.test(crawlSellerStore.q)) {
      url = `/v1/crawlers/shopee/search/converted?shop_id=${crawlSellerStore.q}`
    } else if (this.regexIdSearchCZ.test(crawlSellerStore.q)) {
      url = `/v1/crawlers/shopee/search/cz?shop_id=${crawlSellerStore.q}`
    } else {
      url = `/v1/crawlers/shopee/search?key=${crawlSellerStore.q}`
    }
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
                  <input type="text" className="form-control bg-transparent border-0" placeholder="Search by sp.ID, cz.ID ..."
                    value={crawlSellerStore.q} onChange={this.handleChangeInput}
                  />
                </div>
              </form>
            </div>
            <RangePicker
              style={{ height: "33px", margin: "10px", marginTop: "35px" }}
              value={[moment(crawlSellerStore.startDate, "YYYY/MM/DD"), moment(crawlSellerStore.endDate, "YYYY/MM/DD")]}
              // value={[moment('2015/01/01', "YYYY/MM/DD"), moment('2015/01/01', "YYYY/MM/DD")]}
              format={"YYYY/MM/DD"}
              onChange={this.filterDate}
              renderExtraFooter={() => (
                <Button style={{ backgroundColor: "#ffa009" }} onClick={this.resetFilterDate}>All Date</Button>
              )}
            />
            <div className="flex-col p-2">
              <p className="title-filter"><i className="mdi mdi-crosshairs-gps" /> Phone </p>
              <Dropdown overlay={() => this.funMenu(["ALL", 1, 0], this.handleFilterPhone)}>
                <Button>
                  {crawlSellerStore.phone == 0 && "FALSE"}
                  {crawlSellerStore.phone == 1 && "TRUE"}
                  {crawlSellerStore.phone === "ALL" && "ALL"}
                  <DownOutlined />
                </Button>
              </Dropdown>
            </div>
            <div className="flex-col p-2">
              <p className="title-filter"><i className="mdi mdi-crosshairs-gps" />Email </p>
              <Dropdown overlay={() => this.funMenu(["ALL", 1, 0], this.handleFilterEmail)}>
                <Button>
                  {crawlSellerStore.filterEmail === 0 && "FALSE"}
                  {crawlSellerStore.filterEmail === 1 && "TRUE"}
                  {crawlSellerStore.filterEmail === "ALL" && "ALL"}
                  <DownOutlined />
                </Button>
              </Dropdown>
            </div>
            <div className="flex-col p-2">
              <p className="title-filter"><i className="mdi mdi-crosshairs-gps" />Approve State </p>
              <Dropdown overlay={() => this.funMenu(["ALL", "INIT", "APPROVED", "FAIL"], this.handleFilterApproveState)}>
                <Button style={{ minWidth: "111px" }}>
                  {crawlSellerStore.approveState} <DownOutlined />
                </Button>
              </Dropdown>
            </div>
            <div className="flex-col p-2">
              <p className="title-filter"><i className="mdi mdi-crosshairs-gps" />State </p>
              {/* <Dropdown overlay={this.menuState}> */}
              <Dropdown overlay={() => this.funMenu(["ALL", "INIT", "DONE", "PROCESSING", "REJECT"], this.handleFilterState)}>
                <Button >
                  {crawlSellerStore.state} <DownOutlined />
                </Button>
              </Dropdown>
            </div>
            <div className="flex-col p-2">
              <p className="title-filter"><i className="mdi mdi-crosshairs-gps" /> Product </p>
              <Dropdown overlay={() => this.funMenu(["ALL", 1, 0], this.handleFilterProduct)}>
                <Button>
                  {crawlSellerStore.product == 0 && "FALSE"}
                  {crawlSellerStore.product == 1 && "TRUE"}
                  {crawlSellerStore.product === "ALL" && "ALL"}
                  <DownOutlined />
                </Button>
              </Dropdown>
            </div>
            <div className="flex-col p-2">
              <p className="title-filter"><i className="mdi mdi-crosshairs-gps" />Category </p>
              <Dropdown overlay={() => this.funMenuCate(["ALL", 328], this.handleFilterCategory)}>
                <Button>
                  {crawlSellerStore.filterCategory === 328 && "Thể thao & Du lịch"}
                  {crawlSellerStore.filterCategory === "ALL" && "ALL"}
                  <DownOutlined />
                </Button>
              </Dropdown>
            </div>
            {/* <div className="flex-col p-2">
              <p className="title-filter"><i className="mdi mdi-crosshairs-gps" />Call State </p>
              <Dropdown overlay={() => this.funMenu(["Called", "Done", "Not Contact", "Later", "Refuse", "Unclear", "ALL"], this.handleFilterCallState)}>
                <Button>
                  {crawlSellerStore.filterCall} <DownOutlined />
                </Button>
              </Dropdown>
            </div> */}
          </div>
          <div className="right-option">
            {/* <Button type="primary" disabled={this.dataPost.length <= 0}
              style={{ border: "none", margin: "0 10px 5px", backgroundColor: "#ffaa00", color: '#000000' }} onClick={this.handleRefreshShop}>
              Refresh Shops
            </Button> */}
            <Button type="primary" disabled={this.dataPost.length <= 0}
              style={{ border: "none", margin: "0 10px 5px" }} onClick={this.handleApprove}>
              Approve
            </Button>
            {crawlSellerStore.getToExcelBySelect ? <CSVLink className="main-btn-excel" id="main-btn-excel"
              data={this.state.dataExcel} headers={this.headersExcel} filename={"data-excel.csv"}
              onClick={() => this.getDaTaToExcel()}>
              <i className="fas fa-download" style={{ fontSize: "30px", cursor: "pointer", color: "#000" }}></i>
            </CSVLink>
              :
              <i className="fas fa-download" style={{ fontSize: "30px", cursor: "pointer", color: "#000" }} onClick={this.down}></i>
            }
            {/* <i className="fas fa-download" style={{fontSize: "30px", margin: "10px"}}></i> */}
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
                Products Total: {crawlSellerStore.totalProducts} &ensp; | &ensp; Products Approved: {crawlSellerStore.productsApprove} &ensp; | &ensp; Products Draft: {crawlSellerStore.productDraft}
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

