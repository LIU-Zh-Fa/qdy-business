import request from '@/utils/request'

export function updateIsWeChatPush(params){
  return request({
    url: "/cb/updateIsWeChatPush",
    method: "post",
    data: params
  })
}
export function updateBusinessState(params){
    return request({
      url: "/cb/updateBusinessState",
      method: "post",
      data: params
    })
  }
  export function updateBusinessHours(params){
    return request({
      url: "/cb/updateBusinessHours",
      method: "post",
      data: params
    })
  }
