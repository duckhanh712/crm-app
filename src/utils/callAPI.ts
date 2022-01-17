import axios from "axios";
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import * as Config from "../contants/config";
import storageService from "./storageService";
import { notify } from './../common/notify/NotifyService';

type response = {
  result: {
    data: any,
    status: number
  }
  error: any
}

// axios.interceptors.response.use(res => {
//   return res;
// }, e => {
//   if (e.)
// })
// @ts-ignore
const refreshAuthLogic = failedRequest => axios.post(Constants.API_URL + '/v1/auth/refreshToken', {'refreshToken': StorageService.getRefreshToken()}).then(tokenRefreshResponse => {
  storageService.setToken(tokenRefreshResponse.data.refreshToken);
  failedRequest.response.config.headers["Authorization"] = tokenRefreshResponse.data.refreshToken;
  return Promise.resolve();

}).catch(function (error) {
  storageService.removeToken();
  storageService.removeRefreshToken()
  window.location.href = "/"
  return Promise.reject();
});

export const callApiChozoi = async (endpoint: string, method: any, body: any, isNeedAuth: boolean = true) => {
  const source = axios.CancelToken.source();
  var response: response = {
    result: {
      data: null,
      status: 500,
    },
    error: null
  }
  var newHeaders: any = {'Content-Type': 'application/json'};
  if (isNeedAuth && storageService.isTokenExits()) { 
    newHeaders["x-chozoi-token"] = storageService.getToken();
    // newHeaders["Authorization"] = 'Bearer ' + storageService.getToken();
    createAuthRefreshInterceptor(axios, refreshAuthLogic, {
        pauseInstanceWhileRefreshing: true
    });
  }
  try {
    const result = await axios({
      method: method,
      url: Config.CHOZOI_URL + endpoint,
      headers: newHeaders,
      data: body,
      cancelToken: source.token
    })
    response.result.data = result?.data;
    response.result.status = result?.status;
    // console.log("rs : " , result);  
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log("request cancelled!"); //neu request bi huy thi log ra
      response.result.data = {};
    }
    // console.log("error : ", error); 
    response.error = error.response?.data.message;
    response.result.status = error.response?.status;
  }
  // console.log("status out if: " , response.result.status);
  if(response.result.status === 401 || response.result.status === undefined){
    notify.show("Hết phiên đăng nhập", "warning");
    // logOut();
    storageService.removeToken();
    window.location.href = "/";
  }
  return response;
}
export const callApi = async (endpoint: string, method: any, body: any, isNeedAuth: boolean = true) => {
  const source = axios.CancelToken.source();
  var response: response = {
    result: {
      data: null,
      status: 500,
    },
    error: null
  }
  var newHeaders: any = {'Content-Type': 'application/json'};
  if (isNeedAuth && storageService.isTokenExits()) { 
    newHeaders["x-chozoi-token"] = storageService.getToken();
    // newHeaders["Authorization"] = 'Bearer ' + storageService.getToken();
    createAuthRefreshInterceptor(axios, refreshAuthLogic, {
        pauseInstanceWhileRefreshing: true
    });
  }
  try {
    // console.log("api : ", Config.API_URL + endpoint);
    const result = await axios({
      method: method,
      url: Config.API_URL + endpoint,
      // url: `${Config.API_URL}${endpoint}`,
      headers: newHeaders,
      data: body,
      cancelToken: source.token
    })
    response.result.data = result?.data;
    response.result.status = result?.status;
    // console.log("rs : " , result);  
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log("request cancelled!"); //neu request bi huy thi log ra
      response.result.data = {};
    }
    // console.log("error : ", error); 
    response.error = error.response?.data.message;
    response.result.status = error.response?.status;
  }
  // console.log("status out if: " , response.result.status);
  if(response.result.status === 401 || response.result.status === undefined){
    notify.show("Hết phiên đăng nhập", "warning");
    // logOut();
    storageService.removeToken();
    window.location.href = "/";
  }
  return response;
}
