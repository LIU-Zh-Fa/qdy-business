import request from '@/utils/request'

const api = "/api/dayin/cb";

/**
 * 登录
 * @param username
 * @param password
 * @param grant_type
 */
export const loginByUsername = (username, password) =>
  request({
    url: "/auth/login",
    method: "post",
    meta: {
      oauth: true
    },
    data: {
      userName: username,
      passWord: password,
      rememberMe: true
    }
  });
export function getUserInfo(){
  return request({
    url: "/cb/getSysMerchantInfo",
    method: "GET",
    params: {}
  });
}
export function savePass(params){
  return request({
    url: "/auth/verification",
    method: "post",
    data: params
  });
}
export function refeshToken(){
  return request({
    url: "/publicController/refreshToken",
    method: "get",
    params: {}
  });
}