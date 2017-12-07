import { reToMainPage } from "../../libs/router";
let app = getApp();
let PATH = app.globalData.PATH;



let IMG_PATH = app.globalData.IMG_PATH;

let userInfoSync = wx.getStorageSync("userInfo");

Page({


  data: {
    IMG_PATH: IMG_PATH,
    isManager: 'false',
    device: null,
  },

  onLoad: function (options) {

    let that = this;

    that.setData({ isManager: options.isManager });

    console.log("options: " + options.deviceId);

    wx.request({
      url: PATH + '/resource-service/device/getDeviceDetail',
      method: 'GET',
      header: {
        'Access-Token': app.globalData.accessToken,
      },
      data: {
        deviceId: '4'
      },
      success: function (data) {
        that.setData({ device: data.data.device });
      }

    })

  },


  buyStart: function () {
    wx.request({
      url: PATH + '/resource-service/device/buyStart',
      method: 'GET',
      header: {
        'Access-Token': app.globalData.accessToken,
      },
      data: {
        userId: app.globalData.userId,
        deviceId: this.data.device.id,
      },
      success: function (data) {
        console.log(data)

        wx.showModal({
          title: '提示',
          content: data.data.message,
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              return;
            }
          }
        })

      }
    })
  },

  startService: function () {
    wx.request({
      url: PATH + '/resource-service/device/startService',
      method: 'GET',
      header: {
        'Access-Token': app.globalData.accessToken,
      },
      data: {
        userId: app.globalData.userId,
        deviceId: this.data.device.id,
      },
      success: function (data) {
        console.log(data)
        wx.showModal({
          title: '提示',
          content: data.data.message,
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              return;
            }
          }
        })

      }
    })
  }

})

