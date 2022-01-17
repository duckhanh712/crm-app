import React, { Component } from "react";
import { observer } from "mobx-react";
import { Link } from "react-router-dom";
import { menuStore } from "./menuStore";
// import { rawSellerStore } from './../rawSeller/rawSellerStore';
import { crawlSellerStore } from "../crawlSeller/crawlSellerStore";
// import { commonStore } from './../../common/commonStore';

@observer
class Menu extends Component {

  private menuRef = React.createRef<HTMLDivElement>();

  urlCrawlSeller = `/seller-info?page=${crawlSellerStore.currentPage}&limit=${crawlSellerStore.pageSize}&phone_numbers=${crawlSellerStore.phone}`
  render() {
    return (
      <nav className={!menuStore.showMenu ? "sidebar sidebar-offcanvas menu-main" : " menu-main sidebar sidebar-offcanvas active"} ref={this.menuRef} style={{ backgroundColor: "#181824" }}>
        <ul className="nav">
          <React.Fragment>
            {localStorage.getItem("role") === "ROOT" && <li className="nav-item">
              <Link className="nav-link" data-toggle="collapse" to="/manage/list-user"
                aria-expanded="false" aria-controls="list-seller">
                <span className="menu-title" style={{ color: menuStore.option.charAt(0) === "3" ? "#f54b24" : "" }} >
                  Manage
                </span>
                <i className="mdi mdi-account-box menu-icon" style={{ color: menuStore.option.charAt(0) === "3" ? "#f54b24" : "#ffffff" }} />
              </Link>
            </li>}
            <li className="nav-item">
              <a className="nav-link" data-toggle="" href="#list-seller" aria-expanded="true" aria-controls="list-seller">
                <span className="menu-title" style={{ color: menuStore.option.charAt(0) === "1" ? "#f54b24" : "" }} >
                  CHOZOI
                </span>

                <i className="mdi mdi-store menu-icon" style={{ color: menuStore.option.charAt(0) === "1" ? "#f54b24" : "#ffffff" }} />
              </a>
              <div className="collapse show" id="list-seller">
                <ul className="nav flex-column sub-menu">

                  <li className="nav-item">
                    <Link className="nav-link" to={this.urlCrawlSeller} style={{ color: menuStore.option === "1Crawl" ? "#f54b24" : "" }} onClick={() => menuStore.changeOption("1Crawl")}>
                      Information SP
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/seller-chozoi-sd" style={{ color: menuStore.option === "12Crawl" ? "#f54b24" : "" }} onClick={() => menuStore.changeOption("12Crawl")}>
                      Information SD
                    </Link>
                  </li>
                  {/* <li className="nav-item">
                    <Link className="nav-link" to="/seller-tts-cz" style={{ color: menuStore.option === "13Crawl" ? "#f54b24" : "" }} onClick={() => menuStore.changeOption("13Crawl")}>
                      Information TTS
                    </Link>
                  </li> */}
                  <li className="nav-item">
                    <Link className="nav-link" to="/import-seller" style={{ color: menuStore.option === "14Crawl" ? "#f54b24" : "" }} onClick={() => menuStore.changeOption("14Crawl")}>
                      Import Information
                    </Link>
                  </li>
                </ul>
              </div>
            </li>
            <li className="nav-item">
              <a className="nav-link" data-toggle="" href="#list-seller" aria-expanded="true" aria-controls="list-seller">
                <span className="menu-title" style={{ color: menuStore.option.charAt(0) === "4" ? "#f54b24" : "" }} >
                  ZASI
                </span>
                <i className="mdi mdi-store menu-icon" style={{ color: menuStore.option.charAt(0) === "4" ? "#f54b24" : "#ffffff" }} />
              </a>
              <div className="collapse show" id="list-seller">
                <ul className="nav flex-column sub-menu">
                  
                  <li className="nav-item">
                    <Link className="nav-link" to="/seller-zasi" style={{ color: menuStore.option === "4whole" ? "#f54b24" : "" }} onClick={() => menuStore.changeOption("4whole")}>
                      Information Management
                    </Link>
                  </li>
                  {/* <li className="nav-item">
                    <Link className="nav-link" to="/import-seller" style={{ color: menuStore.option === "4WholeImport" ? "#f54b24" : "" }} onClick={() => menuStore.changeOption("1Crawling")}>
                      Import Information
                    </Link>
                  </li> */}
                  <li className="nav-item">
                    <Link className="nav-link" to="/distributor" style={{ color: menuStore.option === "4Distributor" ? "#f54b24" : "" }} onClick={() => menuStore.changeOption("4Crawl")}>
                      Distributor 
                    </Link>
                  </li>
                </ul>
              </div>
            </li>
            <li className="nav-item">
              <a className="nav-link" data-toggle="" href="#list-seller"
                aria-expanded="false" aria-controls="list-seller">
                <span className="menu-title" style={{ color: menuStore.option.charAt(0) === "2" ? "#f54b24" : "" }} >
                  Communicate
                </span>
                <i className="mdi mdi-email-outline menu-icon" style={{ color: menuStore.option.charAt(0) === "2" ? "#f54b24" : "#ffffff" }}></i>
              </a>
              <div className="" id="">
                <ul className="nav flex-column sub-menu">
                  <li className="nav-item">
                    <Link className="nav-link" to="/email" style={{ color: menuStore.option === "2Email" ? "#f54b24" : "" }} onClick={() => menuStore.changeOption("2Email")}>
                      Email
                    </Link>
                  </li>
                </ul>
              </div>
            </li>
          </React.Fragment>
        </ul>
      </nav>
    );
  }
}
export default React.memo(Menu)