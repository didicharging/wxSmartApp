import {
  goToUser, goToShare, goToNearbyDev, goToMapNav, goToReceiveDev, goToScaneCode,
  goToUserInfo, goToPayUseFee, goToShareDetail
} from "../../libs/router";

let app = getApp();
let PATH = app.globalData.PATH;
let IMG_PATH = app.globalData.IMG_PATH;
let time = 5;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    IMG_PATH: IMG_PATH,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    wx.request({

      url: PATH + '/resource-service/device/getDeviceState',
      method: 'GET',
      data: {
        userId: user,
        deviceNo: code,

      },

      success: function (data) {
        console.log(data);

        let device = data.data.device;
        if (data.statusCode == 200 && data.data.status == 210) {

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

        // 状态正常 跳转到领取成功页面
        if (data.statusCode == 200 && data.data.status == 201) {
          // goToScaneCode(data.data.isManager, device.id, device.deviceNo);

          wx.redirectTo({
            url: '../Sharing/Sharing',
          })

        }

      }
    })

  },


  charging: function () {

    let that = this;

    clearInterval(that.data.timeInterval);

    wx.redirectTo({
      url: '../reciveCharging/reciveCharging?deviceId=' + data.data.device.id,
    })

  },


})