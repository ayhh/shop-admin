//这个文件写的都是函数，我们叫接口请求函数
//以后，我们的每个接口都对应了一个函数，如果想要拿相关接口的数据，只需要调用相关的接口请求函数
//axios使用   函数用法  对象用法
// 三种参数   params参数  query参数  请求体参数
// params参数 是在url当中携带的,属于路径一部分
// query参数，可以在url当中携带 ？分割，后面就是query参数
// 也可以在配置对象当中配置，配置的属性名叫params
// 请求体参数，在配置对象当中data里面配置，请求方式是put和post才有请求体参数

// axios({
//   url:'localhost:8080/userinfo/1?name=zhaoliying',
//   method:,
//   params:{
//     //代表的是query参数
//     name:'zhaoliying'
//   },
//   data:{
//     //配的是请求体参数
//   }
// })

import request from './ajax'
import mockAjax from '@/api/mockAjax'
//请求三级分类列表数据
///api/product/getBaseCategoryList
//get
//无参

export const postLogin = (loginForm) => {
  return request({
    url: '/private/v1/login',
    method: 'post',
    data: loginForm
  })
}
export const getMenu = () => {
  return request({
    url: '/private/v1/menus',
    method: 'get'
  })
}

export const reqBannerList = (good_id) => {
  return request({
    url: `/good/${good_id}`,
    method: 'post'
    // data: good_id
  })
}

export const getUsers = (queryInfo) => {
  return request({
    url: '/private/v1/users',
    method: 'get',
    params: queryInfo
  })
}

export const changeUserState = (id, state) => {
  return request({
    url: `/private/v1/users/${id}/state/${state}`,
    method: 'put'
    // data: good_id
  })
}

export const addUser = (userInfo) => {
  return request({
    url: `/private/v1/users`,
    method: 'post',
    data: userInfo
  })
}

export const getUserInfo = (id) => {
  return request({
    url: `/private/v1/users/${id}`,
    method: 'get'
  })
}

export const editUserInfo = (id, userInfo) => {
  return request({
    url: `/private/v1/users/${id}`,
    method: 'put',
    data: userInfo
  })
}

export const deleUser = (id) => {
  return request({
    url: `/private/v1/users/${id}`,
    method: 'delete'
  })
}
export const getRoles = () => {
  return request({
    url: '/private/v1/roles',
    method: 'get'
  })
}

export const removeRoleTag = (roleId, rightId) => {
  return request({
    url: `/private/v1/roles/${roleId}/rights/${rightId}`,
    method: 'delete'
  })
}

export const getRight = () => {
  return request({
    url: `/private/v1/rights/tree`,
    method: 'get'
  })
}

export const  setUserPower = (id, idstr) => {
  return request({
    url: `/private/v1/roles/${id}/rights`,
    method: 'post',
    data: idstr
  })
}

export const setRole = () => {
  return request({
    url: `/private/v1/roles`,
    method: 'get',
  })
}

export const saveRoleInfo = (id, rId) => {
  return request({
    url: `/private/v1/users/${id}/role`,
    method: 'put',
    data: rId
  })
}

export const getCategoriesList = (queryinfo) => {
  return request({
    url: '/private/v1/categories',
    method: 'get',
    params: queryinfo
  })
}

export const getCateList = (queryinfo) => {
  return request({
    url: '/private/v1/categories',
    method: 'get',
    params: queryinfo
  })
}

export const addCategories = (queryinfo) => {
  return request({
    url: '/private/v1/categories',
    method: 'post',
    data: queryinfo
  })
}

export const goodsList = (queryinfo) => {
  return request({
    url: '/private/v1/goods',
    method: 'get',
    params: queryinfo
  })
}

export const deleGoods = (id) => {
  return request({
    url: `/private/v1/goods/${id}`,
    method: 'delete'
  })
}