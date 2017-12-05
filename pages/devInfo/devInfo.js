// pages/devInfo/devInfo.js
let app = getApp();
let PATH = app.globalData.PATH;

let IMG_PATH = app.globalData.IMG_PATH;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    IMG_PATH: IMG_PATH,
    imgUrls: [

    ],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let id = options.id;

    wx.request({
      url: PATH + '/resource-service/share/getBanner',
      method: 'get',
      header: {
        'Access-Token': app.globalData.accessToken,
      },
      success: function (res) {
        console.log(res);
        if (res.statusCode == 200 && res.data.status == 200) {
          that.setData({
            imgUrls: res.data.list
          });
        }
      }
    });


    wx.request({
      url: PATH + "/resource-service/device/getDeviceDetail",
      header: {
        'Access-Token': app.globalData.accessToken,
      },
      method: "GET",
      data: {
        deviceId: id
      },
      success: function (res) {
        console.log(res);
        if (res.data.status == 200) {
          that.setData({
            devInfo: res.data.device,
            userList: res.data.pastUserList
          });
        }
      }
    });
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
  goToShareHistory: function (e) {
    let id = e.currentTarget.dataset.id;
    wx.redirectTo({
      url: '../shareHistory/shareHistory?id=' + id
    });
  }
})