// pages/mapNav/mapNav.js
// let QQMapWX = require('../../libs/qqmap-wx-jssdk.min.js');
// let qqmapsdk;
let app = getApp();
let PATH = app.globalData.PATH;

let IMG_PATH = app.globalData.IMG_PATH;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    IMG_PATH: IMG_PATH,
    index: 0,
    switchTip: '目标位置'
  },
  /**
   * 生命周期函数--监听页面加载
   */
  bindSwitch: function () {
    console.log(0);
      this.setData({
        switchTip: '目标位置',
        mapData: {
          lng: this.data.mapData.lng,
          lat: this.data.mapData.lat
        },
        index: 0
      });
    // if (this.data.index == 0) {
    //   console.log(this.data.markers[1].longitude, this.data.markers[1].latitude)
    //   this.setData({
    //     switchTip: '切换到我的位置',
    //     mapData: {
    //       lng: this.data.markers[1].longitude,
    //       lat: this.data.markers[1].latitude
    //     },
    //     index: 1
    //   });
    // } else {
    //   console.log(this.data.markers[0].longitude, this.data.markers[0].latitude)
    //   this.setData({
    //     switchTip: '切换到目标位置',
    //     mapData: {
    //       lng: this.data.markers[0].longitude,
    //       lat: this.data.markers[0].latitude
    //     },
    //     index: 0
    //   });
    // }
  },
  onLoad: function (options) {
    console.log(options);
    let that = this;
    that.setData({
      mapData: {
        lng: options.lng,
        lat: options.lat
      },
      // mapData: {
      //   lng: app.globalData.location.longitude,
      //   lat: app.globalData.location.latitude
      // },
      markers: [
      //   {
      //   iconPath: "/images/local.png",
      //   id: 0,
      //   latitude: app.globalData.location.latitude,
      //   longitude: app.globalData.location.longitude,
      //   width: 50,
      //   height: 50,
      //   callout: {
      //     content: '我的位置',
      //     color: "#ffffff",
      //     borderRadius: 4,
      //     bgColor: "#f4d000",
      //     padding: 6,
      //     display: "ALWAYS"
      //   }
      // },
      {
        iconPath: IMG_PATH+"/local.png",
        id: 1,
        latitude: options.lat,
        longitude: options.lng,
        width: 50,
        height: 50,
        callout: {
          content: '目标位置',
          color: "#ffffff",
          borderRadius: 4,
          bgColor: "#f4d000",
          padding: 6,
          display: "ALWAYS"
        }
      }]
    });
    // wx.getLocation({
    //   success: function (res) {
    //     console.log(res);
        
    //   },
    // })
    // qqmapsdk = new QQMapWX({
    //   key: 'CRZBZ-ROG3G-WGTQS-I4KDH-NKHDQ-Q5FCX'
    // });
    
    // qqmapsdk.calculateDistance({
    //   // to: [{
    //   //   latitude: 39.984060,
    //   //   longitude: 116.307520
    //   // }, {
    //   //   latitude: 39.984572,
    //   //   longitude: 116.306339
    //   // }],
    //   // success: function (res) {
    //   //   console.log(res);
    //   // },
    //   // fail: function (res) {
    //   //   console.log(res);
    //   // },
    //   // complete: function (res) {
    //   //   console.log(res);
    //   // }
    //   'mode': "walking",
    //   'from': {
    //     'longitude': parseFloat(options.lng) + 0.001,
    //     'latitude': parseFloat(options.lat) + 0.001
    //   },
    //   'to': [{
    //     'longitude': options.lng,
    //     'latitude': options.lat
    //   }],
    //   success: function (res) {
    //     console.log(res);
    //   },
    //   fail: function (res) {
    //     console.log(res);
    //   }
    // })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})