import request from '@/utils/request'

export function getList(params){
  return request({
    url: "/cb/getOrderList",
    method: "get",
    params: params
  })
}
export function checkPickCode(params){
    return request({
        url: "/cb/verification",
        method: "get",
        params: params
    })
}
export function orderDetail(params){
    return request({
        url: "/cb/getOrderInfo",
        method: "get",
        params: params
    })
}

export function fileuuId(id){
  return request({
      url: "/cc/download",
      method: "get",
      params: {
        fileId: id
      }
  })
}
export function orderAmountSave(params){
  return request({
    url: "/cb/orderAmountSave",
    method: "post",
    data: params
  })
}