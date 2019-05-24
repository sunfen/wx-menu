//index.js
//获取应用实例
var app = getApp();
var common = require('/../../pages/common/common.js');
const db = wx.cloud.database();


Page({
  data: {
    noImage: '/images/search_none.png',
    status: 0,
    currentPosition: "order0",
    sysHeight: app.globalData.sysHeight,
    menus:[]
  },

  onLoad(){
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    var openid = wx.getStorageSync("openid");
    var store = wx.getStorageSync("store");
    var menus = wx.getStorageSync("menus");
    
    that.setData({openid: openid, store: store, menus: menus});

    if (menus && menus.length > 0){
      that.setData({ currentMenu: menus[0] });
      that.getSubMenus(0);
    }else{
      wx.hideLoading();
    }
  },
  
  getSubMenus(index){
    var that = this;

    db.collection("submenus").where({
      _openid: that.data.openid,
      menu_id: that.data.currentMenu._id
    }).get({
      success: result => {

        that.data.menus[index].submenus = result.data ;
        that.setData({ ['currentMenu.submenus']: result.data, menus: that.data.menus});

        if (result.data && result.data.length > 0){
            that.getSubsubmenus(index, 0);
        }
        wx.hideLoading();
      }, fail: err => {
        console.log(err);
        wx.hideLoading();
      }
    })
  },

  getSubsubmenus(index, index1){
    var that = this;
    db.collection("subsubmenus").where({
      _openid: that.data.openid,
      submenu_id: that.data.menus[index].submenus[index1]._id
   
    }).get({

      success: result1 => {
        that.data.menus[index].submenus[index1].subsubmenus = result1.data;
      
        that.setData({ ['currentMenu.submenus']: that.data.menus[index].submenus, menus: that.data.menus });
        if (that.data.menus[index].submenus.length-1 != index1){
          that.getSubsubmenus(index, index1+1);
        }else{
          wx.hideLoading();
        }
        
      }, fail: err => {
        wx.hideLoading();
      }
    })
  },

  changeMenu: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    that.setData({
      status: index,
      currentPosition: "order" + index,
      currentMenu: that.data.menus[index]
    })
    if (!that.data.currentMenu.submenus){
      that.getSubMenus(index);
    }
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

 
  
  viewFood(e){
    wx.navigateTo({
      url: '/pages/viewFood/viewFood?id=' + e.target.dataset.submenu._id,
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
