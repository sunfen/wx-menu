// pages/user/user.js
//获取应用实例
var app = getApp();
var common = require('/../../pages/common/common.js');
const db = wx.cloud.database();


Page({
  data: {
    sysWidth: app.globalData.sysWidth,
    menuIndex: 0,
    submenuIndex: 0,
    subsubmenuIndex: 0,
    menuIndexs:[0, 0, 0],
    isFromSub: false,
    menus:[],
    method: { foods: [{}], steps: [{ images: [], files: [] }]}
  },

  // 页面初始化 options为页面跳转所带来的参数
  onLoad: function (options) {
    var that = this;
    if (options && options.subsubmenu){
      
      that.setData({ isFromSub: true, subsubmenu: JSON.parse(options.subsubmenu) });
    } if (options && options.method) {
      that.setData({ isFromSub: true,  method: JSON.parse(options.method) });
      for(var i =0; i< that.data.method.steps.length; i++){
        that.data.method.steps[i].images = that.data.method.steps[i].files;
      }
      that.setData({ method: that.data.method });
    }else{

      var menus = wx.getStorageSync("menus");
      that.setData({ menus : menus});
      that.getSubMenus(0);
      that.setData({ currentmenu: that.data.menus[0]});
    }

  },

  getSubMenus(index) {
    var that = this;

    db.collection("submenus").where({
      _openid: that.data.openid,
      menu_id: that.data.menus[index]._id
    }).get({
      success: result => {

        that.data.menus[index].submenus = result.data;
        that.setData({menus: that.data.menus });
        if (!that.data.currentsubmenu){
          that.setData({ currentsubmenu: that.data.menus[0].submenus[0]});
        }
        if (result.data && result.data.length > 0) {
          that.getSubsubmenus(index, 0);
        }
        wx.hideLoading();

      }, fail: err => {
        
        console.log(err);
        wx.hideLoading();
      }
    })
  },

  getSubsubmenus(index, index1) {
    var that = this;
    db.collection("subsubmenus").where({
      _openid: that.data.openid,
      submenu_id: that.data.menus[index].submenus[index1]._id

    }).get({

      success: result1 => {
        
        that.data.menus[index].submenus[index1].subsubmenus = result1.data;
        that.setData({ menus: that.data.menus });
        if (!that.data.currentsubsubmenu) {
          that.setData({ currentsubsubmenu: that.data.menus[0].submenus[0].subsubmenus[0]});
        }
        if (that.data.menus[index].submenus.length - 1 != index1) {
          that.getSubsubmenus(index, index1 + 1);
        } else {
          wx.hideLoading();
        }

      }, fail: err => {
        wx.hideLoading();
      }
    })
  },


  changeType(e){
    var that = this;
    that.setData({showPicker : true});
  },

  surepicker(e){
    var that = this;
    that.setData({ 
      showPicker: false, 
      currentmenu: that.data.menu,
      currentsubmenu: that.data.submenu, 
      currentsubsubmenu: that.data.subsubmenu
    });
  },

  menuTypeChange(e) { 
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    const val = e.detail.value;
    that.setData({ menuIndexs: val, menu: that.data.menus[val[0]]})
    console.log(that.data);

    if (that.data.menu && !that.data.menu.submenus) {

      that.getSubMenus(val[0]);
      setTimeout(function(){
        that.setData({
          submenu: that.data.menus[val[0]].submenus[val[1]],
          subsubmenu: that.data.menus[val[0]].submenus[val[1]].subsubmenus[val[2]]
        })
        wx.hideLoading();
      }, 2000);

    }else{

      that.setData({
        submenu: that.data.menus[val[0]].submenus[val[1]],
        subsubmenu: that.data.menus[val[0]].submenus[val[1]].subsubmenus[val[2]]
      })
      wx.hideLoading();
    }
  },




  /**
   * 输入框输入事件
   */
  inputValue: function (e) {
    var that = this;
    that.setData({ [e.target.id]: e.detail.value })
  },

  foodtextChange: function (e) {
    var that = this;
    that.data.method.foods[e.currentTarget.dataset.index].foodtext = e.detail.value;
    that.setData({ method: that.data.method })
  },

  weightChange:function(e){
    var that = this;
    that.data.method.foods[e.currentTarget.dataset.index].weight = e.detail.value;
    that.setData({ method: that.data.method })
  },

  descriptionChange: function (e) {
    var that = this;
    that.data.method.steps[e.currentTarget.dataset.index].description = e.detail.value;
    that.setData({ method: that.data.method })
  },


  addFoods(){
    var that = this;
    that.data.method.foods.push({});
    that.setData({ method: that.data.method})
  },

  addSteps() {
    var that = this;
    that.data.method.steps.push({ images: [], files: []});
    that.setData({ method: that.data.method })
  },

  removeSteps(e){
    var that = this;
    that.data.method.steps.splice(e.target.dataset.index ,1);
    that.setData({ method: that.data.method })
  },

  removeFoods(e) {
    var that = this;
    that.data.method.foods.splice(e.target.dataset.index, 1);
    that.setData({ method: that.data.method })
  },


  clearFoods:function(e){
    var that = this;
    that.setData({ ['method.foods']: [] })
  },

  clearSteps: function (e) {
    var that = this;
    that.setData({ ['method.steps']: [] })
  },

  addStepImages(e){
    var that = this;
    var index = e.target.dataset.index;
    var images = that.data.method.steps[index].images;

    wx.chooseImage({
      count: 3 - images.length,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        
        for (var i = 0; i < res.tempFiles.length; i++) {
          images.push(res.tempFiles[i]);
        }
        
        that.data.method.steps[index].images = images;
        that.setData({ method: that.data.method })

      }, fail(res) {
        console.log(res);
      }
    })
  },





  touchstart(e) {
    this.setData({ startTime: e.timeStamp });
  },


  touchmove(e) {
    this.setData({ endTime: e.timeStamp });
  },


  clickHandle(e) {
    this.setData({ endTime: e.timeStamp });

    if (this.data.endTime - this.data.startTime < 350) {
      this.previewImage(e);
    } else {
      this.handleLongPress(e);
    }

    this.setData({ endTime: 0, startTime: 0 });
  },


  previewImage: function (e) {
    var current = e.target.dataset.src;
    var currents = e.target.dataset.srcs;

    var paths = [];
    for (var i = 0; i < currents.length; i++) {
      var path = currents[i].path ? currents[i].path : currents[i];
      paths.push(path);
    }
    wx.previewImage({
      current: current,
      urls: paths
    })
  },

  handleLongPress(e) {
    var that = this;
    if (that.data.isView) {
      that.previewImage(e);
    } else {
      wx.showActionSheet({
        itemList: ['删除'],
        success(res) {
          if (res.tapIndex == 0) {
            that.remove(e);
          }
        }
      })
    }
  },

  save(){
    var that = this;
    if (!that.data.currentsubsubmenu || !that.data.currentsubsubmenu._id){
      common.showAlertToast("请选择菜品!");
      return;
    }
    
    if (!that.data.method || !that.data.method.steps || that.data.method.steps.length <= 0) {
      common.showAlertToast("请填写制作步骤!");
      return;
    }

    wx.showLoading({
      title: '保存中...',
    })
    

    var index = 0;
    that.uploadImages(0, 0);

  },

  uploadImages(index, imageIndex){
    var that = this;
    if (that.data.method.steps[index].images.length <= 0){
      that.uploadImages(index + 1, 0);
      return;
    }

    var path = that.data.method.steps[index].images[imageIndex].path;
    
    wx.cloud.uploadFile({
      cloudPath: 'uploadImages/steps/' + that.data.currentsubsubmenu._id + '/' + Date.now() + path.match(/\.[^.]+?$/)[0],
      filePath: path,

      complete(res){

        if (res.statusCode == 200) {
          that.data.method.steps[index].files.push(res.fileID);
          that.setData({ method: that.data.method });
        }

        if (imageIndex == that.data.method.steps[index].images.length -1
          && index != that.data.method.steps.length -1){
        
          that.data.method.steps[index].images = [];
          that.setData({method : that.data.method});
          that.uploadImages(index + 1, 0);

        }else if (imageIndex == that.data.method.steps[index].images.length - 1
          && index == that.data.method.steps.length - 1) {
            
            that.data.method.steps[index].images = [];
            that.setData({ method: that.data.method });
            that.create();
        }else{
          that.uploadImages(index, imageIndex+1);
        }
      }
    })
  },



  create(){
    var that = this;
    db.collection("methods").add({
      data: {
        subsubmenu_id: that.data.currentsubsubmenu._id,
        foods: that.data.method.foods,
        steps: that.data.method.steps,
        remark: that.data.method.remark ? that.data.method.remark : '',
      }, success: res => {

        wx.hideLoading()
        wx.showToast({
          title: '新增成功！',
          icon: 'success',
          success(res) {
            setTimeout(function(){

              wx.redirectTo({
                url: '/pages/index/index',
              })
            }, 300)
          }
        })

      }, fail: err => {
        wx.hideLoading()
        common.showAlertToast("数据错误，请重试！");
        console.log(5);
      }
    })
  },


  goback() {
    wx.navigateBack({ delta: 1 })
  },
})