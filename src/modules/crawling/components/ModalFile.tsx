import React, { Component } from 'react'
import { Modal } from 'antd';
import { crawlingStore } from '../crawlingStore';
import { Table } from 'antd';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

@observer
export default class ModalFile extends Component<any> {

  @observable private data: any = [];
  columns: any = [
    { title: "Id", dataIndex: "_id" },
    { title: "Username", dataIndex: "username"},
    { title: "Phone Numbers",dataIndex: "phone_numbers",
    render: (phone_numbers: string[]) => (
      <>
        {phone_numbers.length > 0 ?
          <React.Fragment>
            <div className="dropdown show-dropdown option-main open">
              <span data-toggle="dropdown" aria-expanded="true">
                <i className="fas fa-phone" style={{margin: "7px 17px", color: "#f54b24"}}></i>
                <span>
                  {phone_numbers[0]} &nbsp;
                  <i className="fas fa-angle-down" />
                </span>
              </span>
              <ul className="dropdown-menu">
              {phone_numbers.map((phone_number: string, index: number) => {
                return (
                    <li key={index}>
                      <i className="fas fa-phone" style={{margin: "7px 17px", color: "#f54b24"}}></i>
                      <span>{phone_number}</span>
                    </li>
                );
              })}
              </ul>
            </div>
          </React.Fragment>
          :
          <span style={{opacity: "0.7", margin: "0 15px"}}>null</span>
        }
      </>
    ),
    },
    { title: "Type", dataIndex: "is_official_shop",
      render: (check: boolean) => (
        check ? <p style={{margin: "0"}}>Official</p> : <p style={{margin: "0"}}>Nomal</p>
      )
    },
    { title: "Create At", dataIndex: "created_at"},
    { title: "State", dataIndex: "state"},
  ];
  componentDidMount() {
    this.data = this.props.convertedShop;
  }

  cancelModal = () => {
    crawlingStore.activeModalFile = false;
  }
  render() {
    return (
      <Modal visible={crawlingStore.activeModalFile} width={1000} onCancel={this.cancelModal} onOk={this.cancelModal}  >
        <div className="container-table">
          <Table style={{margin: "50px 0"}} dataSource={this.props.rsFile} columns={this.columns} bordered />
        </div>
            {/* <Table style={{margin: "10px 0"}} dataSource={this.props.convertedShop} columns={this.columns} bordered pagination={false}/> */}
        {/* <Pagination current={crawlSellerStore.currentPage} onChange={this.onChange} total={crawlSellerStore.totalPage * 10} showSizeChanger={false} /> */}
      </Modal>
    )
  }
}
