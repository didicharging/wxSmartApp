// pages/map/map.js
import { reToMainPage, goToUserInfo, goToReceiveDev, goToUser } from "../../libs/router";

import {
  scansaoma, gofujin, gofenxaing
} from "../../libs/saoma";

let app = getApp();
let PATH = app.globalData.PATH;
let IMG_PATH = app.globalData.IMG_PATH;
Page({
  /**
   * 页面的初始数据
   */
  data: {
      stations:null,
      IMG_PATH: IMG_PATH
                       
  }, 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    let that = this;
    let local = app.globalData.location;

    //that.setData

    // that.setData({
    //   IMG_PATH: IMG_PATH
    // });




    //获取用户信息
    wx.getSystemInfo({
      success: (res) => {
     
        that.setData({
          windowHeight: res.windowHeight,
          windowWeight: res.windowWidth,
          // longitude: local.longitude,
          // latitude: local.latitude,

          longitude: 116.407526, 
          latitude: 39.90403,      
        })
      }
    });
        
    let mapControls = [
      {
        id: 1,
        iconPath: IMG_PATH+'/scanCode.png',
        position: {
          left: that.data.windowWeight / 2-50,
          top: that.data.windowHeight-200,
          width: 100,
          height: 100
        },
        clickable: true
      },
       {
        id: 2,
        iconPath: IMG_PATH +'/sos.png',
        position: {
          left: that.data.windowWeight / 2 + 70,       
          top: that.data.windowHeight - 160,
          width: 50,
          height: 50
        },
        clickable: true
      },
      {
        id: 3,
        iconPath: IMG_PATH +'/share.png',
        position: {
          left: that.data.windowWeight / 2 - 120,
          top: that.data.windowHeight - 160,
          width: 50,
          height: 50
        },
        clickable: true
      },
  
    ];
    
    that.setData({
      controls: mapControls,  
    })

    getLocalPoint(that); 
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
 
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.mapCtx = wx.createMapContext('myMap'); 
  },
 
  callouttap(e) {
       console.log(e.markerId),
      console.log(this.data.stations[1].phone),
         wx.makePhoneCall({
         phoneNumber: this.data.stations[1].phone
         });
    },

  
  controltap:function(e){

   //扫码用电    
    if(e.controlId==1){
     
      scansaoma(app.globalData.userId, goToReceiveDev, PATH)
    }
    
    //呼叫救援
    if (e.controlId == 2) {
      console.log("yui");
      wx.showModal({
        title: '提示',
        content: '您将播打4001851018,由我们的客服人员手动为您下单',
        success: function (res) {
          if (res.confirm) {
            wx.makePhoneCall({
          phoneNumber: '4001851018'
          });

          } else if (res.cancel) {
           
          }
        }
      })
    }

    //分享设备
    if (e.controlId == 3) {
      console.log("nfipuopap");
      wx.switchTab({
          url: '../share/share',
        });
    }
  
  },
 
  // 去通知
  goToNotice: function () {
    wx.navigateTo({
      url: '../user/notice/notice?id=' + app.globalData.userId
    });
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




  // 坐标点改变
  bindChange: function (e) {
    let that = this;
    if (e.type == 'end') {
      // console.log(e);
      that.mapCtx.getCenterLocation({
        success: function (res) {
   
          that.setData({
            longitude: res.longitude,
            latitude: res.latitude
          });
          getLocalPoint(that);
        }
      })
    }
  }
})


function getLocalPoint(that) {
  wx.request({
    url: PATH + "/resource-service/map/getPointList",
    header: {
       'Access-Token': app.globalData.accessToken,
    },
    method: "GET",
    data: {
      longitude: that.data.longitude,
      latitude: that.data.latitude,
      distance: 500
    },
    success: function (res) {
      // console.log(res);
      if (res.data.status == 200) {
        let markArr = [];
        // 分享定位
        let sharelist = res.data.result.sharelist;
        // console.log(sharelist);
        for (let i = 0; i < sharelist.length; i++) {
          // 男女图标区分
          let iconPath = sharelist[i].sex == 1 ? "/images/man.png" : '/images/wuman.png';
          let mark = {
            iconPath: iconPath,
            id: sharelist[i].shareId,
            latitude: sharelist[i].latitude,
            longitude: sharelist[i].longitude,
            width:40,
            height:40,
            pointType: 'user',            
          };

          markArr.push(mark);
        }

        // 驿站定位
        let stationlist = res.data.result.stationlist;
        
        that.setData({
          stations: stationlist,

        })

        console.log(stationlist);
        for (let i = 0; i < stationlist.length; i++) {
          let mark = {
            iconPath: "/images/station.png",
            id: i,
            latitude: stationlist[i].latitude,
            longitude: stationlist[i].longitude,
            width:40,
            height:40,
            pointType: 'station',
            callout: {
              content: ' 站点：' + stationlist[i].name + '\r'+'充电侠：'+stationlist[i].user+'\r'+'电话：'+stationlist[i].phone +'\r'+'地址：'+ stationlist[i].address,
              borderRadius: 5,
              padding:10,
              bgColor: '#ffd843',
              display: 'BYCLICK'
            },
            
          };
          markArr.push(mark);

        }
        console.log(markArr)
        that.setData({
          mapMarks: markArr,
         
        })
        
      }
    }
  });

  

}