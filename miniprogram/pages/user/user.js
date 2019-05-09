// pages/user/user.js
//获取应用实例
var app = getApp();
Page({
  data: {
    userInfo: {},
    timeCounter: null
  },

  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    that.setData({
      userInfo: app.globalData.userInfo
    })
  },

  addType() {
    wx.navigateTo({
      url: '/pages/book/book',
    })
  },




  //用户按了允许授权按钮
  bindGetUserInfo: function (e) {
    if (e.detail.userInfo) {
      var that = this;
      wx.login({
        success: function (res) {
          if (res.code) {
            getApp().globalData.userInfo = e.detail.userInfo;
            var avatarUrl = 'userInfo.avatarUrl';
            var nickName = 'userInfo.nickName';
            that.setData({
              [avatarUrl]: e.detail.userInfo.avatarUrl,
              [nickName]: e.detail.userInfo.nickName
            })
            // wx.request({
            //   header: header,
            //   url: getApp().globalData.urlPath + 'login',
            //   method: 'POST',
            //   header: header,
            //   data: {
            //     username: e.detail.userInfo.nickName,
            //     avatarUrl: e.detail.userInfo.avatarUrl,
            //     openid: getApp().globalData.openid,
            //     password: getApp().globalData.openid
            //   },
            //   success: function (res) {
            //     //从数据库获取用户信息
            //     if (res.data.code == "200") {
            //       getApp().globalData.header.Cookie = 'JSESSIONID=' + res.data.t.session;
            //     } else {
            //       common.loginFail();
            //     }
            //   },
            //   fail: function (res) {
            //     common.loginFail();
            //   }
            // })
          }
        }
      })
    } else {
      common.errorWarn("您点击了拒绝授权");
    }
  },


})