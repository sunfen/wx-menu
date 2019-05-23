// pages/index/addProject.js
const app = getApp()
var common = require('/../../pages/common/common.js');
const db = wx.cloud.database();
Page({
  data: {
    results: [],
    showModal: false,
    menu: null,
    submenu:{},
    sysWidth: app.globalData.sysWidth,
  },


  goback() {
    wx.navigateBack({ delta: 1 })
  },
  
  onLoad(options){
    var that = this;
   
    that.setData({menu: JSON.parse(options.menu)});
   
    that.init();
  },

  init(){
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    db.collection("submenus").where({
      _openid: that.data.openid,
      menu_id: that.data.menu._id
    }).get({
      success: result => {
        that.setData({ results: result.data });
        wx.setStorageSync("submenus", result.data);
        wx.hideLoading();
      }, fail: err => {
        console.log(err);
        wx.hideLoading();
      }
    })
  },



  selectOne(e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var item = e.currentTarget.dataset.submenu;
    that.setData({index: index});
    wx.showActionSheet({
      itemList:['上传封面', '查看类型' ,'编辑', '删除'],
      success(res) {
        if (res.tapIndex == 0) {
          that.setData({submenu: item });
          that.addImage(item, index);
        }if (res.tapIndex == 1) {
          that.viewSubSubMenus(item, index);
        }else if (res.tapIndex == 2){
          that.edit(item, index);
        }else  if (res.tapIndex == 3) {
          that.onDel(item, index);
        }
      }
    })
  },

  addImage(submenu, index) {
    var that = this;
    
    wx.chooseImage({
      count: 1,
      success(res) {
        wx.showLoading({
          title: '上传中...',
        })
        
        Promise.all(res.tempFilePaths.map((item) => {
            return wx.cloud.uploadFile({
              cloudPath: 'uploadImages/' + Date.now() + item.match(/\.[^.]+?$/)[0], // 文件名称 
              filePath: item,
            })
        })).then((resCloud) => {      
          if (resCloud && resCloud.length > 0 && resCloud[0].statusCode == 200){
          
            that.data.submenu.newfile = resCloud[0].fileID;
            that.setData({ submenu: that.data.submenu});
            that.onUpdate();
          }else{
          
            common.showAlertToast('上传失败');
          }
            wx.hideLoading()
        }).catch((err) => {
          console.log(err);
          common.showAlertToast('上传失败');
        })
        
      },
      fail(res) {
        that.data.submenu.newfile = null;
        that.setData({ submenu: that.data.submenu })
        common.showAlertToast('未选择');
      }
    })
  },

  /**
   * 查看标签
   */
  viewSubSubMenus(item, index) {
    var object = JSON.stringify(item);
    wx.navigateTo({
      url: '/pages/subsubmenu/subsubmenu?submenu=' + object,
    })
  },

  /**
   * 编辑
   */
  edit(item, index) {
    var that = this;
    that.setData({ showModal: true, submenu: item});
  },

  /**
   * 新增
   */
  add(){
    var that = this;
    that.setData({ showModal: true, submenu: {} });
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
  
    if (that.data.submenu.name == "" || that.data.submenu.name == undefined) {
      common.showAlertToast("请填写名称！");
      return;
    }

    that.setData({
      showModal: false
    })

    if (that.data.submenu._id){
      that.onUpdate();
    }else{
      that.onCreate();
    }
  },

  onCreate(){
    var that = this;
    db.collection("submenus").add({
      data: {
        menu_id: that.data.menu._id,
        name: that.data.submenu.name,
      }, success: res => {
        wx.showToast({
          title: '新增成功！',
          icon: 'success',
          success(res) {
            that.init();
          }
        })
        that.setData({ submenu: {}});
      }, fail: err => {
        that.setData({ submenu: {} });
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
    db.collection("submenus").doc(that.data.submenu._id).update({
      data: {
        name: that.data.submenu.name,
        file: that.data.submenu.newfile ? that.data.submenu.newfile : that.data.submenu.file,
      }, success: res => {
        if (that.data.submenu.file && that.data.submenu.newfile ){
          that.deleteImage(that.data.submenu.file);
        }
        wx.showToast({
          title: '更新成功！',
          icon: 'success',
          success(res) {
            that.init();
          }
        })
        that.setData({ submenu: {} });
      }, fail: err => {
        that.setData({ submenu: {} });
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
  onDel(item, index) {
    var that = this;
    db.collection("submenus").doc(item._id).remove({
      success: res => {
        if (item.file ) {
          that.deleteImage(item.file);
        }
        wx.showToast({
          title: '成功删除！',
          icon: 'success',
          success(res) {
            that.data.results.splice(index, 1);
            that.setData({ results: that.data.results })
          }
        })
      }, fail: err => {
        common.showAlertToast('删除失败');
      }
    })
  },


  deleteImage(file){
      wx.cloud.deleteFile({
        fileList: [file]
      }).then(res => {
        // handle success
        console.log(res)
      }).catch(error => {
        console.log(error)
      })
  },

  /**
    * 弹出框蒙层截断touchmove事件
    */
  preventTouchMove: function () {
  },


})





