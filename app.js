//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var that=this;  
    that.getUserInfo(function(userInfo){ 
         that.globalData.userInfo=userInfo
         //console.log(that.globalData.userInfo);
    }); 
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
  }
})