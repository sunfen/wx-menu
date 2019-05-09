// pages/user/user.js
//获取应用实例
var app = getApp();
Page({
  data: {
    userInfo: {},
    timeCounter: null,
    showModalName: false,
  },

  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    var stores = wx.getStorageSync("stores");
    that.setData({
      userInfo: app.globalData.userInfo,
      stores: stores
    })
  },

  viewType() {
    wx.navigateTo({
      url: '/pages/book/book',
    })
  },

  viewStore(){
    wx.navigateTo({
      url: '/pages/stores/stores',
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
          }
        }
      })
    } else {
      common.errorWarn("您点击了拒绝授权");
    }
  },


})