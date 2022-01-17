import React, { Component } from 'react'
import { notify } from '../../common/notify/NotifyService'

export default class Home extends Component<any> {
  componentDidMount() {
    notify.show(`Chào mừng ${localStorage.getItem("Uname")?.toUpperCase()} đến với Seller Management Page !`, "success");
    this.props.history.push("/seller-info")
  }
  render() {
    return (
      <div>
      </div>
    )
  }
}
