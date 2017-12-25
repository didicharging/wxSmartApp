import { goToUser, goToShare, goToMyWallet, goToWalletLog } from "../../libs/router";
import {
  payDebt
} from "../../libs/publiceFn";


let app = getApp();
let userInfoSync = wx.getStorageSync("userInfo");
let PATH = app.globalData.PATH;

let IMG_PATH = app.globalData.IMG_PATH;

Page({
  data: {
    IMG_PATH: IMG_PATH,
    inputMoney: 'off',
    inputFocus: false,
    inputMoneyTip: '手动输入充值金额',
    initMoney: null,
    walletInfo: null,
    items: [
      { name: '1', value: '1' },
      { name: '3', value: '3' },
      { name: '6', value: '6' },
      { name: '9', value: '9' },
      { name: '12', value: '12' },
      { name: '24', value: '24' },
    ],

  },
  onLoad: function (option) {
    let that = this;

    app.getUserInfo(function (userInfo) {
      that.setData({
        userInfo: userInfo
      })
      console.log(userInfo);
    });

    getWalletInfo(that);

  },
  examine: function () {
    wx.navigateTo({
      url: '../Sharing/Sharing'
    })
  },
  serve: function () {
    wx.navigateTo({
      url: '../equipment/equipment'
    })
  },

  bindInputBlur: function (e) {
    this.setData({
      choosePay: e.detail.value
    });
  },
  // 路由
  goToWalletLog: function () {
    goToWalletLog();
  }
})
function getWalletInfo(that) {

  wx.request({
    url: PATH + '/resource-service/wallet/getWalletInfoByUserId',
    method: 'get',
    header: {
      'Access-Token': app.globalData.accessToken,
    },
    data: {
      userId: app.globalData.userId
    },
    //post success
    success: function (res) {
      console.log(res)
      if (res.data.status == 200) {
        that.setData({
          walletInfo: res.data.wallet,
          deviceCount: res.data.deviceCount
        });

      }
    }
  })

}

function pay(money, that) {
  wx.request({
    url: PATH + '/resource-service/pay/recharge',
    method: 'post',
    header: {
      'Access-Token': app.globalData.accessToken,
    },
    data: {
      userId: app.globalData.userId,
      money: money
    },
    //post success
    success: function (res) {
      console.log(res);
      if (res.statusCode == 200) {
        let payInfo = res.data.payInfo;
        wx.requestPayment({
          'timeStamp': payInfo.timeStamp,
          'nonceStr': payInfo.nonceStr,
          'package': payInfo.payPackage,
          'signType': 'MD5',
          'paySign': payInfo.paySign,
          'success': function (res) {
            console.log(res);
            wx.showToast({
              title: '充值成功',
              icon: 'loading',
              duration: 1500,
              success: function () {
                wx.navigateTo({
                  url: '../payShareSuccess/payShareSuccess'
                })
              }
            });
          },
          'fail': function (res) {
            console.log(res);
          }
        });
      }
    }
  })
}
