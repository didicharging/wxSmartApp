import {
  scansaoma, gofujin, gofenxaing
} from "../../libs/saoma";
import { goToUser, goToShare, goToMyWallet, goToUserInfo, goToMyDevice, goToFollowList, goToFansList, goToPhoneTest, goToReceiveDev } from "../../libs/router";
let app = getApp();
let PATH = app.globalData.PATH;


let IMG_PATH = app.globalData.IMG_PATH;



Page({
  data: {
    IMG_PATH: IMG_PATH
  },
  onReady: function (res) {
    this.videoContext = wx.createVideoContext('myVideo')
  },
  inputValue: '',
  data: {
    src: '',
    danmuList: [
      {
        text: '第 1s 出现的弹幕',
        color: '#ff0000',
        time: 1
      },
      {
        text: '第 3s 出现的弹幕',
        color: '#ff00ff',
        time: 3
      }],
      a:true
  },
  onLoad: function (option) {
    console.log(option)
    this.setData({
      index:Number(option.index)+1
    })
  },
  bindInputBlur: function (e) {
    this.inputValue = e.detail.value
  },
  bindButtonTap: function () {
    var that = this
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: ['front', 'back'],
      success: function (res) {
        that.setData({
          src: res.tempFilePath
        })
      }
    })
  },
  bindSendDanmu: function () {
    this.videoContext.sendDanmu({
      text: this.inputValue,
      color: getRandomColor()
    })
  },
  onShow: function () {
    wx.showShareMenu({
      withShareTicket: true,
      success: function (res) {
        console.log(res);
      },
      complete: function (res) {
        console.log(res);
      }
    });
  },
  //分享
  onShareAppMessage: function (res) {
    let that = this;
    that.setData({
      hide: true
    })
    let path_share;
    // if (res.from === 'button') {
    //   // 来自页面内转发按钮
    //   console.log(res.target)
    //   path_share = '/pages/login/login?type=share&id=' + that.data.id
    // } else {
    //     path_share = '/pages/login/login';
    // }
    path_share = '/pages/yinyue/yinyue?type=share&id=' + that.data.index + "&invideCode=" + app.globalData.userId
    return {
      title: '爱心分享图片，轻松月入百万！',
      path: path_share,
      success: function (res) {
        console.log(res);
        // 转发成功
        wx.getShareInfo({
          shareTicket: res.shareTickets[0],
          success: function (res) {
            console.log(res);
          },
          complete: function (res) {
            console.log(res);

          }
        })
      },
      fail: function (res) {
        // 转发失败
      },
      complete: function () {
        that.setData({
          hide: false
        })
      }
    }
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
    // goToUser();
    wx.reLaunch({
      url: '/pages/user/user'
    })
  },
  // 秀秀
  goToShare: function () {
    let that = this;
    gofenxaing()

  },
  //首页
  homePage: function () {
    wx.reLaunch({
      url: '/pages/main/main',
    })
  },
})