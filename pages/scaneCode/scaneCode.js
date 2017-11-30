import { reToMainPage } from "../../libs/router";
let app = getApp();
let PATH = app.globalData.PATH;
let userInfoSync = wx.getStorageSync("userInfo");

Page({


  data: {
    isManager:'false',
    device:null,
  },

  onLoad: function (options) {
    


    console.log(options);
    let that=this;

     that.setData({isManager: options.isManager}); 
    //that.setData({ isManager: "false" });

    wx.request({

      url: PATH + '/resource-service/device/getDeviceDetail',
      method: 'GET',
      header: {
        'Access-Token': app.globalData.accessToken,
      },
      data: {     
        //deviceId: "3",
        deviceId: options.deviceId
      },
      success: function (data) {
        console.log(data)

        that.setData({device: data.data.device}); 

        if (data.data.device.rentalType == 1){
          that.setData({ rentalType: "小时" });
          that.setData({ rental: data.data.device.rentalH });
        } 

        if (data.data.device.rentalType == 2){
          that.setData({ rentalType: "日" });
          that.setData({ rental: data.data.device.rental });
        }
        
        if (data.data.device.rentalType == 3){
          that.setData({ rentalType: "月" });
          that.setData({ rental: data.data.device.rentalM });
        } 

      }

    })

  },

  reciveDevice:function(){
    let that=this;
    
    wx.showModal({
      title: "续租，扣费提示",
      content: "此操作将直接扣除一"+that.data.rentalType+"租金，请在我的设备中确认信息后，在设备即将到期前续租，避免重复租用",
      showCancel: true,
      success: function (res) {
  
        if (res.confirm) {
          console.log('用户点击确定')

          wx.request({
            url: PATH + '/resource-service/device/reciveDevice',
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
              //let device = data.data.device;

              tipModal(data.data.message);
            // reToMainPage();
            }
          })

        } else if (res.cancel) {
          console.log('用户点击取消')
          reToMainPage();
        }





      }
    })

  },
  
  chargeDevice:function(){
    wx.request({
      url: PATH + '/resource-service/device/chargeDevice',
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

       // reToMainPage();
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
        
        // reToMainPage();
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