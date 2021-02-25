//订单状态
export const statusOptions = [
    {value:'waiting_accept',label:'待接单'},
    {value:'waiting_accept_time_out_not_accept',label:'接单超时'},
    {value:'waiting_accept_cb_deny',label:'已拒绝'},
    {value:'waiting_accept_cc_cancel',label:'已取消'},
    {value:'waiting_print_cc_cancel',label:'已取消'},
    {value:'waiting_print_cb_cancel',label:'商家取消'},
    {value:'cb_accept_waiting_print',label:'待取件'},
    {value:'waiting_print_time_out',label:'取件超时'},
    {value:'printed',label:'已取件'}
  ]  