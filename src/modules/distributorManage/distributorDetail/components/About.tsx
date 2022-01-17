import React, { Component } from 'react'
import { observer } from 'mobx-react';
import { observable, toJS } from 'mobx';
import { Select } from "antd"
import TextArea from 'antd/lib/input/TextArea';
import { distributorDetailStore } from "../distributorDetailStore";
import { Moment } from '../../../../common/Moment';
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';

const { Option } = Select;

 
@observer
class About extends Component<any, any> {
  private firstFocusAddress: boolean = false;
  private listPhone: any = [];
  private infoBuffer: any = null;
  // @observable private disableBtnApproved: boolean = shopDetailStore.info?.approve_state === "APPROVED" ;
  @observable private listAddress: any = {
    listProvinces: [],
    listDistricts: [],
    listWards: []
  }

  elementDetail = (title: string, content: any, name: string) => {

    return (

      <React.Fragment>
        {title == "Content" ? <p>
          <span className="span-title"><i className="mdi mdi-crosshairs-gps" />{title}</span>

          <TextArea value={content} style={{ minHeight: "200px", width: "70%", margin: "0px" }} readOnly />
        </p> :
          <p>
            <span className="span-title"><i className="mdi mdi-crosshairs-gps" />{title}</span>
            <span> {content ? content : "null"} </span>
          </p>
        }
      </React.Fragment>
    )
  }



  elementListLinks = (title: string, content: any, name: string) => {
    return (
      <React.Fragment>
        {distributorDetailStore.info?.links === undefined || distributorDetailStore.info?.links.length === 0 ?
          <p>
            <span className="span-title"><i className="mdi mdi-crosshairs-gps" />{title}</span>
            <span>Chưa có website </span>
          </p>
          :
          <p>
            <span className="span-title"><i className="mdi mdi-crosshairs-gps" />{title}</span>
            <div className="dropdown show-dropdown option-main open">
              <span data-toggle="dropdown" aria-expanded="true">
                <i className="fas fa-link" style={{ margin: "7px 17px", color: "#f54b24" }}></i>
                <span>
                  {distributorDetailStore.info?.links !== undefined && distributorDetailStore.info?.links[0]} &nbsp;
                  <i className="fas fa-angle-down" />
                </span>
              </span>
              <ul className="dropdown-menu">
                {distributorDetailStore.info?.links !== undefined && distributorDetailStore.info?.links.map((link: string, index: number) => {
                  return (
                    <li key={index}>
                      <i className="fas fa-link" style={{ margin: "7px 17px", color: "#f54b24" }}></i>
                      {/* <Link className="nav-link" data-toggle="collapse" to={link}>{link}</Link> */}
                      <a href={link} target='_blank'>{link}</a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </p>
        }
      </React.Fragment>
    )
  }


  elementListImages = (title: string) => {
    return (
      <React.Fragment>
        <span className="span-title"><i className="mdi mdi-crosshairs-gps" />{title}</span>
      

        <OwlCarousel className='owl-theme' autoplay nav dots loop  style={ {width: '900px'}} >
        {distributorDetailStore.info?.images !== undefined && distributorDetailStore.info?.images.map((image: any, index: number) => {
          return (
            <li key={index}>
              <div className='item' >
                <img src={image.image_url} style={ {width: '300px', margin: '5px'}}  />
              </div>
            </li>
          );
        })}
        </OwlCarousel>;
      </React.Fragment>
    )
  }
  elementListEmails = (title: string, content: any, name: string) => {
    return (
      <React.Fragment>
        {distributorDetailStore.info?.links === undefined || distributorDetailStore.info?.emails.length === 0 ?
          <p>
            <span className="span-title"><i className="mdi mdi-crosshairs-gps" />{title}</span>
            <span>Chưa có email </span>
          </p>
          :
          <p>
            <span className="span-title"><i className="mdi mdi-crosshairs-gps" />{title}</span>
            <div className="dropdown show-dropdown option-main open">
              <span data-toggle="dropdown" aria-expanded="true">
                <i className="fas fa-inbox" style={{ margin: "7px 17px", color: "#f54b24" }}></i>
                <span>
                  {distributorDetailStore.info?.emails !== undefined && distributorDetailStore.info?.emails[0]} &nbsp;
                  <i className="fas fa-angle-down" />
                </span>
              </span>
              <ul className="dropdown-menu">
                {distributorDetailStore.info?.emails !== undefined && distributorDetailStore.info?.emails.map((email: string, index: number) => {
                  return (
                    <li key={index}>
                      <i className="fas fa-inbox" style={{ margin: "7px 17px", color: "#f54b24" }}></i>
                      {/* <Link className="nav-link" data-toggle="collapse" to={link}>{link}</Link> */}
                      <p >{email}</p>
                    </li>
                  );
                })}
              </ul>
            </div>
          </p>
        }
      </React.Fragment>
    )
  }
  handleDate = (data: any) => {
    var str = "\"" + data + "\"";
    var dateStr = JSON.parse(str);
    var date = new Date(dateStr);
    return Moment.getDate(date.getTime(), "dd/mm/yyyy");
  }
  render() {
    return (
      <div className="container-table">

        {distributorDetailStore.loading ?
          <React.Fragment>
            <div className="loading d-flex-content" style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "142px" }}>
              <img src="/assets/img/loading_data.gif" style={{ width: "10%" }} alt="loading" />
            </div>
          </React.Fragment>
          :
          <React.Fragment>

            <table className="table-about about-product">
              <tr>
                <th style={{ paddingLeft: "37px" }}>Shop Information</th>
                <th style={{ textAlign: "right" }} >

                </th>
              </tr>
              <tr>
                <td>

                  {this.elementDetail("Title", distributorDetailStore.info?.title, "title")}
                  {this.elementListImages("Images",)}
                  {this.elementDetail("Contact Name", distributorDetailStore.info?.contact_name, "contact_name")}
                  {this.elementDetail("Area", distributorDetailStore.info?.priority_area, "priority_area")}
                  {this.elementDetail("Category", distributorDetailStore.info?.category?.category_name, "category_name")}
                  {this.elementDetail("Industry", distributorDetailStore.info?.industry, "industry")}
                  {this.elementDetail("Phone", distributorDetailStore.info?.phone, "phone")}
                  {this.elementListEmails("Emails", distributorDetailStore.info?.emails, "emails")}
                  {this.elementListLinks("Links", distributorDetailStore.info?.links, "links")}
                  {this.elementDetail("Content", distributorDetailStore.info?.content, "content")}
                  {/* {this.elementDetail("Register Time", distributorDetailStore.info?.created_at, "created_at")} */}
                </td>
                <td>
                </td>
              </tr>
            </table>
          </React.Fragment>}
      </div>
    )
  }
}
export default React.memo(About)