// import Constants from "../constants/Constants";
import { eraseCookie, getCookie, setCookie } from "../common/BaseFunction";

export default class StorageService {
    public static getToken(): string | null{
        return getCookie("accessToken");
    }
    public static removeToken() { 
        eraseCookie("accessToken");
    }

    public static setToken(token: String) {
        setCookie("accessToken", token, 7);
    }
    public static setName(name: string){
      localStorage.setItem("Uname", name)
    }
    public static removeName(){
      localStorage.removeItem("Uname");
    }
    public static setRole(name: string){
      localStorage.setItem("role", name)
    }
    public static removeRole(){
      localStorage.removeItem("role");
    }
    public static getRefreshToken(): string | null{
        return getCookie("refreshToken");
    }
    public static removeRefreshToken() {
      eraseCookie("refreshToken");
    }

    public static setRefreshToken(token: String) {
        setCookie("refreshToken", token, 8);
    }

    public static isTokenExits() {
        return StorageService.getToken() !== null;
    }

    public static setLocalStore(key: any, value: any) {
        localStorage.setItem(key, value);
    }

    public static getLocalStore(key: any) {
        return localStorage.getItem(key);
    }

    public static setUUID(uuid: string) {
        const newUserId = uuid.replace("-", "");
        this.setLocalStore("uuid", newUserId);
    }

    public static getUUID() {
        return this.getLocalStore("uuid");
    }
}
