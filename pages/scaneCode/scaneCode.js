import { reToMainPage } from "../../libs/router";
let app = getApp();
let PATH = app.globalData.PATH;



let IMG_PATH = app.globalData.IMG_PATH;

let userInfoSync = wx.getStorageSync("userInfo");

Page({


  data: {
    IMG_PATH: IMG_PATH,

    device: null,
  },

  onLoad: function (options) {



    console.log(options);
    let that = this;




    wx.request({

      url: PATH + '/resource-service/device/getDeviceDetail',
      method: 'GET',
      header: {
        'Access-Token': app.globalData.accessToken,
      },

      data: {
        deviceId: options.deviceId
      },

      success: function (data) {
        console.log(data)

        that.setData({ device: data.data.device });

        if (data.data.device.rentalType == 1) {
          that.setData({ rentalType: "小时" });
          that.setData({ rental: data.data.device.rentalH });
        }

        if (data.data.device.rentalType == 2) {
          that.setData({ rentalType: "日" });
          that.setData({ rental: data.data.device.rental });
        }

        if (data.data.device.rentalType == 3) {
          that.setData({ rentalType: "月" });
          that.setData({ rental: data.data.device.rentalM });
        }

      }

    })

  },

  reciveDevice: function () {
    let that = this;

    wx.request({
      url: PATH + '/resource-service/device/RentDevice',
      method: 'GET',
      header: {
        'Access-Token': app.globalData.accessToken,
      },
      data: {
        userId: app.globalData.userId,
        deviceId: that.data.device.id,
      },
      success: function (data) {
        console.log(data)

        if (data.statusCode == 200 && data.data.status == 200) {

          wx.redirectTo({
            url: '../reciveSuccess/reciveSuccess',
          })

        }
         
      }
    })

  },

  changeDevice: function () {
    wx.request({
      url: PATH + '/resource-service/device/changeDevice',
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
        tipModal(data.data.message);
        
        if (data.statusCode == 200 && data.data.status == 200) {

          wx.redirectTo({
            url: '../reciveSuccess/reciveSuccess',
          })

        }

      }
    })
  }




})

function tipModal(tip) {
  wx.showToast({
    title: tip,
    icon: 'loading',
    duration: 3000,
    success: function () {
      setTimeout(function () {
        reToMainPage();
      }, 3000)
    }
  })
}