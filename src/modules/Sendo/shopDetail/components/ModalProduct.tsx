/* eslint-disable eqeqeq */
import React, { Component } from 'react'
import { Button, Input, Modal, Select } from 'antd';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { shopDetailStore } from '../shopDetailStore';
import { callApi } from '../../../../utils/callAPI';
import { notify } from '../../../../common/notify/NotifyService';
import TextArea from 'antd/lib/input/TextArea';
import { numberWithCommas } from '../../../../common/BaseFunction';
// import { isTemplateExpression } from 'typescript';

const { Option } = Select;

@observer
class ModalProduct extends Component<any> {
  private arrImg: any = [];
  // private urlMinus: string = "https://i.imgur.com/spnFx5r.png";
  @observable private editInfoProduct: boolean = false;
  @observable public undoImage: boolean = false;
  constructor(props: any) {
    super(props);
    this.arrImg = shopDetailStore.currentProduct?.images;
    this.state = {
      avatarImg: "/assets/icons/profile/avatar_icon.svg",
    };
    // this.getSurveyReport = this.getSurveyReport.bind(this);
  }
  @observable urlImg: string = "";
  showInfoDetail = (title: string, name: string, content: any) => {
    return (
      <div className="modal-info">
        <h3 style={{ marginBottom: "0" }}>{title}</h3>
        {this.editInfoProduct ?
          <Input defaultValue={content} placeholder={title} name={name} onChange={this.handleInput} />
          :
          <p>{content ? content : "null"}</p>
        }
      </div>
    )
  }
  showInfoLink = (title: string, name: string, content: any) => {
    return (
      <div className="modal-info">
        <h3 style={{ marginBottom: "0" }}>{title}</h3>
        {this.editInfoProduct ?
          <p>{name}</p>
          :
          <a href={content} target="_blank">{name}</a>
        }
      </div>
    )
  }
  showInfoPrice = (title: string, name: string, content: any) => {
    return (
      <div className="modal-info">
        <h3 style={{ marginBottom: "0" }}>{title}</h3>
        {this.editInfoProduct ?
          <Input defaultValue={content} placeholder={title} name={name} onChange={this.handleInput} />
          :
          <p>{content ? numberWithCommas(content) : "null"}</p>
        }
      </div>
    )
  }
  handlePackingSize = (index: number, e: any) => {
    const regex = /^[0-9]+$/;
    if (regex.test(e.target.value))
      shopDetailStore.currentProduct.packing_size[index] = e.target.value;
    else {
      notify.show("Yêu cầu nhập số ", "error");
    }
  }
  showPackingSize = (title: string, name: string, content: any) => {
    return (
      <div className="modal-info">
        <h3 style={{ marginBottom: "0" }}>{title}</h3>
        {!this.editInfoProduct ?
          <React.Fragment>
            {content.map((item: string, index: number) => {
              return (
                <span key={index}> {item}  &ensp;</span>

              );
            })}
          </React.Fragment>
          :
          <React.Fragment>
            <Input defaultValue={content[0]} onChange={(e) => this.handlePackingSize(0, e)} />
            <Input defaultValue={content[1]} onChange={(e) => this.handlePackingSize(1, e)} />
            <Input defaultValue={content[2]} onChange={(e) => this.handlePackingSize(2, e)} />
          </React.Fragment>
        }
      </div>
    )
  }
  // handleChange = (name: string, value: any) => {
  //   shopDetailStore.currentProduct = {
  //     ...shopDetailStore.currentProduct,
  //     [name]: value
  //   }
  // }
  showTagSelect = (title: string, name: string, content: any) => {
    return (
      <div className="modal-info">
        <h3 style={{ marginBottom: "0" }}>{title}</h3>
        {!this.editInfoProduct ?
          <p>{content ? content : "null"}</p>
          :
          <Select defaultValue={content} style={{ width: "88%", margin: "10px" }}>
            <Option value="NEW">NEW</Option>
            <Option value="SECOND HAND">SECOND HAND</Option>
          </Select>
        }
      </div>
    )
  }
  showCategory = (title: string, name: string, content: any) => {
    return (
      <div className="modal-info">
        <h3 style={{ marginBottom: "0", width: "100%" }}>{title}</h3>
        {!this.editInfoProduct ?
          <React.Fragment>
            <div style={{ marginLeft: "200px" }}>
                  <div>
                    <span> {` ${content?.id} - ${content?.name}` } &ensp;</span>

                  </div>
            </div>
          </React.Fragment>
          :
          <React.Fragment>

            <div className="border-bottom ml-2">
              <div className="d-flex align-items-center w-100">
                <label className="w-25 mr-4">ID category</label>
                <Input className="w-50" value={content.id} onChange={(e: any) => content.id = (e.currentTarget.value)} />
              </div>
              <div className="d-flex align-items-center w-100">
                <label className="w-25 mr-4">Name category</label>
                <Input className="w-50" value={content.name} onChange={(e: any) => content.name = (e.currentTarget.value)} />
              </div>
            </div>
          </React.Fragment>

        }
      </div>
    )
  }
  showDes = (title: string, name: string, content: any) => {
    return (
      <div className="modal-info" style={{ display: "flex" }}>
        <h3 style={{ marginBottom: "0" }}>{title}</h3>
        {this.editInfoProduct ?
          <TextArea value={content} style={{ minHeight: "200px", width: "70%", margin: "10px" }} name={name} onChange={this.handleInput} />
          :
          <TextArea value={content} style={{ minHeight: "200px", width: "70%", margin: "0px" }} readOnly />
        }
      </div>
    )
  }
  handleInput = (event: any) => {
    const { name, value } = event.target;
    switch (name) {
      case "in_quantity":
        shopDetailStore.currentProduct.variants[0].inventory.in_quantity = value;
        break;
      case "sale_price":
        shopDetailStore.currentProduct.variants[0].sale_price = value;
        break;
      case "price":
        shopDetailStore.currentProduct.variants[0].price = value;
        break;
      default:
        shopDetailStore.currentProduct = {
          ...shopDetailStore.currentProduct,
          [name]: value
        }
        break;
    }
  }
  saveChangeInfo = async () => {

    const arrImgMain = await this.arrImg.filter((item: any, index: number) => (item.active === true));
    let images: any[] = [];
    arrImgMain.map((item: any) => {
      images.push(item.image_url);
    });

    if (shopDetailStore.currentProduct.images.length != 0 && arrImgMain.length <= 0) {
      notify.show("Tiến hành chọn ảnh !", "warning");
      return;
    }
    const resultApi = await callApi(
      `/v1/crawlers/sendo/shops/${shopDetailStore.id}/products/${shopDetailStore.product_id}`,
      "PUT",
      {
        "packing_size": shopDetailStore.currentProduct.packing_size,
        "images": arrImgMain,
        "description": shopDetailStore.currentProduct.description,
        "type": shopDetailStore.currentProduct.type,
        "condition": shopDetailStore.currentProduct.condition,
        "is_quantity_limited": shopDetailStore.currentProduct.is_quantity_limited,
        "weight": shopDetailStore.currentProduct.weight,
        "auto_public": shopDetailStore.currentProduct.auto_public,
        "variants": shopDetailStore.currentProduct.variants,
        "free_ship_status": shopDetailStore.currentProduct.free_ship_status,
        "shipping_partner_code": shopDetailStore.currentProduct.shipping_partner_code,
        "name": shopDetailStore.currentProduct.name,
        "category": shopDetailStore.currentProduct.category,
        "platform": shopDetailStore.currentProduct.platform,
      },
      true
    )
    if (resultApi.result.status === 200) {
      const resultApiFixProduct = await callApi(
        `/v1/crawlers/sendo/shops/${this.props.id}/products?page=${shopDetailStore.currentPage}&limit=${shopDetailStore.pageSizeProducts}`,
        "GET",
        {},
        true
      )
      if (resultApiFixProduct.result.status === 200) {
        shopDetailStore.getDate(resultApiFixProduct.result.data.data);
        shopDetailStore.infoProducts = resultApiFixProduct.result.data.data;
        shopDetailStore.totalProducts = resultApiFixProduct.result.data.pagination.total_elements;
        shopDetailStore.totalPage = Math.ceil(resultApiFixProduct.result.data.pagination.total_elements / shopDetailStore.pageSizeProducts);
        // console.log("data : ", resultApi.result.data);
      }
      this.editInfoProduct = false;
      notify.show("Sửa thành công !", "success");
      this.props.supportFixDetail();
      shopDetailStore.handleModal = false;
    }
  }
  cancelEditDetail = async () => {
    this.editInfoProduct = false;
    this.arrImg = [];
    shopDetailStore.handleModal = false;
  }
  handleImg = (index: number) => {

    if (!this.editInfoProduct) return;
    let previewImages: any = document.getElementsByClassName('img-preview');
    let timesClick: any = document.getElementsByClassName('timesClick');
    let undoClick: any = document.getElementsByClassName('undoClick');

    // console.log("img : ", previewImages[index].src);
    // if(previewImages[index].style.opacity == 0.3){
    //   this.arrImg.splice(index, 0 ,{
    //     "image_url" : previewImages[index].src, 
    //     "sort": index
    //   });
    //   previewImages[index].style.opacity = 1;
    // } else {
    //   previewImages[index].style.opacity = 0.3;
    //   this.arrImg.splice(index, 1 );
    // }
    // console.log("data img : ", this.arrImg); 
    if (previewImages[index].style.opacity == 1) {
      this.arrImg[index].active = false;
      previewImages[index].style.opacity = 0.1;
      timesClick[index].style.opacity = 0;
      undoClick[index].style.opacity = 1;


    } else {
      this.arrImg[index].active = true;
      previewImages[index].style.opacity = 1;
      timesClick[index].style.opacity = 1;
      undoClick[index].style.opacity = 0;

    }
  }
  cancel = () => {
    if (!this.editInfoProduct) {
      shopDetailStore.handleModal = false;
    } else {
      notify.show("Save or Cancel ? ", "warning");
    }
  }
  handleEitProduct = () => {
    const arrImageTempt = shopDetailStore.currentProduct?.images;
    let arr: any[] = [];
    arrImageTempt.map((item: any, index: Number) => {
      arr.push({
        image_url: item.image_url,
        sort: index
      });
    });
    this.arrImg = arr;
    this.arrImg.map((item: any, index: number) => {
      item.active = true;
      return null;
    })
    this.editInfoProduct = true;
  }
  render() {
    let customClass = this.editInfoProduct ? `pointer` : "";
    // let customClass = this.editInfoProduct ? `url(https://i.imgur.com/spnFx5r.png}), auto` : "";
    return (
      <React.Fragment>
        <Modal visible={shopDetailStore.handleModal} width={1000} onCancel={this.cancel} onOk={() => { if (this.editInfoProduct) this.saveChangeInfo() }} >
          {this.editInfoProduct ?
            <React.Fragment>
              <Button className="btn-edit" type="primary" onClick={this.saveChangeInfo}>
                Save
              </Button>
              <Button className="btn-edit" type="primary" style={{ backgroundColor: "#f2b04d" }} onClick={this.cancelEditDetail}>
                Cancel
              </Button>
            </React.Fragment>
            :
            <Button className="btn-edit" type="primary" style={{ backgroundColor: "#f4b658" }} onClick={this.handleEitProduct}>
              Edit
            </Button>
          }
          <React.Fragment>
            {this.editInfoProduct && <h3 style={{ fontWeight: 600, margin: "15px" }}>Chọn hình ảnh</h3>}
            <div className="img-content-product">
              <div className="imgs">
              {shopDetailStore.currentProduct?.images !== undefined && shopDetailStore.currentProduct?.images.map((item: any, index: number) => (
                  <div className="image position-relative" key={index}>
                    {this.editInfoProduct ?
                      <i className="fas fa-times timesClick" onClick={(e) => this.handleImg(index)} style={{ fontSize: `14px`, color: `white`, borderRadius: `50%`, cursor: `pointer`, display: `inline-flex`, backgroundColor: `#FE2E2E`, position: `absolute`, right: `-3px`, justifyContent: `center`, zIndex: 10, width: `20px`, height: `20px`, alignItems: `center` }} />
                      :
                      <i></i>
                    }
                    <i className="fas fa-undo undoClick " onClick={(e) => this.handleImg(index)} style={{ fontSize: `20px`, opacity: "0", color: `#848484`, cursor: `pointer`, display: `inline-flex`, position: `absolute`, right: `76px`, top: '76px', justifyContent: `center`, zIndex: 10, width: `20px`, height: `20px`, alignItems: `center` }} />
                    <img className="img-preview" src={item.image_url} alt="img" onClick={(e) => this.handleImg(index)} style={{ opacity: "1", width: `152px`, border: "1px solid" }} />
                  </div>
                ))}
              </div>
              <div className="content-detail-product">
                {this.showInfoDetail("Tên sản phẩm ", "name", shopDetailStore.currentProduct?.name)}
                {this.showInfoLink("Link sản phẩm", "Go to", shopDetailStore.currentProduct?.link)}
                {this.showCategory("Thể loại ", "category", shopDetailStore.currentProduct?.category)}
                {this.showInfoPrice("Giá gốc", "price", shopDetailStore.currentProduct?.variants[0].price)}
                {this.showDes("Mô tả ", "description", shopDetailStore.currentProduct?.description_pickingout)}
                {this.showInfoDetail("Cận nặng  ", "weight", shopDetailStore.currentProduct?.weight)}
                {this.showDes("Mô tả nổi bật ", "description", shopDetailStore.currentProduct?.description)}
                {this.showPackingSize("Packing Size", "packing_size", shopDetailStore.currentProduct?.packing_size)}
              </div>
            </div>
          </React.Fragment>
        </Modal>
      </React.Fragment>
    )
  }
}
export default React.memo(ModalProduct)
