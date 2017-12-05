import { goToUser, goToShare, goToMyWallet, goToUserInfo, goToMyDevice } from "../../libs/router";
import moment from "../../libs/moment"; // 引入moment插件
let app = getApp();
let PATH = app.globalData.PATH;

let IMG_PATH = app.globalData.IMG_PATH;
let userInfoSync = wx.getStorageSync("userInfo");


Page({
  data:{
    IMG_PATH: IMG_PATH,
    scrollHeight: "100%",
    logType:"inUser",

  },
  onLoad: function (option) {
    let that = this;
    app.getUserInfo(function (userInfo) {
      that.setData({
        logType: "inUser"
      })
    });

    getInUserList(this);
  
  },

  
  bindgetInUserList: function () {
    getInUserList(this);
  },

  getRentalList: function () {
    let that = this;
    that.setData({ logType: "Rental" });
    wx.request({
      url: PATH + '/resource-service/device/getMyRentalList',
      method: 'get',
      header: {
        'Access-Token': app.globalData.accessToken,
      },
      data: {
        page: 1,
        perPage: 10,
        userId: app.globalData.userId
        //userId: "7d248e45aafb4628aac7c39f56be6b6c"
      },
      // post success
      success: function (res) {
        console.log(res);
        if (res.statusCode == 200 && res.data.status == 200) {
          for (let i = 0; i < res.data.result.data.length; i++) {
            res.data.result.data[i].inDate = moment(res.data.result.data[i].startDate).format('YYYY-MM-DD HH:mm:ss'); // 转化日期格式
            res.data.result.data[i].outDate = moment(res.data.result.data[i].endDate).format('YYYY-MM-DD HH:mm:ss'); // 转化日期格式
          }
          that.setData({
            RentalList: res.data.result.data
          });
        }
      }
    });
    console.log("拉取租用列表正常");
    
  },

  getScaneList: function () {
    let that = this;
    that.setData({ logType: "Scane" });
    console.log("调用正常");
    wx.request({
      url: PATH + '/resource-service/device/getMyScaneList',
      method: 'get',
      header: {
        'Access-Token': app.globalData.accessToken,
      },
      data: {
        page: 1,
        perPage: 10,
        userId: app.globalData.userId
        //userId: "7d248e45aafb4628aac7c39f56be6b6c"
      },
      // post success
      success: function (res) {
        console.log(res);
        if (res.statusCode == 200 && res.data.status == 200) {
          for (let i = 0; i < res.data.result.data.length; i++) {
            res.data.result.data[i].inDate = moment(res.data.result.data[i].startDate).format('YYYY-MM-DD HH:mm:ss'); // 转化日期格式
            res.data.result.data[i].outDate = moment(res.data.result.data[i].endDate).format('YYYY-MM-DD HH:mm:ss'); // 转化日期格式
          }
          that.setData({
            ScaneList: res.data.result.data
          });
        }
      }
    });

  },



  goToDevInfo: function () {

    console.log(id);
    wx.navigateTo({
      url: '../devInfo/devInfo?id=' + id,
    })
  }
})

function getInUserList(e) {

  let that = e;

  that.setData({ logType: "inUser" });

  wx.request({
    url: PATH + '/resource-service/device/getMyDeviceList',
    method: 'get',
    header: {
      'Access-Token': app.globalData.accessToken,
    },
    data: {
      page: 1,
      perPage: 10,
      userId: app.globalData.userId
      //userId: "7d248e45aafb4628aac7c39f56be6b6c"
    },
    // post success
    success: function (res) {
      console.log(res);
      if (res.statusCode == 200 && res.data.status == 200) {
        for (let i = 0; i < res.data.result.data.length; i++) {
          res.data.result.data[i].inDate = moment(res.data.result.data[i].updateTime).format('YYYY-MM-DD HH:mm:ss'); // 转化日期格式
        }
        that.setData({
          devList: res.data.result.data
        });
      }
    }
  });
  console.log("拉取设备列表正常");

}


