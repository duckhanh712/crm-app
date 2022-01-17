import React, { Component } from 'react'
import { Alert, Button, Space} from 'antd';
import { observer } from 'mobx-react';

import { manageStore } from './../manageStore';
import { notify } from '../../../common/notify/NotifyService';
import { callApi } from '../../../utils/callAPI';

@observer
export default class AlertResetPw extends Component<any> {

  handleResetPw = async (email: string) => {
    const resultApi = await callApi(
      `/v1/crawlers/auth/user/reset-password`,
      "POST",
      {
        "email": email,
        "password_new": "1"
      },
      true
    );
    if (resultApi.result.status === 200) {
      notify.show("Reset Successful !", "success");
      manageStore.animationReset = false;
    }
  }
  acceptReset = () => {
    manageStore.animationReset = true;
    this.handleResetPw(manageStore.infoBoxResetPw.email);
    manageStore.showAlert = false;
    // manageStore.infoBoxResetPw = {};
  }
  render() {
    return (
        <Alert
          // style={{opacity: manageStore.showAlert ? "1" : "0"}}
          className="alert-reset-pw"
          message="Reset"
          description="Bạn chắc chắn muốn thực hiện tác vụ này ?"
          type="info"
          action={
            <Space direction="vertical">
              <Button size="small" type="primary" 
                onClick={this.acceptReset}>
                Accept
              </Button>
              <Button size="small" danger type="ghost" 
              onClick={() => manageStore.showAlert = false}>
                Cancel
              </Button>
            </Space>
          }
          />

    )
  }
}
