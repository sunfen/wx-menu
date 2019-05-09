//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var that=this;  
    that.getUserInfo(function(userInfo){ 
         that.globalData.userInfo=userInfo
         //console.log(that.globalData.userInfo);
    }); 


    wx.showShareMenu({
      withShareTicket: true
    })


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
    //urlPath: "http://39.106.157.46:8080/",
    urlPath: "https://www.art-sculpture.cn/",
    //urlPath: "http://localhost:8081/",
    //urlPath: "http://192.168.1.105:8081/",
    openid: '',
    isLogin: false,
    header: { 'Cookie': '' },
    timeout: 800,
    sysWidth: wx.getSystemInfoSync().windowWidth,
    sysHeight: wx.getSystemInfoSync().windowHeight,
  },

})