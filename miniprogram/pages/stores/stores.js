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


  goback() {
    wx.navigateBack({ delta: 1 })
  },

  
  init(){
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    db.collection("stores").where({
      _openid: app.globalData.openid
    }).get({
      success: result => {
        console.log(result)
        that.setData({ results: result.data });
        wx.setStorageSync("stores", result.data);
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
          that.edit(e.currentTarget.dataset.store);
        }else  if (res.tapIndex == 1) {
          that.onDel(e.currentTarget.dataset.store);
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
      that.onUpdate();
    }else{
      that.onCreate();
    }
  },

  onCreate(){
    var that = this;
    db.collection("stores").add({
      data: {
        name: that.data.store.name,
        is_owner: true,
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
        console.log(err.errCode);
        if (err.errCode == -502001){
          
          common.showAlertToast("该店名已经存在，请重新命名！");  
        }else{

          common.showAlertToast("数据错误，请重试！");
        }
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
        if (err.errCode == -502001) {

          common.showAlertToast("该店名已经存在，请重新命名！");
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
    wx.showModal({
      title: '提示',
      content: '确定删除吗？菜单以及店内成员将一并删除!',
      success(res) {
        if (res.confirm) {
          that.deleteStore(item);
        } else if (res.cancel) {
        }
      }
    })
  },

  deleteStore(item){
    var that = this;
    db.collection("stores").doc(item._id).remove({
      success: res => {
        wx.showToast({
          title: '成功删除！',
          icon: 'success',
          success(res) {
            that.init();
          }
        })
        
        db.collection("menus").where({
          _openid: that.data.openid,
          store_id: item._id
        }).get({
          success: result => {

            for(var i = 0; i < result.data.length; i ++){
              db.collection("menus").doc(result.data[i]._id).remove({
                success: res => {

                }, fail: err => {
                  common.showAlertToast('删除失败');
                }
              })
            }
          }
        })
        

        db.collection("stores").where({
          _id: item._id
        }).get({
          success: result => {

            for (var i = 0; i < result.data.length; i++) {
              db.collection("stores").doc(result.data[i]._id).remove({
                success: res => {
                }, fail: err => {
                  common.showAlertToast('删除失败');
                }
              })
            }
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





