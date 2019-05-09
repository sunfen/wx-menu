// pages/index/addProject.js
const app = getApp()
var common = require('/../../pages/common/common.js');
const db = wx.cloud.database();
Page({
  data: {
    results: [],
    showModal: false,
    store: null
  },

  onLoad(){
    var that = this;
    that.init();
  },

  init(){
    var that = this;
    db.collection("stores").where({
      _openid: app.globalData.openid
    }).get({
      success: result => {
        console.log(result)
        that.setData({ results: result.data });
      }, fail: err => {
        console.log(err)
      }
    })
  },

  selectOne(e) {
    var that = this;
    wx.showActionSheet({
      itemList:['编辑', '删除'],
      success(res) {
        if (res.tapIndex == 0){
          console.log(e);
          that.edit(e.target.dataset.store);
        }else  if (res.tapIndex == 1) {
          that.onDel(e.target.dataset.store);
        }
      }
    })
  },

  /**
   * 编辑
   */
  edit(item) {
    var that = this;
    that.setData({ showModal: true, store: item});
  },

  /**
   * 新增
   */
  add(){
    var that = this;
    that.setData({ showModal: true, store: {} });
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
  
    if (that.data.store.name == "" || that.data.store.name == undefined) {
      common.showAlertToast("请填写店名！");
      return;
    }

    that.setData({
      showModal: false
    })

    if (that.data.store._id){
      that.onCreate();
    }else{
      that.onUpdate();
    }
  },

  onCreate(){
    var that = this;
    db.collection("stores").add({
      data: {
        name: that.data.store.name == "" || that.data.store.name,
      }, success: res => {
        wx.showToast({
          title: '新增成功！',
          icon: 'success',
          success(res) {
            that.init();
          }
        })
        that.setData({store: {}});
      }, fail: err => {
        that.setData({ store: {} });
        common.showAlertToast("数据错误，请重试！");
      }
    })
  },



  onUpdate() {
    var that = this;
    db.collection("stores").doc(that.data.store._id).update({
      data: {
        name: that.data.store.name,
      }, success: res => {
        wx.showToast({
          title: '更新成功！',
          icon: 'success',
          success(res) {
            that.init();
          }
        })
        that.setData({ store: {} });
      }, fail: err => {
        that.setData({ store: {} });
        common.showAlertToast("数据错误，请重试！");
      }
    })
  },

  /**
   * 删除
   */
  onDel(item) {
    var that = this;
    console.log(item);
    db.collection("stores").doc(item._id).remove({
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





