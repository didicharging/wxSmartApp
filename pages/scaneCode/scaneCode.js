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



  repair:function(){
    let that = this;
    wx.request({
      url: PATH + '/resource-service/device/repairDevice',
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
        } else if (data.data.status == 210) {
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

  contiueRent:function(){

    console.log("续租");
    
    let that=this;

    wx.request({
      url: PATH + "/resource-service/pay/getMyOrders",
      header: {
        'Access-Token': app.globalData.accessToken,
      },

      method: "GET",

      data: {
        userId: app.globalData.userId
      },
      success: function (res) {
        console.log(res);
        if (res.statusCode == 200) {
          let moodList = res.data.list;

      
           
          that.setData({
            chooseMood: moodList,
            mood: moodList[0].deviceName,
            orderId: moodList[0].id,

          });

        }
      },
    });

    this.setData({
      maskState: true,
    });

  },


  bindChooseOrder: function (e) {
    let that=this;
  console.log(e);

    this.setData({
      mood: that.data.chooseMood[e.detail.value].deviceName,
      orderId: that.data.chooseMood[e.detail.value].id,
    })
    
  },




  bindCloseMask: function () {
    console.log("关闭模态框");
    this.setData({
      maskState: false,
    });
  },

  bindSubCode: function () {
    let that = this;

    console.log("开始提交");

    // if (data.phone.length != 11) {
    //   wx.showToast({
    //     title: "不是正确的手机号码",
    //     icon: 'loading',
    //     duration: 1000
    //   });
    //   return false;
    // }
    // if (!checkPhone(data.phone)) {
    //   wx.showToast({
    //     title: "不是正确的手机号码",
    //     icon: 'loading',
    //     duration: 1000
    //   });
    //   return false;
    // }
    // if (data.code == '') {
    //   wx.showToast({
    //     title: "验证码不能为空",
    //     icon: 'loading',
    //     duration: 1000
    //   });
    //   return false;
    // }
    // if (data.codeTrue != data.code) {
    //   wx.showToast({
    //     title: "验证码不正确",
    //     icon: 'loading',
    //     duration: 1000
    //   });
    //   return false;
    // }
    // that.data.user.mobile = that.data.phone;
    // wx.showToast({
    //   title: "手机验证成功",
    //   icon: 'success',
    //   duration: 1500,
    //   success: function () {
    //     setTimeout(function () {
    //       that.setData({
    //         user: that.data.user,
    //         phone: "",
    //         code: "",
    //         codeTrue: "",
    //         maskState: false,
    //       });
    //     }, 1500)
    //   }
    // });

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
