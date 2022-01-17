/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from "react";
import { Link } from "react-router-dom";

import "./style.scss"
import {menuStore} from "../menu/menuStore";
import StorageService from "../../utils/storageService";
import { headerStore } from './headerStore';
import ModalChangePw from './components/ModalChangePw';
import { observer } from "mobx-react";

@observer
class Header extends Component {
  private checkHeader =React.createRef<HTMLDivElement>();
  signOut = () => {
    StorageService.removeToken();
    StorageService.removeName();
    StorageService.removeRole();
    window.location.href = "/"; 
  }
  render() {
    return (
      <nav ref={this.checkHeader} className="navbar default-layout-navbar col-lg-12 col-12 p-0 fixed-top d-flex flex-row" style={{backgroundColor: "#EEEEEE"}}>
        <div className="text-center navbar-brand-wrapper d-flex align-items-center justify-content-center">
          <Link className="navbar-brand brand-logo" to="/">
            {/* <img src="/assets/images/logo.svg" alt="logo" />  */}
            <h1 style={{marginBottom: 0}}>CRM - MCG</h1>
          </Link>
          <a className="navbar-brand brand-logo-mini" href="/">
            <img style={{ width: "37%" }} src="/logo.png" alt="logo" />
          </a>
        </div>
        <div className="navbar-menu-wrapper d-flex align-items-stretch">
          <button className="navbar-toggler navbar-toggler align-self-center" type="button" data-toggle="minimize">
            <span className="mdi mdi-menu" />
            {/* <span className="mdi mdi-menu" onClick={menuStore.changeShowMenu}/> */}
          </button>
          <ul className="navbar-nav navbar-nav-right">
            <li className="nav-item nav-profile dropdown">
              <a className="nav-link dropdown-toggle" id="profileDropdown" href="#/" data-toggle="dropdown" aria-expanded="false">
                <div className="nav-profile-img">
                  {/* <img src="/assets/images/faces/face1.jpg" alt="img" />  */}
                  <div className="avatar-img avatar-img-chu">{localStorage.getItem("Uname")?.substr(0,1)}</div> 
                  <span className="availability-status online" />
                </div>
                <div className="nav-profile-text">
                  <p className="mb-1 text-black">
                    {localStorage.getItem("Uname")} 
                  </p>
                </div>
              </a>
              <div className="dropdown-menu navbar-dropdown" aria-labelledby="profileDropdown">
                {/* {localStorage.getItem("role") === "ROOT" && 
                  <Link className="dropdown-item" to="/manage" >
                    <i className="mdi mdi-account-box mr-2 text-primary"/> Manage
                  </Link>
                }    */}
                <a className="dropdown-item" href="#" onClick={() => {headerStore.handleModal = true; console.log();
                }}>
                  <i className="mdi mdi-cached mr-2 text-success"/>
                  Change Password
                </a>
                <div className="dropdown-divider" />
                <a className="dropdown-item" href="#" onClick={this.signOut}>
                  <i className="mdi mdi-logout mr-2 text-primary"/> Signout
                </a>
              </div>
            </li>
          </ul>
          {headerStore.handleModal && <ModalChangePw />}
          <button className="navbar-toggler navbar-toggler-right d-lg-none align-self-center" type="button" data-toggle="offcanvas">
            {/* <span className="mdi mdi-menu"/> */}
            <span className="mdi mdi-menu" onClick={menuStore.changeShowMenu} />
          </button>
        </div>
      </nav>
    );
  }
}
export default React.memo(Header)