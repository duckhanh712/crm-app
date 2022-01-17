import { loginStore } from './../modules/authen/loginStore';
import { callApi } from './../utils/callAPI';
// import * as Config from "../contants/config"
import StorageService from '../utils/storageService';

export const setPercent = (a: number, b: number) => {
  // a hiện tại, b : quá khứ
  if (a === b) return 0;
  else if (a === 0) { return -100; }
  else if (b === 0) { return 100; }
  else {
    let percent: number = 0;
    percent = 100 * (a - b) / b;
    if (percent - Math.floor(percent) >= 0.95 || percent - Math.floor(percent) <= 0.05 || percent === Math.floor(percent)) {
      return Math.ceil(percent);
    } else {
      return percent.toFixed(1);
    }
  }
}

export const validate = (name: string, value: string, error: any) => {
  if (name === "email") {
    const regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    // const vnf_regex = /((09|03|07|08|05)+([0-9]{8})\b)/g;
    const check = !regex.test(value);
    // const check = regex.test(value) || vnf_regex.test(value) ? false : true;
    // if (!regex.test(value) || !vnf_regex.test(value)) {
    if (check) { 
      error.email =
        "Tài khoản phải là Email";
    } else {
      error.email = "";
    }
  }
  if (name === "name") {
    if (value.trim().length < 6) {
      error.name = "Phải có ít nhất 6 ký tự"
    } else {
      error.name = ""
    }
  }
  if (name === "password" || name === "password_old" || name === "password_new") {
    // console.log("name: ", name);
    if (value.trim().length < 8) {
      error[name] = "Mật khẩu dài hơn 8 kí tự";
    } else {
      error[name] = "";
    }
  }
}

export async function updateFcmToken() {
  // if (localStorage.getItem('notification-permission') === "1") {
  //     let fcmToken: string | null = localStorage.getItem('fcm-token');
  //     if (!fcmToken) {
  //         fcmToken = await messaging.getToken();
  //         localStorage.setItem('fcm-token', fcmToken as string);
  //     }
  //     await service.updateFcmToken(fcmToken as string);
  // }
}
export async function logOut() {
  // const url: string = (window as any).REACT_APP_API_AUTH + 'logout';
  // const result = await deleteRequest(url, {
  //     fcmToken: localStorage.getItem('fcm-token')
  // });
  const resultApi = await callApi(
    "/v1/auth/logout",
    "DELETE",
    { fcmToken: localStorage.getItem('fcm-token') },
    true)
  if (resultApi.result.status < 300) {
    loginStore.user = null;
    StorageService.removeToken();
    StorageService.removeRefreshToken();
    window.location.href = "/";
  }
}