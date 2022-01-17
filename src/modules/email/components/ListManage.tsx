import { observer } from 'mobx-react'
import React, { Component } from 'react'
import { Table, Pagination, DatePicker } from 'antd';
import moment from 'moment';

import { emailStore } from './../emailStore';
import { callApi } from './../../../utils/callAPI';
import { Moment } from './../../../common/Moment';

const { RangePicker } = DatePicker; 

@observer
class ListManage extends Component<any> {

  componentDidMount() {
    console.log("api list ");
    this.requestAPI();
  }
  requestAPI = async () => {
    const resultApi = await callApi(
      `/v1/crawlers/mail/manage?page=${emailStore.currentPageListManage}&limit=${emailStore.pageSize}`,
      "GET",
      {},
      true
    );
    if (resultApi.result.status === 200) {
      emailStore.getDate(resultApi.result.data.data);
      emailStore.dataList = resultApi.result.data.data;
      emailStore.totalShops = resultApi.result.data.pagination.total_elements;
      emailStore.totalPageListManage = Math.ceil(resultApi.result.data.pagination.total_elements / emailStore.pageSize);
    }
    emailStore.loading = false;
  };
  filterDate = (e: any) => {
    emailStore.startDate = Moment.getDate(e[0]._d.getTime(), "yyyy-mm-dd"); // _d -> date 
    emailStore.endDate = Moment.getDate(e[1]._d.getTime(), "yyyy-mm-dd"); // _d -> date 
  }
  setPercent = (a: number, b: number) => {
    // console.log("a b :", a, b); 
    let percent: number = 0;
    // a: send, b // total
    if(b===0) return 0;
    percent = 100 * (a / b);
    if (percent - Math.floor(percent) >= 0.95 || percent - Math.floor(percent) <= 0.05 || percent === Math.floor(percent)) {
      return Math.ceil(percent);
    } else {
      return percent.toFixed(1);
    };
  }
  setColor = (a: number | string) => {
    if( a === 100){
      return "#2cf20e";
    } else if( a >= 50){
      return "#f54b24";
    } else {
      return "#2067f7";
    }
  }
  columns: any = [
    { title: "Tilte", dataIndex: "title" },
    { title: "Template", dataIndex: "template"},
    { title: "File", dataIndex: "file_name"},
    { title: "Shop Quantity", dataIndex: "shop_quantity"},
    { title: "Data Sent", dataIndex: "data_sent"},
    { title: "Process", dataIndex: "progress", 
      render: (process: any) => {
        let percentMain = this.setPercent(process?.sent, process?.total);
        let color: string = this.setColor(percentMain);
        return (
           <React.Fragment>
             <p style={{marginBottom: "0", textAlign: "center", fontSize: "12px"}}>{process?.sent} ({percentMain}%)</p>
             <div className="contain-process-email">
               <div className="process-email" style={{backgroundColor: `${color}`, width: `${percentMain}%`}}></div>
             </div>
           </React.Fragment> 
         )
      }
    },
    { title: "Open mail", dataIndex: "open_mail" },
    { title: "First Login", dataIndex: "first_login" },
    { title: "Action", dataIndex:"_id",
      render: (_id: string) => (
        <>
          <i className="fas fa-cloud-download-alt" style={{margin: "0 10px"}} ></i>
        </>
      )
    },
  ];
  onChange = (page: number) => {
    emailStore.currentPageListManage = page;
    this.requestAPI();
    // this.props.history.push(`/seller-info?page=${emailStore.currentPageListManage}&limit=${emailStore.pageSize}`)
  }
  render() {
    return (
      <React.Fragment>
        <div className="email-list-manage-style">
        <RangePicker
          style={{height: "33px", margin: "10px"}}
          value={[moment(emailStore.startDate, "YYYY/MM/DD"), moment(emailStore.endDate, "YYYY/MM/DD")]}
          // value={[moment('2015/01/01', "YYYY/MM/DD"), moment('2015/01/01', "YYYY/MM/DD")]}
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
              Total : {emailStore.totalShops} shops
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
              dataSource={emailStore.dataList} columns={this.columns} bordered pagination={false}/>
          </div>
          <Pagination current={emailStore.currentPageListManage} onChange={this.onChange} total={emailStore.totalPageListManage * 10} showSizeChanger={false} />
        </React.Fragment>
        }
        </div>
      </React.Fragment>
    )
  }
}
export default React.memo(ListManage)