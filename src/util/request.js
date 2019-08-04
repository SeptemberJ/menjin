import axios from 'axios'
// import qs from 'qs'
// import { Message } from 'element-ui'
import utils from './utils.js'
import store from '../vuex/store'

let baseUrl = 'http://118.89.109.106/YKTJK'

const CancelToken = axios.CancelToken
const source = CancelToken.source()
// 设置token
function setToken () {
  if (utils.local.get('token')) {
    axios.defaults.headers.common['token'] = utils.getLocal('token')
  }
}

// err
const err = (error) => {
  if (error.response) {
    let data = error.response.data
    store.dispatch('toggleLoadingBt', false)
    // const token = Vue.ls.get(ACCESS_TOKEN)
    // console.log("------异常响应------",token)
    // console.log("------异常响应------",error.response.status)
    switch (error.response.status) {
      case 403:
        // Message.error({
        //   message: '拒绝访问!'
        // })
        break
      case 500:
        if (data.message === 'Token失效，请重新登录') {
          // Message.error({
          //   message: '很抱歉，登录已过期，请重新登录!'
          // })
        }
        break
      case 404:
        // Message.error({
        //   message: '很抱歉，资源未找到!'
        // })
        break
      case 504:
        // Message.error({
        //   message: '网络超时!'
        // })
        break
      case 401:
        // Message.error({
        //   message: '未授权，请重新登录!'
        // })
        // if (token) {
        //   store.dispatch('Logout').then(() => {
        //     setTimeout(() => {
        //       window.location.reload()
        //     }, 1500)
        //   })
        // }
        break
      default:
        // Message.error({
        //   message: data.message + '!'
        // })
        break
    }
  }
  return Promise.reject(error)
}

// 请求验证拦截器
axios.interceptors.request.use(config => {
  return config
})

// 返回数据拦截器
axios.interceptors.response.use(res => {
  return res
}, err)

// 封装请求方法
function formatReq (type, url, data) {
  const timestamp = Date.now()
  setToken()
  return new Promise((resolve, reject) => {
    axios({
      method: type,
      url: `${baseUrl}${url}`,
      headers: {
        // 这里的请求头与后台商量设置
        // 'content-Type': 'application/x-www-form-urlencoded'
        'content-Type': 'application/json',
        'X-Timestamp': timestamp
      },
      cancelToken: source.token,
      data: data // java后台用qs转 qs.stringify(data)
      // data:JSON.stringify(data)//PHP后台用JSON转
    })
      .then(r => {
        // store.commit('UPDATE_LOADING', false) // 隐藏loading
        // 这里可以添加指定对应状态码的处理方式,比如登陆过期,res.data.code === '6666' 路由跳转到login
        resolve(r)
      })
      .catch(e => {
        reject(e.message)
      })
  })
}

const Http = {
  get: (url, query) => {
    if (Object.keys(query).length > 0) {
      url = encodeURI(url + utils.formatUrl(query) + '&timestamp=' + Date.now())
    } else {
      url = encodeURI(url + '?timestamp=' + Date.now())
    }
    setToken()
    return axios.get(`${baseUrl}${url}`, { cancelToken: source.token }).then(r => r)
  },
  post: (url, data) => formatReq('post', encodeURI(url), data),
  put: (url, data) => formatReq('put', encodeURI(url), data),
  patch: (url, data) => formatReq('patch', encodeURI(url), data),
  delete: (url, data) => formatReq('delete', encodeURI(url), data)
}

export default Http
