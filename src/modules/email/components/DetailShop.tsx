import React, { Component } from 'react'
import { Table, Pagination, DatePicker } from 'antd';
import moment from 'moment';
import { observer } from 'mobx-react';

import { emailStore } from './../emailStore';
import { Moment } from '../../../common/Moment';
import { callApi } from './../../../utils/callAPI';
const { RangePicker } = DatePicker; 

@observer
class DetailShop extends Component {
  componentDidMount() {
    this.requestAPI();
  }
  requestAPI = async () => {
      const resultApi = await callApi(
        `/v1/crawlers/mail/shops?page=${emailStore.currentPageDetailShop}&limit=${emailStore.pageSize}`,
        "GET",
        {},
        true 
      );
      if (resultApi.result.status === 200) {
        emailStore.getDate(resultApi.result.data.data);
        emailStore.dataDetailShop = resultApi.result.data.data;
        emailStore.totalShopsDetailShop = resultApi.result.data.pagination.total_elements;
        emailStore.totalPageDetailShop = Math.ceil(resultApi.result.data.pagination.total_elements / emailStore.pageSize);
      }
      emailStore.loading = false;
  };
  columns: any = [
    { title: "ID", dataIndex: "_id" },
    { title: "Username", dataIndex: "username"},
    { title: "Email", dataIndex: "email"},
    { title: "Sent Count", dataIndex: "sent_count"},
    { title: "Open Mail", dataIndex: "open_mail"},
    { title: "First Login", dataIndex: "first_login" },
  ];
  filterDate = (e: any) => {
    emailStore.startDateDetailShop = Moment.getDate(e[0]._d.getTime(), "yyyy-mm-dd"); // _d -> date 
    emailStore.endDateDetailShop = Moment.getDate(e[1]._d.getTime(), "yyyy-mm-dd"); // _d -> date 
  }
  onChange = (page: number) => {
    emailStore.currentPageDetailShop = page;
  }
  render() {
    return (
      <React.Fragment>
        <div className="email-detail-shop-style">
        <RangePicker
          style={{height: "33px", margin: "10px"}}
          value={[moment(emailStore.startDateDetailShop, "YYYY/MM/DD"), moment(emailStore.endDateDetailShop, "YYYY/MM/DD")]}
          format={"YYYY/MM/DD"}
          onChange={this.filterDate}
        />
        {emailStore.loading ? 
        <React.Fragment>
          <div className="loading d-flex-content" style={{display: "flex", justifyContent: "center", alignItems: "center", marginTop: "142px"}}>
            <img src="/assets/img/loading_data.gif" style={{width: "10%"}} alt="loading"/>
          </div>
        </React.Fragment>
        :
        <React.Fragment>
          <p className="p-header-table" style={{marginTop: "10px"}}>
            <span style={{display: 'flex'}}>
              Total : {emailStore.totalShopsDetailShop} shops
               {/* &ensp; / &ensp; */}
              {/* Số lượng sản phẩm 1 trang : 
              <Input name="pageSize" className="pageSize" placeholder="quantity"
                      onKeyDown={this.change}  onChange={this.handleInput} value= {emailStore.pageSize} /> */}
            </span>
          </p>
          {/* <Table rowSelection={{...this.rowSelection}} dataSource={this.data} columns={this.columns} bordered pagination={false}/> */}
          <div className="container-table">
            <Table 
              // rowSelection={rowSelection} 
              dataSource={emailStore.dataDetailShop} columns={this.columns} bordered pagination={false}/>
          </div>
          <Pagination current={emailStore.currentPageDetailShop} onChange={this.onChange} total={emailStore.totalPageDetailShop * 10} showSizeChanger={false} />
        </React.Fragment>
        }
        </div>
      </React.Fragment>
    )
  }
}
export default React.memo(DetailShop)