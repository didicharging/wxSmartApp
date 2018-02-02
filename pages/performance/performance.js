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
    that.setData({
      status: "user"
    });
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
    if (that.data.status == 'met') {
      metode(this);
    }

    that.setData({
      _num: e.target.dataset.num
    })


  },


  bindgetInUserList: function () {
    getInUserList(this);
  },

  // goToDevInfo: function (e) {

  //   let id = e.currentTarget.dataset.id;
  //   console.log(id);
  //   wx.navigateTo({
  //     url: '../devInfo/devInfo?id=' + id,
  //   })

  // }
})

function getInUserList(e) {

  let that = e;

  wx.request({
    url: PATH + '/resource-service/pay/getDayOrder',
    method: 'get',
    header: {
      'Access-Token': app.globalData.accessToken,
    },

    data: {

    },

    success: function (res) {
      console.log(res);
        that.setData({
          devList: res.data.result
        });
      }


  });

  console.log("拉取设备列表正常");

}

function getInvestList(e) {

  let that = e;

  wx.request({
    url: PATH + '/resource-service/pay/getWeekOrder',
    method: 'get',
    header: {
      'Access-Token': app.globalData.accessToken,
    },

    data: {
    },

    success: function (res) {
        that.setData({
          devList: res.data.result
        });
      }

  });

}
function metode(e) {
  let that = e;
  wx.request({
    url: PATH + '/resource-service/pay/getMonthOrder',
    method: 'get',
    header: {
      'Access-Token': app.globalData.accessToken,
    },

    data: {
    },

    success: function (res) {
      that.setData({
        devList: res.data.list
      });
    }
  });
}


