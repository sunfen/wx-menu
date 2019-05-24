// pages/user/user.js
//获取应用实例
var app = getApp();
var common = require('/../../pages/common/common.js');
const db = wx.cloud.database();


Page({
  data: {
    sysWidth: app.globalData.sysWidth,
    method: null
  },

  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    that.setData({ subsubmenuId: options.id});
    
    db.collection("methods").where({
      subsubmenu_id: that.data.subsubmenuId
    }).get({

      success: result => {
        wx.hideLoading();
        if (result.data && result.data.length > 0){

           that.setData({ method: result.data[0] });
        }else{
           common.showAlertToast("还没有制作方法哦！");
           return;
        }

      }, fail: err => {
        console.log(err);
        wx.hideLoading();
      }
    })
  },

  goback() {
    wx.navigateBack({ delta: 1 })
  },
  

  



  previewImage: function (e) {
    var current = e.target.dataset.src;
    var currents = e.target.dataset.srcs;

    
    wx.previewImage({
      current: current,
      urls: currents
    })
  },


  onDelete(){
    var that = this;
    db.collection("methods").doc(that.data.method._id).remove({
      success: res => {
        var files = [];
        for(var i = 0; i < that.data.method.steps.length; i ++){
          for (var j = 0; j < that.data.method.steps[i].files.length; j++) {
            files.push(that.data.method.steps[i].files[j]);
          }
        }
        if (files && files.length > 0) {
          that.deleteImage(files);
        }
        wx.showToast({
          title: '成功删除！',
          icon: 'success',
          success(res) {
            setTimeout(function(){
              wx.redirectTo({
                url: '/pages/index/index',
              })
            },300)
          }
        })
      }, fail: err => {
        common.showAlertToast('删除失败');
      }
    })
  },

  edit(){
    var that = this;
    var object = JSON.stringify(that.data.method);
    wx.redirectTo({
      url: '/pages/addFood/addFood?method=' + object,
    })
  },


  deleteImage(files) {
    wx.cloud.deleteFile({
      fileList: files
    }).then(res => {
      // handle success
      console.log(res)
    }).catch(error => {
      console.log(error)
    })
  },

})