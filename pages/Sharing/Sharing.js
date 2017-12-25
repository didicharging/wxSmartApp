let app = getApp();
Page({
  data: {
  },
  recharg:function(e){
    wx.navigateTo({
      url: '../reciveCharging/reciveCharging'
    })
  },
  withdraw: function () {
    wx.navigateTo({
      url: '../bill/bill'
    })
  },
  onLoad: function () {
   
  },

  onShow: function () {
    
  }
})