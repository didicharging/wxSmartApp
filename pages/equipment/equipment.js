let app = getApp();
Page({
  data: {
  },
  recharg: function (e) {
    wx.navigateTo({
      url: '../myDevice/myDevice'
    })
  },
  surrende: function () {
    wx.navigateTo({
      url: '../surrender/surrender'
    })
  },
  rechar:function(){
    wx.navigateTo({
      url: '../recharge/recharge'
    })
  },
  detail:function(){
    wx.navigateTo({
      url: '../details/details'
    })
  },
  onLoad: function () {

  },
  onShow: function () {

  }
})