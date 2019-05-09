const app = getApp()
Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    current:{
      type: String,
      value: 0
    },

  },
  data: {
    // 这里是一些组件内部数据
  },
  methods: {
    goHome: function () {
      wx.redirectTo({
        url: '/pages/index/index',
      })
    },
    goAddFood: function () {
      wx.redirectTo({
        url: '/pages/addFood/addFood',
      })
    },
    goMy: function () {
      wx.redirectTo({
        url: '/pages/user/user',
      })
    },
  
  }

})
