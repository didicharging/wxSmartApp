import {
  goToUser, goToShare, goToNearbyDev, goToMapNav, goToReceiveDev, goToScaneCode,
  goToUserInfo, goToPayUseFee, goToShareDetail
} from "../../libs/router";

import {
  scansaoma, gofujin, gofenxaing, getDeviceState, RentDevice, changeDevice
} from "../../libs/saoma";

import {
  payDebt
} from "../../libs/publiceFn";

let app = getApp();
let PATH = app.globalData.PATH;

let IMG_PATH = app.globalData.IMG_PATH;

let userInfoSync = wx.getStorageSync("userInfo");

Page({

  data: {
    IMG_PATH: IMG_PATH,
    message:[]
  },

  onLoad: function (options) {

    console.log(options);
    let that = this;
    wx.request({
      url: PATH + '/resource-service/device/scaneCode',
      method: 'GET',
      header: {
        'Access-Token': app.globalData.accessToken,
      },
      data: {
        deviceNo: options.deviceNo,
        //deviceNo: "didi5010001007",
        userId: app.globalData.userId,
      },
      success: function (data) {
        console.log(data.data.device);
        that.setData({ message: data.data.device });
        if (data.data.device.type == 4 || data.data.device.type == 5 || data.data.device.type == 6){
          that.setData({
            da: true
          })
        } else if (data.data.device.type == 3){
          that.setData({
            xu: true,
            huan: true,
            zhu: true
          })
        } else if (data.data.device.type == 1 || data.data.device.type == 2 || data.data.device.type == 7 || data.data.device.type == 8 || data.data.device.type == 9){
          that.setData({
            huan: true,
            xu: true,
            da: true
          })
        }
      }

    })
  },



  // 去地图
  goToMap: function () {
    gofujin(app.globalData.location)
  },

  // 触电扫码
  scanCode: function () {
    let that = this;
    scansaoma(app.globalData.userId, goToReceiveDev, PATH)
  },

  // 我的
  goToUser: function () {
    goToUser();
  },

  // 分享
  goToShare: function () {
    let that = this;
    gofenxaing()

  },
  //首页
  homePage: function () {
    wx.redirectTo({
      url: '/pages/main/main',
    })
  }

})
