import {
  goToUser, goToShare, goToNearbyDev, goToMapNav, goToReceiveDev, goToScaneCode,
  goToUserInfo, goToPayUseFee, goToShareDetail
} from "../../libs/router";

import {
  scansaoma, gofujin, gofenxaing, getDeviceState
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

    device: null,
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
        userId: app.globalData.userId,
      },

      success: function (data) {
        console.log(data)
        
        // that.setData
        that.setData({ message:data.data.message });
  
        //余额不足
        if (data.statusCode == 200 && data.data.status == 213) {
          var money = data.data.money;
          
          wx.redirectTo({
            url: '../payShare/payShare?deviceId=' + data.data.device.id + '&money=' + data.data.money + "&reminShare=" +          data.data.reminShare,
          })
        }

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

  getDeviceState: function () {
    let that = this;

    getDeviceState(app.globalData.userId, that.data.device.deviceNo, PATH);

    // wx.request({
    //   url: PATH + '/resource-service/device/getDeviceState',
    //   method: 'GET',
    //   header: {
    //     'Access-Token': app.globalData.accessToken,
    //   },

    //   data: {
    //     userId: app.globalData.userId,
    //     deviceNo: that.data.device.deviceNo,
    //   },

    //   success: function (data) {
    //     console.log(data)

    //     if (data.statusCode == 200 && data.data.status == 200) {

    //       wx.redirectTo({
    //         url: '../reciveSuccess/reciveSuccess',
    //       })

    //     }

    //    // 余额不足 请求充值余额
    //    if (data.statusCode == 200 && data.data.status == 211) {

    //      wx.redirectTo({
    //        url: '../reciveCharging/reciveCharging?deviceId=' + data.data.device.id,
    //      });

    //      return;
    //    }

    //    // 有欠款发生
    //    if (data.statusCode == 200 && data.data.status == 212) {
    //      console.log("有欠款");

    //      wx.showModal({
    //        title: '欠款提示',

    //        content: data.data.message,
    //        showCancel: false,
    //        confirmText: "开始支付",
    //        success: function (res) {
    //          payDebt(app.globalData.userId);

    //        }
    //      });



    //      return;
    //    }

    //   }
    // })

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