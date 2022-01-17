/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable eqeqeq */
import { DownOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu, Pagination, Table } from 'antd';
import console from 'console';
import { observable, toJS } from 'mobx';
import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { notify } from '../../../../common/notify/NotifyService';
import { callApi } from '../../../../utils/callAPI';
import { shopDetailStore } from './../shopDetailStore';
import ModalProduct from "./ModalProduct";
import { menuStore } from "../../../menu/menuStore";

// interface ProductProps {
//   infoProducts: any
// }
@observer
class Product extends Component<any, any> {
  private dataPost: string[] = [];
  @observable private loading: boolean = false;
  componentDidMount() {
    menuStore.changeOption("4whole");
    this.requestAPI();
  }
  componentWillUnmount() {
    shopDetailStore.currentPage = 1;
    shopDetailStore.showAbout = true;
    shopDetailStore.handleModal = false;
  }
  handleChangeInput = (e: any) => {
    shopDetailStore.q = e.target.value;

  }
  columns: any = [
    {
      title: "Image", dataIndex: "images", width: "100px",
      render: (images: any) => (
        <React.Fragment>
          <img src={images[0]} alt="img" style={{ width: "79%" }} />
        </React.Fragment>
      )
    },
    {
      title: "Name", dataIndex: "nameConvert",
      render: (nameConvert: any) => (
        <span style={{ color: "#6ACFF7", cursor: "pointer" }} onClick={() => this.showModalProduct(nameConvert?._id)}>{nameConvert?.name}</span>
      )
    },
    // {
    //   title: "Price" , dataIndex: 'prices',
    //   render: (prices: any) => (
    //     <React.Fragment>
         
    //     </React.Fragment>
    //   )
    // },
    {
      title: "Category", dataIndex: "category", key: "category",
      render: (category: any) => (
        <React.Fragment>
          {category?.category_name ? category?.category_name : "null"}
        </React.Fragment>
      )
    },
    {
      title: "Link", dataIndex: "link",
      render: (link: any) => (
  
          <a style={{ color: "#6ACFF7", cursor: "pointer" }} href={link} target="blank">go to product</a>
      
      )
    },
    { title: "Status", dataIndex: "state", },
    { title: "Update At", dataIndex: "updated_at", key: "updated_at" },
    {
      title: "Action", dataIndex: "_id",
      render: (_id: string) => {
        return (
          <React.Fragment>
            <i className="fas fa-pencil-alt" style={{ margin: "0 10px" }} onClick={() => this.showModalProduct(_id)}></i>
          </React.Fragment>
        )
      }
    },
  ];

  showModalProduct = async (_id: string) => {
    shopDetailStore.product_id = _id;
    shopDetailStore.currentProduct = shopDetailStore.infoProducts.find((item) => item._id === _id);
    shopDetailStore.arrImgProduct = shopDetailStore.currentProduct.images;
    Array.isArray(toJS(shopDetailStore.arrImgProduct.images)) && shopDetailStore.arrImgProduct.images.map((item: any, index: number) => {
      return item.style = 1;
    })
    shopDetailStore.handleModal = true;
  }
  menuState: any = (
    <Menu>
      <Menu.Item key="1" icon={<i className="mdi mdi-crosshairs-gps" />} onClick={() => this.handleFilterState("STATE")}>
        All
      </Menu.Item>
      <Menu.Item key="2" icon={<i className="mdi mdi-crosshairs-gps" />} onClick={() => this.handleFilterState("DRAFT")}>
        DRAFT
      </Menu.Item>
      <Menu.Item key="3" icon={<i className="mdi mdi-crosshairs-gps" />} onClick={() => this.handleFilterState("APPROVED")}>
        APPROVED
      </Menu.Item>
      <Menu.Item key="3" icon={<i className="mdi mdi-crosshairs-gps" />} onClick={() => this.handleFilterState("FAIL")}>
        FAIL
      </Menu.Item>
    </Menu>
  );
  onSelectChange = (selectedRowKeys: any) => {
    // console.log("key : ", selectedRowKeys);
    shopDetailStore.selectedRowKeys = selectedRowKeys;
    this.dataPost = selectedRowKeys;
  };
  onChange = (page: number) => {
    shopDetailStore.currentPage = page;
    this.requestAPI();
  }
  requestAPI = async () => {
    shopDetailStore.q = '';
    this.loading = true;
    let url = '';
    let urlState = shopDetailStore.productState == "STATE" ? "" : `&state=${shopDetailStore.productState}`;
    url = `/v1/crawlers/wholesale/shops/${shopDetailStore.id}/products?page=${shopDetailStore.currentPage}&limit=${shopDetailStore.pageSizeProducts}${urlState}`;
    const resultApi = await callApi(
      url,
      'GET',
      {},
      true
    )
    this.loading = false;
    if (resultApi.result.status === 200) {

      shopDetailStore.getDate(resultApi.result.data.data);
      shopDetailStore.infoProducts = resultApi.result.data.data;
      shopDetailStore.totalProducts = resultApi.result.data.pagination.total_elements;
      shopDetailStore.totalPage = Math.ceil(resultApi.result.data.pagination.total_elements / shopDetailStore.pageSizeProducts);
      // console.log("data img : ", resultApi.result.data.images);
    }

  }

  handleApprove = async () => {
    const resultApi = await callApi(

      `/v1/crawlers/wholesale/shops/${shopDetailStore.id}/products-approved`,
      "POST",
      { "product_ids": this.dataPost },
      true
    );
    if (resultApi.result.status === 200) {
      shopDetailStore.selectedRowKeys = [];
      this.dataPost = [];
      notify.show(" Approved ", "success")
    }
  }
  handleRefreshProducts = async () => {
    const resultApi = await callApi(
      `/v1/crawlers/shopee/product-refresh`,
      "PUT",
      { "product_ids": this.dataPost },
      true
    );
    if (resultApi.result.status === 200) {
      shopDetailStore.selectedRowKeys = [];
      this.dataPost = [];
      notify.show(" Refresh Products ", "success")
    }
  }
  supportFixDetail = () => {
    this.requestAPI();
  }
  handleFilterState = (str: any) => {
    shopDetailStore.productState = str;
    shopDetailStore.currentPage = 1;
    this.requestAPI();
  }
  handleRequestSearch = async (e: any) => {
    if (e.key === "Enter") {
      if (shopDetailStore.q) {
        const url = `/v1/crawlers/shopee/shop/${shopDetailStore.id}/products/search?key=${shopDetailStore.q}`
        const resultApi = await callApi(
          url,
          'GET',
          {},
          true
        )
        this.loading = false;
        if (resultApi.result.status === 200) {
          if (!resultApi.result.data.data) {
            notify.show(`Không tìm thấy sản phẩm ${shopDetailStore.q}` , "error");
            return null;
          }
          shopDetailStore.getDate(resultApi.result.data.data);
          shopDetailStore.infoProducts = resultApi.result.data.data;
          shopDetailStore.totalPage = 1;
        }
      }
    }
  }
  render() {
    const rowSelection: any = {
      onChange: this.onSelectChange,
      selectedRowKeys: shopDetailStore.selectedRowKeys,
    };
    return (
      <React.Fragment>
        <div className="nav-table" style={{ border: "none" }}>
          <div className="left-option">
            <div className="search-field d-none d-md-block" style={{ height: "33px", margin: "10px" }}>
              <div className="d-flex align-items-center h-100">
                <div className="input-group">
                  <div className="input-group-prepend bg-transparent">
                    <i className="input-group-text border-0 mdi mdi-magnify" style={{ backgroundColor: "#F2EDF3" }} />
                  </div>
                  <input type="text" className="form-control bg-transparent border-0" placeholder="search by ID, name product"
                    value={shopDetailStore.q} onChange={this.handleChangeInput} onKeyDown={(e: any) => this.handleRequestSearch(e)} />
                </div>
              </div>
            </div>
            <Dropdown overlay={this.menuState}>
              <Button >
                {shopDetailStore.productState} <DownOutlined />
              </Button>
            </Dropdown>
          </div>
          <div className="right-option" style={{ margin: "11px" }}>
            <Button type="primary" style={{ border: "none", margin: "0 10px", backgroundColor: "#ffa009" }} onClick={() => { shopDetailStore.productState = "STATE"; this.props.history.push("/seller-zasi"); }}>
              Back
            </Button>
            <Button type="primary" style={{ border: "none", margin: "0 10px" }} onClick={this.handleApprove} disabled={this.dataPost.length <= 0}>
              Approve
            </Button>
            {/* <Button type="primary" style={{border: "none",margin: "0 10px"}} onClick={this.handleRefreshProducts} disabled={this.dataPost.length <= 0}>
              Refresh Product
            </Button> */}
          </div>
        </div>
        {!this.loading ?
          <React.Fragment>
            <p className="p-header-tablee" style={{ marginTop: "10px" }}>Total : {shopDetailStore.totalProducts} products</p>
            {shopDetailStore.handleModal && <ModalProduct isModalVisible={shopDetailStore.handleModal} supportFixDetail={this.supportFixDetail} />}
            <div className="container-table">
              <Table style={{ border: "none !important" }} rowSelection={rowSelection} bordered dataSource={shopDetailStore.infoProducts} columns={this.columns} pagination={false} />
            </div>
            <Pagination current={shopDetailStore.currentPage} onChange={this.onChange} total={shopDetailStore.totalPage * 10} showSizeChanger={false} />
          </React.Fragment>
          :
          <React.Fragment>
            <div className="loading d-flex-content" style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "142px" }}>
              <img src="/assets/img/loading_data.gif" style={{ width: "10%" }} alt="loading" />
            </div>
          </React.Fragment>
        }
      </React.Fragment>
    );
  }
}
export default React.memo(Product)