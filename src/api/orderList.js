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
        url: "/cb/print",
        method: "get",
        params: params
    })
}
export function verification(params){
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
export function accept(params){
  return request({
    url: "/cb/accept",
    method: "get",
    params: params
  })
}
export function refuse(params){
  return request({
    url: "/cb/deny",
    method: "get",
    params: params
  })
}
export function cancel(params){
  return request({
    url: "/cb/waiting_print_cancel",
    method: "get",
    params: params
  })
}
export function getCount(params){
  return request({
    url: "/cb/stateAcount",
    method: "get",
    params: params
  })
}
