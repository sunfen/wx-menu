// pages/index/addProject.js
const app = getApp()
var common = require('/../../pages/common/common.js');
const db = wx.cloud.database();
Page({
  data: {
    results: [],
    showModal: false,
    store: null,
    menu:{}
  },

  onLoad(){
    var that = this;
    var store = wx.getStorageSync("store");
    that.setData({store: store});
    var openid = wx.getStorageSync("openid");
    that.setData({ openid: openid });
    that.init();
  },

  init(){
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    db.collection("menus").where({
      _openid: that.data.openid,
      store_id: that.data.store._id
    }).get({
      success: result => {
        that.setData({ results: result.data });
        wx.setStorageSync("menus", result.data);
        wx.hideLoading();
      }, fail: err => {
        console.log(err);
        wx.hideLoading();
      }
    })
  },

  selectOne(e) {
    var that = this;
    wx.showActionSheet({
      itemList:['编辑', '删除'],
      success(res) {
        if (res.tapIndex == 0){
          that.edit(e.currentTarget.dataset.menu);
        }else  if (res.tapIndex == 1) {
          that.onDel(e.currentTarget.dataset.menu);
        }
      }
    })
  },

  /**
   * 编辑
   */
  edit(item) {
    var that = this;
    that.setData({ showModal: true, menu: item});
  },

  /**
   * 新增
   */
  add(){
    var that = this;
    that.setData({ showModal: true, menu: {} });
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
  
    if (that.data.menu.name == "" || that.data.menu.name == undefined) {
      common.showAlertToast("请填写名称！");
      return;
    }

    that.setData({
      showModal: false
    })

    if (that.data.menu._id){
      that.onUpdate();
    }else{
      that.onCreate();
    }
  },

  onCreate(){
    var that = this;
    db.collection("menus").add({
      data: {
        store_id:that.data.store._id,
        name: that.data.menu.name,
      }, success: res => {
        wx.showToast({
          title: '新增成功！',
          icon: 'success',
          success(res) {
            that.init();
          }
        })
        that.setData({ menu: {}});
      }, fail: err => {
        that.setData({ menu: {} });
        if (err.errCode == -502001) {

          common.showAlertToast("该店名已经存在，请重新命名！");
        } else {

          common.showAlertToast("数据错误，请重试！");
        }
      }
    })
  },



  onUpdate() {
    var that = this;
    db.collection("menus").doc(that.data.menu._id).update({
      data: {
        name: that.data.menu.name,
      }, success: res => {
        wx.showToast({
          title: '更新成功！',
          icon: 'success',
          success(res) {
            that.init();
          }
        })
        that.setData({ menu: {} });
      }, fail: err => {
        that.setData({ menu: {} });
        if (err.errCode == -502001) {

          common.showAlertToast("该分类已经存在，请重新命名！");
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
    console.log(item);
    db.collection("menus").doc(item._id).remove({
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





