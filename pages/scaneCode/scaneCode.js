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
    IMG_PATH: IMG_PATH
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
        userId: app.globalData.userId,
        deviceNo: options.deviceNo
      },
      success: function (data) {
        that.setData({ device: data.data.device })
        console.log(data);
        if (data.data.isChargeMan == "yes"){
          that.setData({
            xu: true,
            huan: true,
            zhu: true,
            da: true,
            xiu: true
          })
        }else{
          if (data.data.device.type == 4 || data.data.device.type == 5 || data.data.device.type == 6) {
            that.setData({
              da: true,
              hui: true,
              fei: true
            })
          } else if (data.data.device.type == 3) {
            that.setData({
              xu: true,
              huan: true,
              zhu: true,
              hui: true,
              fei: true
            })
          } else if (data.data.device.type == 1 || data.data.device.type == 2 || data.data.device.type == 7 || data.data.device.type == 8 || data.data.device.type == 9) {
            that.setData({
              huan: true,
              xu: true,
              da: true,
              hui: true,
              fei: true
            })
          } 
        }
      }

    })
  },
//租电
  zhu: function () {
  
  let that=this;

    wx.request({
      url: PATH + '/resource-service/device/RentDevice',
      method: 'GET',
      header: {
        'Access-Token': app.globalData.accessToken,
      },
      data: {
        userId: app.globalData.userId,
        deviceId: that.data.device.id
      },
      success: function (data) {
        console.log(data.data);
        if (data.data.status == 210){
          console.log("设备故障");
          wx.showModal({
            title: '设备故障',
            content: data.data.message,
            showCancel: false,
            success: function (res) {
              
            }
          })
          return;
        } else if (data.data.status == 213){
          wx.redirectTo({
            url: '../payShare/payShare?deviceId=' + that.data.device.id + '&money=' + data.data.money + '&reminShare=' + data.data.reminShare,
          })
        } else if (data.data.status == 211) {
          wx.redirectTo({
            url: '../reciveCharging/reciveCharging?deviceId=' + that.data.device.id +'&type=rental',
          })
        } else if (data.data.status == 200) {
          wx.redirectTo({
            url: '../reciveSuccess/reciveSuccess',
          })
        } else if (data.data.status==210){
          
        }
      }
    })
  },
  //回收
  hui:function(){
    let that=this;
    wx.request({
      url: PATH + '/resource-service/device/ReciveDevice',
      method: 'GET',
      header: {
        'Access-Token': app.globalData.accessToken,
      },
      data: {
        userId: app.globalData.userId,
        deviceId: that.data.device.id
      },
      success: function(data) {
        console.log("aaaaaa");
        console.log(data.data);
        if (data.data.status==200){
          wx.showModal({
            title: '回收成功',
            content: data.data.message,
            showCancel: false,
            success: function (res) {
              wx.redirectTo({
                url: '../main/main',
              })
            }
          })
          return;
        } else if (data.data.status==210){
          wx.showModal({
            title: '领取失败',
            content: data.data.message,
            showCancel: false,
            success: function (res) {
              wx.redirectTo({
                url: '../main/main',
              })
            }
          })
          return;
        }
      }
    })
  },
  //报废
  fei: function () {
    let that = this;
    wx.request({
      url: PATH + '/resource-service/device/destroyDevice',
      method: 'GET',
      header: {
        'Access-Token': app.globalData.accessToken,
      },
      data: {
        userId: app.globalData.userId,
        deviceId: that.data.device.id
      },
      success: function (data) {
        console.log("aaaaaa");
        console.log(data.data);
        if (data.data.status == 200) {
          wx.showModal({
            title: '报废成功',
            content: data.data.message,
            showCancel: false,
            success: function (res) {
              wx.redirectTo({
                url: '../main/main',
              })
            }
          })
          return;
        } else if (data.data.status == 210) {
          wx.showModal({
            title: '报废失败',
            content: data.data.message,
            showCancel: false,
            success: function (res) {
              wx.redirectTo({
                url: '../main/main',
              })
            }
          })
          return;
        }
      }
    })
  },
  //换电
  huan:function(){
    let that=this;
    wx.request({
      url: PATH + '/resource-service/device/changeDevice',
      method: 'GET',
      header: {
        'Access-Token': app.globalData.accessToken,
      },
      data: {
        userId: app.globalData.userId,
        deviceId: that.data.device.id
      },
      success: function (data) {
        console.log("aaaaa");
        console.log(data.data);
        if (data.data.status==200){
          wx.showModal({
            title: '换电成功',
            content: data.data.message,
            showCancel: false,
            success: function (res) {
              wx.redirectTo({
                url: '../reciveSuccess/reciveSuccess',
              })
            }
          })
          return;
        } else if (data.data.status==211){
          wx.showModal({
            title: '余额不足',
            content: data.data.message,
            showCancel: false,
            success: function (res) {
              wx.redirectTo({
                url: '../reciveCharging/reciveCharging?deviceId=' + that.data.device.id +'&type=change',
              })
            }
          })
        } else if (data.data.status==210){
          wx.showModal({
            title: '换电失败',
            content: data.data.message,
            showCancel: false,
            success: function (res) {
              wx.redirectTo({
                url: '../main/main',
              })
            }
          })
        }
      }
    })
  },
  //保修


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
