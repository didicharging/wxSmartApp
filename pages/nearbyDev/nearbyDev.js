let app = getApp();
let PATH = app.globalData.PATH;

let IMG_PATH = app.globalData.IMG_PATH;


Page({
  data: {
    IMG_PATH: IMG_PATH,
    logs: []
  },
  onLoad: function () {
    let that = this;
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      console.log(app.globalData)
      let imgs = userInfo.avatarUrl;
      that.setData({
        userInfo: userInfo
      })
    });
  }
})
