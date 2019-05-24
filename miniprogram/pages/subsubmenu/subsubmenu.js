// pages/index/addProject.js
const app = getApp()
var common = require('/../../pages/common/common.js');
const db = wx.cloud.database();


Page({
  data: {

    results: [],
    showModal: false,
    submenu: null,
    subsubmenu:{}
  },


  goback() {
    wx.navigateBack({ delta: 1 })
  },

  
  onLoad(options){
    var that = this;
    that.setData({ submenu: JSON.parse(options.submenu)});
    that.init();
  },

  init(){
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    db.collection("subsubmenus").where({
      _openid: that.data.openid,
      submenu_id: that.data.submenu._id
    
    }).get({
      
      success: result => {
        
        that.setData({ results: result.data });
        wx.setStorageSync("subsubmenus", result.data);
        wx.hideLoading();

      }, fail: err => {
        wx.hideLoading();
      }
    })
  },

  selectOne(e) {
    var that = this;
    wx.showActionSheet({
      itemList:['制作方法' ,'编辑', '删除'],
      success(res) {
        if (res.tapIndex == 0) {
        
          that.make(e.currentTarget.dataset.subsubmenu);
        }else if (res.tapIndex == 1){
          that.edit(e.currentTarget.dataset.subsubmenu);
        }else  if (res.tapIndex == 2) {
          that.onDel(e.currentTarget.dataset.subsubmenu);
        }
      }
    })
  },


  /**
   * 制作方法
   */
  make(item) {
    var that = this;
    that.setData({ subsubmenu: item });
    db.collection("methods").where({
      _openid: that.data.openid,
      subsubmenu_id: that.data.subsubmenu._id
    }).get({

      success: result => {
        if(result.data && result.data.length > 0 ){
          var object = JSON.stringify(result.data[0]);
          wx.navigateTo({
            url: '/pages/viewFood/viewFood?method=' + object,
          })
        }else{
          var object = JSON.stringify(item);
          wx.navigateTo({
            url: '/pages/addFood/addFood?subsubmenu=' + object,
          })
        }
        
      }, fail: err => {
        console.log(err);
      }
    })
  },

  /**
   * 编辑
   */
  edit(item) {
    var that = this;
    that.setData({ showModal: true, subsubmenu: item});
  },

  /**
   * 新增
   */
  add(){
    var that = this;
    that.setData({ showModal: true, subsubmenu: {} });
  },


  // 关闭详情页
  closeModal: function () {
    this.setData({
      showModal: false
    })
  },

  /**
   * 输入框输入事件
   */
  inputValue: function (e) {
    var name = e.target.id;
    this.setData({
      [name]: e.detail.value
    })
  },


  //新增完
  /**
   * 对话框确认
   */
  onConfirm: function (e) {
    var that = this;
  
    if (that.data.subsubmenu.name == "" || that.data.subsubmenu.name == undefined) {
      common.showAlertToast("请填写名称！");
      return;
    }

    that.setData({
      showModal: false
    })

    if (that.data.subsubmenu._id){
      that.onUpdate();
    }else{
      that.onCreate();
    }
  },

  onCreate(){
    var that = this;
    db.collection("subsubmenus").add({
      data: {
        submenu_id: that.data.submenu._id,
        name: that.data.subsubmenu.name,
      }, success: res => {
        wx.showToast({
          title: '新增成功！',
          icon: 'success',
          success(res) {
            that.init();
          }
        })
        that.setData({ subsubmenu: {}});
      }, fail: err => {
        that.setData({ subsubmenu: {} });
        if (err.errCode == -502001) {

          common.showAlertToast("该名称已经存在，请重新命名！");
        } else {

          common.showAlertToast("数据错误，请重试！");
        }
      }
    })
  },



  onUpdate() {
    var that = this;
    db.collection("subsubmenus").doc(that.data.subsubmenu._id).update({
      data: {
        name: that.data.subsubmenu.name,
      }, success: res => {
        wx.showToast({
          title: '更新成功！',
          icon: 'success',
          success(res) {
            that.init();
          }
        })
        that.setData({ subsubmenu: {} });
      }, fail: err => {
        that.setData({ subsubmenu: {} });
        if (err.errCode == -502001) {

          common.showAlertToast("该名称已经存在，请重新命名！");
        } else {

          common.showAlertToast("数据错误，请重试！");
        }
      }
    })
  },

  /**
   * 删除
   */
  onDel(item) {
    var that = this;
    db.collection("subsubmenus").doc(item._id).remove({
      success: res => {
        wx.showToast({
          title: '成功删除！',
          icon: 'success',
          success(res) {
            that.init();
          }
        })
      }, fail: err => {
        common.showAlertToast('删除失败');
      }
    })


  },


  /**
    * 弹出框蒙层截断touchmove事件
    */
  preventTouchMove: function () {
  },


})





