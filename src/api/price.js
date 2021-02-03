import request from '@/utils/request'

export function getList(params){
  return request({
    url: "/cb/getPriceByLoginNum",
    method: "get",
    params: params
  })
}
export function savePrice(params){
    return request({
      url: "/cb/priceSettingSave",
      method: "post",
      data: params
    })
  }

