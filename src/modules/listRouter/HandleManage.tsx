import React, { Component } from 'react'
import { ManageRouters } from './ManageRouters';

export default class HandleManage extends Component {
  render() {
    if(localStorage.getItem("role") === "ROOT"){
      return (
        <div>
          <ManageRouters />
        </div>
      )
    }else{
      return (
        <div></div>
      );
    }
  }
}
