// pages/user/user.js
//获取应用实例
var app = getApp();
var common = require('/../../pages/common/common.js');
const db = wx.cloud.database();


Page({
  data: {
    userInfo: {},
    timeCounter: null,
    showModalName: false,
    stores: [],
    store: {}
  },

  onShow: function (options) {
    var that = this;
    var userInfo = wx.getStorageSync("userInfo");
    var stores = wx.getStorageSync("stores");
    var store = wx.getStorageSync("store");
    that.setData({
      userInfo: userInfo,
      stores: stores,
    })
    if(!store.id && stores && stores.length > 0){
      that.setData({
        store: stores[0]
      })
    }
  },

  getMembers(){
    var that = this;

    if (that.data.store && that.data.store._id ){
      wx.showLoading({
        title: '加载中',
      })
      db.collection("members").where({
        store_id: that.data.store._id
      }).get({
        success: result => {
          that.setData({ members: result.data });
          wx.setStorageSync("members", result.data);
          wx.hideLoading();
        }, fail: err => {
          console.log(err);
          wx.hideLoading();
        }
      })
    }
  },



  changeStore(e){
    var that = this;
    that.setData({store : that.data.stores[e.detail.value]});
    wx.setStorageSync("store", that.data.store);
    app.globalData.store = that.data.store;
  },


  /**
   * 进行页面分享
   */
  onShareAppMessage: function (options) {
    console.log(options)
    var that = this;
    if (!that.data.store || !that.data.store._id){
      common.showAlertToast('请选择当前使用的店');
      return;
    }
    if (options.from === 'button') {
      // 来自页面内转发按钮
      return {
        title: that.data.store.name + '邀请你加入本店!',
        path: 'pages/share/share?store_id=' + that.data.store._id,
        success: function (res) {
          common.showAlertToast('发送成功');
        },
        fail: function () {
          common.showAlertToast('转发失败...');
        }
      }
    }
  },


  /**
 * 删除
 */
  onDelMembers(item) {
    var that = this;
    console.log(item);
    db.collection("members").doc(item._id).remove({
      success: res => {
        wx.showToast({
          title: '成功移除！',
          icon: 'success',
          success(res) {
            that.getMembers();
          }
        })
      }, fail: err => {
        common.showAlertToast('移除失败');
      }
    })
  },



  viewMenu() {
    wx.navigateTo({
      url: '/pages/menu/menu',
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
            wx.setStorageSync("userInfo", e.detail.userInfo);
            that.setData({ userInfo: e.detail.userInfo});
           
            db.collection("users").doc(wx.getStorageSync("userid")).update({
              data: {
                avatarUrl: e.detail.userInfo.avatarUrl,
                nickName: e.detail.userInfo.nickName
              }
            })
          }
        }
      })
    } else {
      common.errorWarn("您点击了拒绝授权");
    }
  },

})