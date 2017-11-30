// pages/map/map.js
import { reToMainPage, goToUserInfo, goToReceiveDev, goToUser } from "../../libs/router";

import {
  scansaoma, gofujin, gofenxaing
} from "../../libs/saoma";

let app = getApp();
let PATH = app.globalData.PATH;
Page({
  /**
   * 页面的初始数据
   */
  data: {

                      
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let local = app.globalData.location;
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
        iconPath: '/images/sos.png',
        position: {
          left: that.data.windowWeight / 2-50,
          // top: 300 - 50,
          top: that.data.windowHeight-200,
          width: 100,
          height: 100
        },
        clickable: true
      }
      // {
      //   id: 2,
      //   iconPath: '/images/sos.png',
      //   position: {
      //     left: that.data.windowWeight / 2 + 80,
      //     // top: 300 - 50,
      //     top: that.data.windowHeight - 170,
      //     width: 70,
      //     height: 70
      //   },
      //   clickable: true
      // },
      // {
      //   id: 3,
      //   iconPath: '/images/sos.png',
      //   position: {
      //     left: that.data.windowWeight / 2 - 150,
      //     top: that.data.windowHeight - 170,
      //     width: 70,
      //     height: 70
      //   },
      //   clickable: true
      // },
  


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
    // goToUser();
    wx.reLaunch({
      url: '/pages/user/user'
    })
  },
  // 分享
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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.mapCtx = wx.createMapContext('myMap'); 
  },
 
 


  callouttap(e) {
    console.log(e.markerId)
    console.log(this.data.mapMarks)
    if (e.markerId ==10){
      wx.makePhoneCall({
        phoneNumber: '15088726293' //仅为示例，并非真实的电话号码
      })
    }
    if (e.markerId == 6) {
      wx.makePhoneCall({
        phoneNumber: '13693541067' //仅为示例，并非真实的电话号码
      })
    }
     if (e.markerId == 3) {
      wx.makePhoneCall({
        phoneNumber: '13522408052' //仅为示例，并非真实的电话号码
      })
    } 
    if (e.markerId == 7) {
      wx.makePhoneCall({
        phoneNumber: '15010571129' //仅为示例，并非真实的电话号码
      })
    }
    if (e.markerId == 9) {
      wx.makePhoneCall({
        phoneNumber: '18101034645' //仅为示例，并非真实的电话号码
      })
    }
    if (e.markerId == 5) {
      wx.makePhoneCall({
        phoneNumber: '13241801273' //仅为示例，并非真实的电话号码
      })
    }
    if (e.markerId == 1) {
      wx.makePhoneCall({
        phoneNumber: '18618357887' //仅为示例，并非真实的电话号码
      })
    }
  },
  
  controltap:function(e){

    wx.makePhoneCall({
      phoneNumber: '4001851018'
    })

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

        console.log(stationlist);
        for (let i = 0; i < stationlist.length; i++) {
          let mark = {
            iconPath: "/images/station.png",
            id: stationlist[i].id,
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