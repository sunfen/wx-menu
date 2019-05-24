//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var that=this;  


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

    that.getUserInfo(function (userInfo) {
      that.globalData.userInfo = userInfo
    }); 

    wx.getSystemInfo({
      success: function (res) {
        that.globalData.platform = res.platform
        let totalTopHeight = 68
        if (res.model.indexOf('iPhone X') !== -1) {
          totalTopHeight = 88
        } else if (res.model.indexOf('iPhone') !== -1) {
          totalTopHeight = 64
        }
        that.globalData.statusBarHeight = res.statusBarHeight
        that.globalData.titleBarHeight = totalTopHeight - res.statusBarHeight
      },
      failure() {
        that.globalData.statusBarHeight = 0
        that.globalData.titleBarHeight = 0
      }
    });


    const db = wx.cloud.database();

    wx.cloud.callFunction({
      // 需调用的云函数名
      name: 'login',
      // 成功回调
      complete : res => {
        wx.setStorageSync("openid", res.result.openid);
        that.globalData.openid = res.result.openid;

        db.collection("users").where({
          _openid: that.globalData.openid
        }).get({
          success: result => {
            if(result.data.length == 0 ){
              db.collection("users").add({
                data: {
                  openid: that.globalData.openid
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

        var store = wx.getStorageSync("store");
        if(!store){
          db.collection("stores").where({
            _openid: that.globalData.openid
          }).get({
            success: result1 => {
              that.globalData.stores = result1.data;
              wx.setStorageSync("stores", result1.data);
              if(result.data.length > 0){
              }
            }, fail: err => {
              console.log(err)
            }
          })

        }else{
          var menus = wx.getStorageSync("menus");
          if (!menus) {
            db.collection("menus").where({
              _openid: that.globalData.openid,
              store_id: store._id
            }).get({
              success: result => {
                wx.setStorageSync("menus", result.data);
                wx.hideLoading();
              }, fail: err => {
                console.log(err);
                wx.hideLoading();
              }
            })
          }
        }
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