import { goToUser, goToShare, goToMyWallet, goToUserInfo, goToMyDevice } from "../../libs/router";
import moment from "../../libs/moment"; // 引入moment插件
let app = getApp();
let PATH = app.globalData.PATH;

let IMG_PATH = app.globalData.IMG_PATH;
let userInfoSync = wx.getStorageSync("userInfo");


Page({

  data: {
    IMG_PATH: IMG_PATH,
    scrollHeight: "100%",

  },

  onLoad: function (option) {
    let that = this;
    getInUserList(that);

  },



  bindgetInUserList: function () {
    getInUserList(this);
  },

  goToDevInfo: function (e) {
    
   
    console.log(e.currentTarget.dataset.id);
    let station = e.currentTarget.dataset.id;
  
    

    wx.openLocation({
      latitude: station.latitude,
      longitude:station.longitude,
      scale: 10, // 缩放比例 
      name: station.name,
      address: station.address
    });
    


  }
})

function getInUserList(e) {
  let local = app.globalData.location;
  let that = e;

  wx.request({
    url: PATH + '/resource-service/map/nearbyStation',
    method: 'get',
    header: {
      'Access-Token': app.globalData.accessToken,
    },
    data: {
      userId: app.globalData.userId,
      longitude: local.longitude,
      latitude: local.latitude

    },

    success: function (res) {
      console.log(res);
      console.log("查找成功");
      if (res.statusCode == 200 && res.data.status == 200) {
        that.setData({
          stations: res.data.list
        });
      }

    }
  });


}


