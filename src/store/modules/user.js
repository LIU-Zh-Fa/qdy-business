import { login, getInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { setStore, getStore } from "@/utils/store";
import { loginByUsername, getUserInfo, logout } from '@/api/user'
import { validatenull } from "@/utils/validate";

const user = {
  state: {
    name: '',
    avatar: '',
    permissions: [],
    userInfo: getStore({ name: "userInfo" }) || [],
    permission: getStore({ name: "permission" }) || {},
    roles: [],
    menus: getStore({ name: "menus" }) || [],
    menuAll: [],
    token: getStore({ name: "token" }) || "",
    refreshToken: getStore({ name: "refreshToken" }) || "",
    lastRefreshTokenTime: ""
  },

  mutations: {
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_TOKEN: (state, token) => {
      setToken(token);
      state.token = token;
      setStore({ name: "token", content: state.token, type: "session" });
    },
    SET_REFRESH_TOKEN: (state, token) => {
      state.refreshToken = token;
      setStore({
        name: "refreshToken",
        content: state.refreshToken,
        type: "session"
      });
    },
    SET_LAST_REFRESH_TOKEN_TIME: (state, time) => {
      state.lastRefreshTokenTime = time;
    },
    SET_USER_INFO: (state, userInfo) => {
      userInfo.password = "";
      state.userInfo = userInfo;
      setStore({ name: "userInfo", content: state.userInfo });
    },
    SET_MENU: (state, menus) => {
      state.menus = menus;
      setStore({ name: "menus", content: state.menus, type: "session" });
    },
    SET_MENU_ALL: (state, menuAll) => {
      state.menuAll = menuAll;
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles;
    },
    SET_PERMISSIONS: (state, permissions) => {
      let result = [];
      if (permissions.length > 0) {
        permissions.forEach(permission => {
          result.push(permission);
        });
        state.permissions = result;
      }
      setStore({
        name: "permissions",
        content: state.permissions,
        type: "session"
      });
    }
  },

  actions: {
    //根据用户名登录
    LoginByUsername({ commit, dispatch }, userInfo) {
      return new Promise((resolve, reject) => {
        loginByUsername(userInfo.username, userInfo.password)
          .then(res => {
            const data = res;
            commit("SET_TOKEN", data.data);
            // commit("SET_TOKEN", data.data);
            // commit("SET_ROUTES",{})
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      const password = userInfo.password
      const code = userInfo.code
      const uuid = userInfo.uuid
      return new Promise((resolve, reject) => {
        login(username, password, code, uuid).then(res => {
          setToken(res.token)
          commit('SET_TOKEN', res.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getUserInfo(state.token).then(res => {
          const data = res.data;
          const avatar = validatenull(data.user.avatar) ? 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png' : process.env.VUE_APP_BASE_API + user.avatar;
          if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', data.roles)
          } else {
            commit('SET_ROLES', ['ROLE_DEFAULT'])
          }
          commit('SET_PERMISSIONS', data.permissions)
          //commit('SET_NAME', user.userName)
          commit("SET_USER_INFO", data.user);
          commit('SET_AVATAR', avatar)
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 退出系统
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        // logout().then(() => {
        //   commit('SET_TOKEN', '')
        //   commit("SET_USER_INFO", {});
        //   commit("SET_REFRESH_TOKEN", "");
        //   commit('SET_ROLES', [])
        //   commit('SET_PERMISSIONS', [])
        //   removeToken()
        //   resolve()
        // }).catch(error => {
        //   reject(error)
        // })
        commit('SET_TOKEN', '')
        commit("SET_USER_INFO", {});
        commit("SET_REFRESH_TOKEN", "");
        commit('SET_ROLES', [])
        commit('SET_PERMISSIONS', [])
        resolve()
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    },
    // 保存用户信息
    setUserInfo( { commit }, userInfo){
      commit("SET_USER_INFO", userInfo);
    }
  }
}

export default user
