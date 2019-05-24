// pages/index/addProject.js
const app = getApp()
var common = require('/../../pages/common/common.js');
const db = wx.cloud.database();


Page({
  data: {
    showModal: false,
  },

  onLoad(options){
    var that = this;
    console.log(options.store_id);
    if (!options.store_id || !options.time){
      common.showAlertToast('请联系店长邀请你入店！');
      return;
    }

    if ((Date.now() - options.time) > 100000000) {
      common.showAlertToast('链接已经过期！ 请联系店长邀请你入店！');
      return;
    }
    var userid = wx.getStorageSync("userid");
    if (!userid){
      wx.cloud.callFunction({
        // 需调用的云函数名
        name: 'login',
        // 成功回调
        complete: res => {
          wx.setStorageSync("openid", res.result.openid);
          app.globalData.openid = res.result.openid;

          db.collection("users").where({
            _openid: app.globalData.openid
          }).get({
            success: result => {
              if (result.data.length == 0) {
                db.collection("users").add({
                  data: {
                    openid: app.globalData.openid
                  }, success: res => {
                    wx.setStorageSync("userid", res._id);
                    that.setData({ userid: res._id });
                  }
                })
              } else {
                wx.setStorageSync("userid", result.data[0]._id);
                that.setData({ userid: result.data[0]._id});
              }
            }, fail: err => {
              console.log(err)
            }
          })
        }
      })
    }
    that.setData({storeId: options.store_id});


  },
  
  
  



})





