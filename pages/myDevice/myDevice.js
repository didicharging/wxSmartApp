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

  },

  onLoad: function (option) {
    let that = this;
    getInUserList(that);
  
  },


  bindStatus: function (e) {
    let that = this;
    let status = e.currentTarget.dataset.status;
    // console.log(status)
    that.setData({
      status: status
    });
    // console.log(status)
    if (that.data.status == 'user') {
      getInUserList(this);
    }

    if (that.data.status == 'invest') {
      getInvestList(this);
    }
    if (that.data.status == 'met'){
      metode(this);
    }
    



  },


  bindgetInUserList: function () {
    getInUserList(this);
  },

  goToDevInfo: function (e) {

    let id = e.currentTarget.dataset.id;
    console.log(id);
    wx.navigateTo({
      url: '../devInfo/devInfo?id=' + id,
    })
    
  }
})

function getInUserList(e) {

  let that = e;

  wx.request({
    url: PATH + '/resource-service/device/getMyDeviceList',
    method: 'get',
    header: {
      'Access-Token': app.globalData.accessToken,
    },
    
    data: {

      userId: app.globalData.userId
 
    },

    success: function (res) {
      console.log(res);
      if (res.statusCode == 200 && res.data.status == 200) {
        for (let i = 0; i < res.data.result.length; i++) {
          res.data.result[i].inDate = moment(res.data.result[i].updateTime).format('YYYY-MM-DD HH:mm:ss'); // 转化日期格式
        }
        that.setData({
          devList: res.data.result
        });
      }




    }
  });

  console.log("拉取设备列表正常");

}

function getInvestList(e) {

  let that = e;

  wx.request({
    url: PATH + '/resource-service/device/getInvestList',
    method: 'get',
    header: {
      'Access-Token': app.globalData.accessToken,
    },

    data: {
      userId: app.globalData.userId
    },

    success: function (res) {
      console.log(res);
      if (res.statusCode == 200 && res.data.status == 200) {
        that.setData({
          devList: res.data.result
        });
      }
      
    }
  });

  console.log("拉取设备列表正常");

}
function metode(e){
  let that =e;
  wx.request({
    url: PATH + '/resource-service/pay/getMyOrders',
    method: 'get',
    header: {
      'Access-Token': app.globalData.accessToken,
    },

    data: {
      userId: app.globalData.userId
    },

    success: function (res) {
      console.log(res.data.list);
      for (let i = 0; i < res.data.list.length; i++) {
        res.data.list[i].inDate = moment(res.data.list[i].updateTime).format('YYYY-MM-DD HH:mm:ss'); // 转化日期格式
      }
      that.setData({
        devList: res.data.list
      });
    }
  });
}


