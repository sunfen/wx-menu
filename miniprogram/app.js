//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var that=this;  
    that.getUserInfo(function(userInfo){ 
      that.globalData.userInfo=userInfo
    }); 

    const updateManager = wx.getUpdateManager();

    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
    })

    updateManager.onUpdateReady(function () {
      // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
      updateManager.applyUpdate()
    })

    updateManager.onUpdateFailed(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本下载失败',
        showCancel: false
      })
    })

    wx.cloud.init({
      env: 'menu-uhbvh'
    })
    const db = wx.cloud.database();

    wx.cloud.callFunction({
      // 需调用的云函数名
      name: 'login',
      // 成功回调
      complete : res => {
        wx.setStorageSync("openid", res.result.openid);

        db.collection("users").where({
          _openid: res.result.openid
        }).get({
          success: result => {
            if(result.data.length == 0 ){
              db.collection("users").add({
                data: {
                  openid: res.result.openid
                }, success: res => {
                  wx.setStorageSync("userid", res._id);
                }
              })
            }else{
              wx.setStorageSync("userid", result.data[0]._id);
            }
          }, fail: err => {
            console.log(err)
          }
        })

        db.collection("stores").where({
          _openid: res.result.openid
        }).get({
          success: result => {
            that.globalData.stores = result.data;
            wx.setStorageSync("stores", result.data);
          }, fail: err => {
            console.log(err)
          }
        })
      }
    })


  },

  
  getUserInfo:function(cb){
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
    }
  },
  
  globalData:{
    userInfo:null,
    stores:[],
    store: {},
    openid: null,
    sysWidth: wx.getSystemInfoSync().windowWidth,
    sysHeight: wx.getSystemInfoSync().windowHeight,
  },

})