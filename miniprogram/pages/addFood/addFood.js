// pages/user/user.js
//获取应用实例
var app = getApp();
var common = require('/../../pages/common/common.js');
const db = wx.cloud.database();


Page({
  data: {
    sysWidth: app.globalData.sysWidth,
    types:['大杯', '中杯', '小杯'],
    typeIndex: '大杯',
    menuIndex: 0,
    foods:[{}],
    steps: [{ images: []}]
  },

  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    var menus = wx.getStorageSync("menus");
    console.log(menus);
    if (menus == undefined || menus == null || !menus){
      menus = [];
      this.setData({ menusReply: true })
    }
    menus.push({name: "手动输入"});
    that.setData({ menus : menus});
  },


  goback() {
    wx.navigateBack({ delta: 1 })
  },

  /**
   * 输入框输入事件
   */
  inputValue: function (e) {
    var that = this;
    var name = e.target.id;
    that.setData({
      [name]: e.detail.value
    })
    console.log(that.data);
  },

  addFoods(){
    var that = this;
    that.data.foods.push({});
    that.setData({ foods: that.data.foods})
  },

  addSteps() {
    var that = this;
    that.data.steps.push({images:[]});
    that.setData({ steps: that.data.steps })
  },

  removeSteps(e){
    var that = this;
    that.data.steps.splice(e.target.dataset.index ,1);
    that.setData({ steps: that.data.steps })
  },

  removeFoods(e) {
    var that = this;
    that.data.foods.splice(e.target.dataset.index, 1);
    that.setData({ foods: that.data.foods })
  },


  clearFoods:function(e){
    var that = this;
    that.setData({ foods: [] })
  },

  clearSteps: function (e) {
    var that = this;
    that.setData({ steps: [] })
  },

  addStepImages(e){
    var that = this;
    var index = e.target.dataset.index;
    var images = that.data.steps[index].images;
    wx.chooseImage({
      count: 3 - images.length,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        for (var i = 0; i < res.tempFiles.length; i++) {
          images.push(res.tempFiles[i]);
        }
        that.data.steps[index].images = images;
        that.setData({ steps: that.data.steps })
      }, fail(res) {
        console.log(res);
      }
    })
  },



  
  typeChange(e) {
    console.log(e.detail.value);
    this.setData({ menuTypeIndex: this.data.types[e.detail.value] });
  },

  menuTypeChange(e) {
    console.log(e.detail.value);
    this.setData({ menuIndex: this.data.menus[e.detail.value] });
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
    console.log(currents);
    var paths = [];
    for (var i = 0; i < currents.length; i++) {
      paths.push(currents[i].path);
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
    wx.showLoading({
      title: '上传中...',
    })
    Promise.all(res.tempFilePaths.map((item) => {
      return wx.cloud.uploadFile({
        cloudPath: 'uploadImages/' + Date.now() + item.match(/\.[^.]+?$/)[0], // 文件名称 
        filePath: item,
      })
    })).then((resCloud) => {
      wx.hideLoading()
      console.log(resCloud);
    }).catch((err) => {
      console.log(err)
    })
  }

})