import React, { Component } from 'react'
import { observer } from 'mobx-react';
import { observable, toJS } from 'mobx';
import { AutoComplete, Button, Input, Select } from "antd"
import TextArea from 'antd/lib/input/TextArea';
import { shopDetailStore } from "../shopDetailStore";
import { Moment } from '../../../../common/Moment';
import { callApiChozoi, callApi } from '../../../../utils/callAPI';
import { notify } from '../../../../common/notify/NotifyService';
// import { crawlSellerStore } from '../../crawlSeller/crawlSellerStore';
import ModalLog from './ModalLog';

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
  componentWillUnmount() {
    shopDetailStore.edit = false;
    this.listPhone = []
  }
  elementDetail = (title: string, content: any, name: string) => {
    if (title === "Register Time" || title === "Aprroved Time") {
      content = this.handleDate(content);
    }
    return (
      <React.Fragment>
        {title !== "Description" ? <p>
          <span className="span-title"><i className="mdi mdi-crosshairs-gps" />{title}</span>
          {shopDetailStore.edit && title !== "Register Time" ?
            <Input placeholder={title} name={name} defaultValue={content} onChange={this.handleInput} />
            :
            <span> {content ? content : "-----"} </span>
          }
        </p> :
          <p>
            <span className="span-title"><i className="mdi mdi-crosshairs-gps" />{title}</span>
            {shopDetailStore.edit ?
              <TextArea value={content} style={{ minHeight: "200px", width: "70%", margin: "10px" }} name={name} onChange={this.handleInput} />
              :
              <TextArea value={content} style={{ minHeight: "200px", width: "70%", margin: "0px" }} readOnly />
            }
          </p>
        }
      </React.Fragment>
    )
  }
  handleSelectAddress = async (value: any, key: string) => {
    const arr = value.split("-");
    if (key === "province") {
      shopDetailStore.info.address.district.district_name = shopDetailStore.info.address.ward.ward_name = "";
      shopDetailStore.info.address = {
        ...shopDetailStore.info.address,
        [key]: { province_id: arr[1], province_name: arr[0] }
      }
      const rs = await callApiChozoi(
        `/v1/districts?provinceId=${arr[1]}`,
        "GET",
        {},
        false
      );
      if (rs.result.status === 200) this.listAddress.listDistricts = rs.result.data.districts;
    }
    else if (key === "district") {
      shopDetailStore.info.address = {
        ...shopDetailStore.info.address,
        [key]: { district_id: arr[1], district_name: arr[0] }
      }
      const rs = await callApiChozoi(
        `/v1/wards?districtId=${arr[1]}`,
        "GET",
        {},
        false
      );
      if (rs.result.status === 200) this.listAddress.listWards = rs.result.data.wards;
    } else if (key === "ward") {
      shopDetailStore.info.address = {
        ...shopDetailStore.info.address,
        [key]: { ward_id: arr[1], ward_name: arr[0] }
      }
      shopDetailStore.info.address.address_detail = `${shopDetailStore.info.address.ward.ward_name}, ${shopDetailStore.info.address.district.district_name}, ${shopDetailStore.info.address.province.province_name}`
    }
  }
  handleFocusSelect = async () => {
    if (!this.firstFocusAddress) {
      const rs = await callApiChozoi(
        `/v1/districts?provinceId=${shopDetailStore.info.address.province.province_id}`,
        "GET",
        {},
        false
      );
      if (rs.result.status === 200) this.listAddress.listDistricts = rs.result.data.districts;
      this.firstFocusAddress = true;
    } else return null;
  }
  elementSelectBoxForAddress = (title: string, content: any, name: string) => {
    return (
      <React.Fragment>
        <p>
          <span className="span-title"><i className="mdi mdi-crosshairs-gps" />{title}</span>
          {shopDetailStore.edit ?
            <React.Fragment>
              <Select
                placeholder="choose province ... "
                defaultValue={content?.province.province_name}
                style={{ minWidth: "150px", marginLeft: "7px" }}
                onFocus={() => this.handleFocusSelect}
                onChange={(value) => this.handleSelectAddress(value, "province")}>
                {this.listAddress.listProvinces.length > 0 && this.listAddress.listProvinces.map((item: any, index: number) =>
                  <Option value={`${item.provinceName}-${item.id}`} key={item.id}>{item.provinceName}</Option>
                )}
              </Select>
              <Select
                placeholder="choose district ..."
                defaultValue={content?.district.district_name}
                style={{ minWidth: "150px", marginLeft: "7px" }}
                onChange={(value) => this.handleSelectAddress(value, "district")}>
                {this.listAddress.listDistricts.length > 0 && this.listAddress.listDistricts.map((item: any, index: number) =>
                  <Option value={`${item.districtName}-${item.id}`} key={item.id}>{item.districtName}</Option>
                )}
              </Select>
              <Select
                placeholder="choose ward..."
                defaultValue={content?.ward.ward_name}
                style={{ minWidth: "150px", marginLeft: "7px" }}
                onChange={(value) => this.handleSelectAddress(value, "ward")}>
                {this.listAddress.listWards.length > 0 && this.listAddress.listWards.map((item: any, index: number) =>
                  <Option value={`${item.wardName}-${item.id}`} key={item.id}>{item.wardName}</Option>
                )}
              </Select>
            </React.Fragment>
            :
            <span> {content?.address_detail ? content?.address_detail : "null"} </span>
          }
        </p>
      </React.Fragment>
    )
  }
  handleSelectApproveState = (value: any) => {
    shopDetailStore.info.approve_state = value;
  }
  elementSelectBox = (title: string, content: any, name: string) => {
    return (
      <React.Fragment>
        <p>
          <span className="span-title"><i className="mdi mdi-crosshairs-gps" />{title}</span>
          {shopDetailStore.edit ?
            <Select defaultValue={content} style={{ width: 120, marginLeft: "10px" }} onChange={(value) => this.handleSelectApproveState(value)}>
              <Option value="APPROVED">APPROVED</Option>
              <Option value="INIT">INIT</Option>

            </Select>
            :
            <button className={content == "INIT" ? 'btn-gradient-danger' : "btn-gradient-info"} > {content ? content : "null"} </button>
          }
        </p>
      </React.Fragment>
    )
  }
  elementMainPhone = (title: string, content: any, name: string) => {
    this.listPhone = [];
    shopDetailStore.info?.phone_numbers !== undefined && shopDetailStore.info?.phone_numbers.map((item: any, index: any) => {
      this.listPhone.push({
        value: item
      })
    })
    return (
      <p>
        <span className="span-title"><i className="mdi mdi-crosshairs-gps" />{title}</span>
        { shopDetailStore.edit ?
          <Input.Group compact style={{ margin: "10px", width: "70%" }}>
            <AutoComplete
              value={content}
              onChange={this.handleInputMainPhone}
              style={{ width: '70%' }}
              placeholder="Main phone"
              options={this.listPhone}
            // options={[{ value: 'text 1' }, { value: 'text 2' }]}
            />
          </Input.Group>
          :
          <span> {content ? content : "null"} </span>
        }
      </p>
    )
  }
  elementLink = (title: string, content: any, name: string) => {

    return (
      <p>
        <span className="span-title"><i className="mdi mdi-crosshairs-gps" />{title}</span>
        { shopDetailStore.edit ?
          <span> {content ? content : "null"} </span>
          :
          <a href={content ? content : "null"} target="_blank">{content ? content : "null"} </a>

        }
      </p>
    )
  }
  elementDetailImporttant = (title: string, content: any, name: string) => {

    return (
      <p>
        <span className="span-title"><i className="mdi mdi-crosshairs-gps" />{title}</span>
        { shopDetailStore.edit ?
          <span> {content ? content : "null"} </span>
          :
          <a >{content ? content : "null"} </a>

        }
      </p>
    )
  }
  elementListPhone = (title: string, content: any, name: string) => {
    return (
      <React.Fragment>
        {shopDetailStore.info?.phone_numbers !== undefined && shopDetailStore.info?.phone_numbers.length === 0 ?
          <p>
            <span className="span-title"><i className="mdi mdi-crosshairs-gps" />{title}</span>
            <span>Chưa có số điện thoại </span>
          </p>
          :
          <p>
            <span className="span-title"><i className="mdi mdi-crosshairs-gps" />{title}</span>
            <div className="dropdown show-dropdown option-main open">
              <span data-toggle="dropdown" aria-expanded="true">
                <i className="fas fa-phone" style={{ margin: "7px 17px", color: "#f54b24" }}></i>
                <span>
                  {shopDetailStore.info?.phone_numbers !== undefined && shopDetailStore.info?.phone_numbers[0]} &nbsp;
                    <i className="fas fa-angle-down" />
                </span>
              </span>
              <ul className="dropdown-menu">
                {shopDetailStore.info?.phone_numbers !== undefined && shopDetailStore.info?.phone_numbers.map((phone_number: string, index: number) => {
                  return (
                    <li key={index}>
                      <i className="fas fa-phone" style={{ margin: "7px 17px", color: "#f54b24" }}></i>
                      <span>{phone_number}</span>
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
  handleInput = (event: any) => {
    const { name, value } = event.target;
    shopDetailStore.updateDetailShop(name, value);
  }
  handleInputMainPhone = (e: any) => {
    shopDetailStore.updateDetailShop("phone_number", e);
  }
  saveChangeInfo = async () => {
    // console.log("address new : ", toJS(shopDetailStore.info?.address));
    if (shopDetailStore.info.address.province.province_name === "" || shopDetailStore.info.address.district.district_name === "" || shopDetailStore.info.address.ward.ward_name === "") {
      notify.show("Yêu cầu chọn đúng địa chỉ !", "warning");
      return;
    } else {
      const resultApi = await callApi(
        `/v1/crawlers/sendo/shops/${shopDetailStore.id}`,
        "PUT",
        {

          "password": shopDetailStore.info?.password,
          "phone_number": shopDetailStore.info?.phone_number,
          "email": shopDetailStore.info?.email,
          "contact_name": shopDetailStore.info?.contact_name,
          "total_products": shopDetailStore.info?.total_products,
          "username": shopDetailStore.info?.username,
          "name": shopDetailStore.info?.name,
          "img_avatar_url": shopDetailStore.info?.img_avatar_url,
          "img_cover_url": shopDetailStore.info?.img_cover_url,
          "description": shopDetailStore.info?.description,
          "state": shopDetailStore.info?.state,
          "address": shopDetailStore.info?.address,
          "approve_state": shopDetailStore.info?.approve_state,
          "cz_shop_id": shopDetailStore.info?.cz_shop_id

        },
        true
      )
      if (resultApi.result.status === 200) {
        notify.show("Sửa thành công !", "success");
        this.infoBuffer = null;
        shopDetailStore.editDetail();
      }
    }
  }
  elementError = (title: string, content: any, name: string) => {

    return (
      <p>
        <span className="span-title"><i className="mdi mdi-crosshairs-gps " />{title}</span>
        { shopDetailStore.edit ?
          <span className="text-danger"> {content ? content : "---"} </span>
          :
          <a  className="text-danger">{content ? `"${content}"` : "---"} </a>

        }
      </p>
    )
  }
  cancelEditDetail = async () => {
    shopDetailStore.info = this.infoBuffer;
    shopDetailStore.editDetail();
  }
  // handleApprove = async () => {
  //   const resultApi = await callApi(
  //     `/v1/crawlers/sendo/shops/${shopDetailStore.id}/product-approve-all`,
  //     "POST",
  //     {
  //       "shop_ids": [shopDetailStore.id],
  //       "type": 1,
  //     },
  //     true
  //   );
  //   if (resultApi.result.status === 200) {
  //     notify.show(" Approved ", "success")
  //     shopDetailStore.info.approve_state = "APPROVED";
  //     // console.log("data : ", resultApi.result.data.pagination.total_elements);
  //   }
  // }
  editDetail = async () => {
    const rs = await callApiChozoi(
      `/v1/provinces`,
      "GET",
      {},
      false
    );
    if (rs.result.status === 200) this.listAddress.listProvinces = rs.result.data.provinces;
    if (this.infoBuffer === null) this.infoBuffer = toJS(shopDetailStore.info);
    shopDetailStore.editDetail();
  }
  render() {
    return (
      <div className="container-table">
        {shopDetailStore.handleModalLog && <ModalLog />}

        {shopDetailStore.loading ?
          <React.Fragment>
            <div className="loading d-flex-content" style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "142px" }}>
              <img src="/assets/img/loading_data.gif" style={{ width: "10%" }} alt="loading" />
            </div>
          </React.Fragment>
          :
          <React.Fragment>
            <div className="img-cover" style={{ height: shopDetailStore.info.img_cover_url !== "" ? "300px" : "170px" }}>
              {shopDetailStore.info.img_avatar_url !== "" ?
                <img src={shopDetailStore.info.img_avatar_url} alt="avatar-img" className="avatar-img" />
                :
                <div className="avatar-img avatar-img-chu">{shopDetailStore.info?.name !== undefined && shopDetailStore.info?.name.substr(0, 1)}</div>
              }
              {shopDetailStore.info.img_cover_url !== "" &&
                <img src={shopDetailStore.info.img_cover_url} alt="cover-img" className="cover-img" />}
            </div>
            <table className="table-about about-product">
              <tr>
                <th style={{ paddingLeft: "37px" }}>Seller Information</th>
                <th style={{ textAlign: "right" }} >
                  {!shopDetailStore.edit ?
                    <React.Fragment>
                      <Button type="primary" style={{ backgroundColor: "#f54b24", margin: "5px 20px" }} onClick={this.editDetail}>
                        Edit
                </Button>
                    </React.Fragment>
                    :
                    <React.Fragment>
                      <Button type="primary" style={{ margin: "5px 10px" }} onClick={this.saveChangeInfo} >
                        Save
                </Button>
                      <Button type="primary" style={{ backgroundColor: "#f54b24", margin: "5px 10px" }} onClick={this.cancelEditDetail}>
                        {/* <Button type="primary" style={{backgroundColor: "#f54b24", margin: "5px 10px"}} onClick={shopDetailStore.editDetail}> */}
                  Cancel
                </Button>
                    </React.Fragment>
                  }
                  <Button type="primary" className="approve-btn-detail" disabled={shopDetailStore.edit}>
                    {shopDetailStore.info?.approve_state === "APPROVED" ?
                      "Approved"
                      :
                      "Approve Shop"
                    }
                  </Button>
                </th>
              </tr>
              <tr>
                <td>
                  {this.elementDetailImporttant("ID", shopDetailStore.info?._id, "_id")}
                  {this.elementDetail("Userame", shopDetailStore.info?.username, "username")}
                  {this.elementDetail("Password", shopDetailStore.info?.password, "password")}
                  {this.elementDetail("Shop Name", shopDetailStore.info?.name, "name")}
                  {this.elementDetail("Email", shopDetailStore.info?.email, "email")}
                  {this.elementSelectBoxForAddress("Address", shopDetailStore.info?.address, "address")}
                  {this.elementLink("Link", shopDetailStore.info?.link, "link")}
                  {this.elementMainPhone("Main Phone", shopDetailStore.info?.phone_number, "phone_number")}
                  {this.elementDetail("Shop ID CZ", shopDetailStore.info?.cz_shop_id, "cz_shop_id")}
                  {this.elementSelectBox("Approve state", shopDetailStore.info?.approve_state, "approve_state")}
                  {shopDetailStore.info?.approve_error ? this.elementError("Approve Error", shopDetailStore.info?.approve_error?.message, "appove_error") : ""}
                  {this.elementDetail("Aprroved Time", shopDetailStore.info?.approve_date, "approve_date")}
                  {this.elementDetail("Description", shopDetailStore.info?.description, "description")}
                  {this.elementDetail("Register Time", shopDetailStore.info?.created_at, "created_at")}
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