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
      { name: '10', value: '10' },
      { name: '50', value: '50' },
      { name: '100', value: '100' },
      { name: '500', value: '500' },
      { name: '1000', value: '1000' },
      { name: '2000', value: '2000' },
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
  },

  radioChange: function (e) {

    let that = this;
    console.log('选择要充值的金额为：', e.detail.value);
    this.setData({ choosePay: e.detail.value });
  },

  // 选择手动输入金额
  bindInputMoney: function () {
    if (this.data.inputMoney == 'off') {
      this.setData({
        inputMoney: 'on',
        inputFocus: true,
        inputMoneyTip: '选择固定金额'
      });
    } else {
      this.setData({
        inputMoney: 'off',
        inputFocus: false,
        inputMoneyTip: '手动输入充值金额',
        initMoney: null,
        choosePay: null
      });
    }
  },

  bindInputBlur: function (e) {
    this.setData({
      choosePay: e.detail.value
    });
  },
  bindPayMoney: function () {
    let that = this;
    let payMoney = this.data.choosePay;
    if (!payMoney || payMoney == null) {
      wx.showToast({
        title: '请选择或输入充值金额',
        icon: 'loading',
        duration: 1500
      });
      return;
    }
    pay(this.data.choosePay, that);
    console.log(this.data.choosePay);
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
