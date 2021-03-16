/**
 * 全局配置文件
 */
export default {
  clientId: "test_client", // 客户端id test_client
  clientSecret: "test_secret", // 客户端密钥 test_secret
  key: "qdy-business", //配置主键,目前用于存储
  lockPage: "/lock",
  tokenTime: 6000,
  //http的status默认放行不才用统一处理的,
  statusWhiteList: [],
  //配置工作台不可关闭
  isFirstPage: false,
  fistPage: {
    label: "工作台",
    value: "",
    params: {},
    query: {},
    meta: {
      i18n: "dashboard"
    },
    group: [],
    close: false
  },
  //配置菜单的属性
  menu: {
    iconDefault: "iconfont icon-caidan",
    props: {
      label: "name",
      path: "path",
      icon: "source",
      children: "children"
    }
  }
};
