import React, { Component } from 'react'
import { Table, Modal } from 'antd';
import { observer } from 'mobx-react';
import TextArea from 'antd/lib/input/TextArea';

import { shopDetailStore } from './../shopDetailStore';

@observer
class ModalLog extends Component {
  cancel = () => {
    shopDetailStore.handleModalLog = false;
  }
  columns: any = [
    { title: "UserName", dataIndex: "user"},
    { title: "Status", dataIndex: "status"},
    { title: "Note", dataIndex: "note", 
      render: (note: any) => {
        return (
          <TextArea value={note} style={{minHeight: "30px", maxWidth: "260px"}} readOnly/>
          // <TextArea value={note} style={{minHeight: "30px", margin: "0px 10px"}} readOnly/>
        )
      }
    },
    { title: "Created At", dataIndex: "created_at"},
  ];
  render() {    
    return (
      <React.Fragment>
        <Modal visible={shopDetailStore.handleModalLog} width={1000} onCancel={this.cancel} onOk={this.cancel} >
          <Table style={{marginTop: "30px"}}
            dataSource={shopDetailStore.dataModalLog} columns={this.columns}
            bordered pagination={{defaultPageSize: 5}}/>
        </Modal>
      </React.Fragment>
    )
  }
}
export default React.memo(ModalLog)