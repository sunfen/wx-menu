//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    status: 0,
    currentPosition: "order0",
    imgUrls: [
      "/images/1.jpg",
      "/images/1.jpg",
      "/images/1.jpg"
    ]
  },
  
  changeMenu: function (e) {
    var index = e.currentTarget.dataset.index;
    this.setData({
      status: index,
      currentPosition: "order" + index
    })
  },


  scrollBottom: function () {
    wx.showLoading({
      title: '加载中...',
      mask:true
    })
    setTimeout(function(){
      wx.hideLoading();
    },1000)
  },

  addType(){
    wx.navigateTo({
      url: '/pages/book/book',
    })
  },
  
  /**
   * 添加食物
   */
  addFood() {
    wx.navigateTo({
      url: '/pages/addFood/addFood',
    })
  },

  previewImages: function (e) {
    console.log(e.currentTarget.dataset.src);
    wx.previewImage({
      current: e.currentTarget.dataset.src,
      urls: [e.currentTarget.dataset.src],
    })
  }
})
