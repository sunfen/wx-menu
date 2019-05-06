// pages/user/user.js
//获取应用实例
var app = getApp();
Page({
  data: {
    types:['大杯', '中杯', '小杯'],
    typeIndex: '大杯',
    menuTypes: ['黑泷经典', '东方奶香', '谷力姑奶'],
    menuTypeIndex: '黑泷经典',
  },

  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
  },


  typeChange(e){
    console.log(e.detail.value);
    this.setData({ typeIndex: this.data.types[e.detail.value]});
  },

  
  typeChange1(e) {
    console.log(e.detail.value);
    this.setData({ menuTypeIndex: this.data.types[e.detail.value] });
  }


})