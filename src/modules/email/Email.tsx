import React, { Component } from 'react'
import { observer } from 'mobx-react';
import { Button} from 'antd';

import { emailStore } from './emailStore';
import { menuStore } from './../menu/menuStore';
import ModalEmail from "./components/ModalEmail"; 
import DetailShop from './components/DetailShop';
import ListManage from './components/ListManage';
import './styleEmail.scss';

@observer
class Email extends Component<any> {
  
  componentDidMount() {
    menuStore.changeOption("2Email");
  }
  render() {
    return ( 
      <React.Fragment>
        <div className="email-style">
        <div className="nav-option" style={{border: "none"}}>
          <div className={!emailStore.showDetail ? "about active" : "about" } onClick={() => emailStore.showDetail = false}>List Manage</div>
          <div className={!emailStore.showDetail ? "product" : " product active" } onClick={() => emailStore.showDetail = true}>Detail Shop</div>
          <Button type="primary" className="btn-back" onClick={() => emailStore.handleModal = true}>
            Send Email
          </Button>
        </div>
        <div className="modal-email-main">
        {emailStore.handleModal && <ModalEmail />}
        </div>
        {!emailStore.showDetail ? 
          <ListManage />
        :
          <DetailShop />
        }
        </div>
      </React.Fragment>
    )
  }
}
export default React.memo(Email)