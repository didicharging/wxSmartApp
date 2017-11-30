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
          // console.log(code);
          wx.request({
            url: PATH + '/resource-service/device/getDeviceState',
            method: 'GET',
            data: {
              userId: user,
              deviceNo: code,
       
            },
            //post success
            success: function (data) {
              console.log(data)
              let device = data.data.device;

              // 余额不足 请求充值余额
              if (data.statusCode == 200 && data.data.status == 211) {
                console.log("有欠款");
     

                wx.showModal({
                  title: '提示',
   
                  content: '您有未支付订单共计：' + data.data.money+"元，详情请在我的钱包查看消费日志",
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

                // let rental;
                // if (device.rentalType == 1) rental = device.rentalH;
                // if (device.rentalType == 2) rental = device.rental;
                // if (device.rentalType == 3) rental = device.rentalM;

                // console.log(rental);

                goToReceiveDev(money, device.id);

              }
              //状态异常 直接弹窗提示
              if (data.statusCode == 200 && data.data.status == 210) {
                if (data.data.device) {
                  console.log("状态异常");
                  // tipModal(data.data.message);
                  wx.showToast({
                    title: data.data.message,
                    icon: 'loading',
                    duration: 3000
                  })
                  return;
                }
              }
              //状态正常 跳功能选择画面
              if (data.statusCode == 200 && data.data.status == 200) {
                goToScaneCode(data.data.isManager, device.id, device.deviceNo);
              }

              // tipModal(data.data.message);
              wx.showToast({
                title: data.data.message,
                icon: 'loading',
                duration: 3000
              })

            }
          })

        }
      }
    },
    fail: function (res) {
      // 失败
      // console.log(res);
    }
  });
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