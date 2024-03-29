const app = getApp();
var header = app.globalData.header;

function errorWarn(content) {
  wx.showModal({
    content: content,
    showCancel: false
  })
}

module.exports.errorWarn = errorWarn;

function loginFail() {
  this.errorWarn("未能成功登录, 请重新登录");
}

module.exports.loginFail = loginFail;


function showAlertToast(message) {
  wx.showToast({
    title: message,
    icon: 'none',
  })
}

module.exports.showAlertToast = showAlertToast;


//手指触摸动作开始 记录起点X坐标
function touchstart(e, that) {

  //开始触摸时 重置所有删除

  that.data.results.forEach(function (v, i) {

    if (v.isTouchMove)//只操作为true的

      v.isTouchMove = false;

  })

  that.setData({

    startX: e.changedTouches[0].clientX,

    startY: e.changedTouches[0].clientY,

    results: that.data.results

  })

}

module.exports.touchstart = touchstart;

//滑动事件处理

function touchmove(e, that) {

    var index = e.currentTarget.dataset.index,//当前索引

    startX = that.data.startX,//开始X坐标

    startY = that.data.startY,//开始Y坐标

    touchMoveX = e.changedTouches[0].clientX,//滑动变化坐标

    touchMoveY = e.changedTouches[0].clientY,//滑动变化坐标

    //获取滑动角度

    angle = this.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });

  that.data.results.forEach(function (v, i) {

    v.isTouchMove = false

    //滑动超过30度角 return

    if (Math.abs(angle) > 30) return;

    if (i == index) {

      if (touchMoveX > startX) //右滑

        v.isTouchMove = false

      else //左滑

        v.isTouchMove = true

    }

  })

  //更新数据
  that.setData({
    results: that.data.results
  })

}


module.exports.touchmove = touchmove;

/**
 
* 计算滑动角度
 
* @param {Object} start 起点坐标
 
* @param {Object} end 终点坐标
 
*/

function angle(start, end) {

  var _X = end.X - start.X,

    _Y = end.Y - start.Y

  //返回角度 /Math.atan()返回数字的反正切值

  return 360 * Math.atan(_Y / _X) / (2 * Math.PI);

}

module.exports.angle = angle;