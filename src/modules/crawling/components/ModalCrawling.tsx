import React, { Component } from 'react'
import { Modal } from 'antd';
import { crawlingStore } from './../crawlingStore';
import { Table } from 'antd';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

@observer
export default class ModalCrawling extends Component<any> {

  @observable private data: any = [];
  columns: any = [
    { title: "Id", dataIndex: "_id" },
    { title: "Link", dataIndex: "link"},
    { title: "Name", dataIndex: "name"},
    { title: "Username", dataIndex: "username"},
    { title: "State", dataIndex: "state"},
  ];
  componentDidMount() {
    this.data = this.props.convertedShop;
  }

  cancelModal = () => {
    // this.props.changeProps();
    crawlingStore.activeModal = false;
  }
  render() {
    return (
      <Modal visible={crawlingStore.activeModal} width={1000} onCancel={this.cancelModal} onOk={this.cancelModal}  >
        {this.props.rawShop !== undefined && this.props.rawShop.length > 0 ? 
          <React.Fragment>
            <h3 style={{fontWeight: 700, marginTop: "45px"}}>Các shop chưa được crawl </h3>
            {this.props.rawShop.map((item: any, index: number) => {
              return <p>{item}</p>
            })}
          </React.Fragment>
        :
          null
        }
        { this.data.length > 0 ? 
        // { this.props.convertedShop.length > 0 ? 
          <React.Fragment>
            <h3 style={{fontWeight: 700, marginTop: "45px"}}>Các shop đã được crawl trước</h3>
            <div className="container-table">
              <Table style={{margin: "10px 0"}} dataSource={this.data} columns={this.columns} bordered pagination={false}/>
            </div>
            {/* <Table style={{margin: "10px 0"}} dataSource={this.props.convertedShop} columns={this.columns} bordered pagination={false}/> */}
          </React.Fragment>
          :
          null
        }
        {/* <Pagination current={crawlSellerStore.currentPage} onChange={this.onChange} total={crawlSellerStore.totalPage * 10} showSizeChanger={false} /> */}
      </Modal>
    )
  }
}
