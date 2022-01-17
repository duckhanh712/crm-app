import React, { Component } from 'react'
import { commonStore } from '../../common/commonStore'
import "./style.css"
import { menuStore } from './../menu/menuStore';
import { observer } from 'mobx-react';

@observer
class NotFound extends Component {
  componentDidMount() {
    menuStore.changeOption("0NotFound");
    commonStore.setNamePage("Not Found");
  }
  
  render() {
    return (
      <div className="not-page">
        <img className="cls404" src="/assets/img/404.svg" alt="404" />
        <h1 style={{textAlign: "center"}}>Not Found</h1>
      </div>
    )
  }
}
export default React.memo(NotFound)