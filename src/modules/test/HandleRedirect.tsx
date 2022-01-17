import React, { Component } from 'react'
import { observer } from 'mobx-react';
import { observable } from 'mobx';

@observer
export default class HandleRedirect extends Component<any> {
  @observable private url: string = ""; 
  componentDidMount() {
    // console.log("url : " , window.location.href);
    this.props.history.push(`${window.location.href}`);
  }
  render() {
    return (<div></div>)
  }
}
