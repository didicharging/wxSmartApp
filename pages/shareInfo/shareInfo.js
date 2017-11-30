let app = getApp();
Page({
  data: {
    logs: []
  },
  onLoad: function () {
    let that = this;
    app.getUserInfo(function (userInfo) {
      //更新数据
      console.log(app.globalData)
      // var imgs = userInfo.avatarUrl;
      that.setData({
        userInfo: userInfo
      })
    })
  }
})
