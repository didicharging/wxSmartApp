import {
  goToUser, goToShare, goToNearbyDev, goToMapNav, goToReceiveDev, goToScaneCode,
  goToUserInfo, goToPayUseFee, goToShareDetail
} from "router";

import {
  payDebt
} from "publiceFn";

//扫码
export function scansaoma(user, goToReceiveDev, PATH){
 
  wx.scanCode({
    onlyFromCamera: true,
    success: function (res) {
      // 成功
      console.log(res);
      if (res.errMsg == 'scanCode:ok') {
        let name, value;
        let str = res.path;
        let num = str.indexOf("=");
        if (num != -1) {
          let code = str.substr(str.indexOf("=") + 1);
           
          getDeviceState(user, code, PATH);

        }
      }
    },
    fail: function (res) {
      // 失败
      // console.log(res);
    }
  });
}

export function getDeviceState(user,code,PATH){
  
  wx.request({

    url: PATH + '/resource-service/device/getDeviceState',
    method: 'GET',
    data: {
      userId: user,
      deviceNo: code,

    },

    success: function (data) {
      console.log(data);

      let device = data.data.device;

      // 余额不足 请求充值余额
      if (data.statusCode == 200 && data.data.status == 211) {
        console.log("有欠款");

        wx.redirectTo({
          url: '../reciveCharging/reciveCharging?deviceId=' + data.data.device.id,
        });

        return;
      }

      // 有欠款发生
      if (data.statusCode == 200 && data.data.status == 212) {
        console.log("有欠款");

        wx.showModal({
          title: '欠款提示',

          content:  data.data.message,
          showCancel: false,
          confirmText: "开始支付",
          success: function (res) {
            payDebt(user);

          }
        });

        return;
      }


      // 押金不足
      if (data.statusCode == 200 && data.data.status == 213) {
        var money = data.data.money;
        console.log("押金不足");


        wx.redirectTo({
          url: '../payShare/payShare?deviceId=' + data.data.device.id+'&money='+data.data.money,
        })

      }

      //状态异常 直接弹窗提示
      if (data.statusCode == 200 && data.data.status == 210) {

        wx.showModal({
          title: '提示',
          content: data.data.message,
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              return;
            }
          }
        })

      }

      //状态正常 跳转到领取成功页面
      if (data.statusCode == 200 && data.data.status == 200) {
        // goToScaneCode(data.data.isManager, device.id, device.deviceNo);

        wx.redirectTo({
          url: '../reciveSuccess/reciveSuccess',
        })

      }

      //开始拉取功能列表
      if (data.statusCode == 200 && data.data.status == 201) {

        console.log("拉取功能列表");
        wx.navigateTo({
          url: '../scaneCode/scaneCode?deviceId=' + data.data.device.id,
        })

      }

    }
  })
}



export function gofujin(location) {
  wx.getSetting({
    success(auth) {
      if (!auth.authSetting['scope.userLocation'] || !auth.authSetting['scope.userLocation']) {
        // console.log(0);
        wx.openSetting({
          success(auth) {
            if (auth.authSetting['scope.userLocation'] && auth.authSetting['scope.userLocation']) {
              if (!location || location == 'undefined') {
                wx.showModal({
                  title: '无法获取您的地理位置',
                  content: '请对微信进行地理位置授权',
                  showCancel: false,
                  confirmText: '知道了',
                })
                return;
              }
              wx.navigateTo({
                url: '/pages/map/map'
              });
            }
          }
        })
      } else {
        if (!location || location == 'undefined') {
          wx.showModal({
            title: '无法获取您的地理位置',
            content: '请对微信进行地理位置授权',
            showCancel: false,
            confirmText: '知道了',
          })
          return;
        }
        // console.log(1);
        wx.navigateTo({
          url: '/pages/map/map'
        });
      }
    }
  })

}

// 分享
export function gofenxaing(){
  let that = this;
  wx.getSetting({
    success(auth) {
      if (!auth.authSetting['scope.userLocation'] || !auth.authSetting['scope.userLocation']) {

        wx.openSetting({
          success(auth) {
            if (auth.authSetting['scope.userLocation'] && auth.authSetting['scope.userLocation']) {
              wx.reLaunch({
                url: '/pages/share/share',
              })
            }
          }
        })
      } else {

        wx.reLaunch({
          url: '/pages/share/share',
        })
      }
    }
  })

}
export function tipModal(tip) {
  wx.showToast({
    title: tip,
    icon: 'loading',
    duration: 3000
  })
}

