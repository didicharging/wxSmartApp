import { reToMainPage } from "../../libs/router";
let app = getApp();
let PATH = app.globalData.PATH;



let IMG_PATH = app.globalData.IMG_PATH;

let userInfoSync = wx.getStorageSync("userInfo");

Page({


  data: {
    IMG_PATH: IMG_PATH,
    isManager: 'false',
    device: null,
  },

  onLoad: function (options) {



 
  },




})
