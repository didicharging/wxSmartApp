import { goToUser, goToShare, goToMyWallet, goToWalletLog } from "../../libs/router";
import {
  payDebt
} from "../../libs/publiceFn";




let app = getApp();
let userInfoSync = wx.getStorageSync("userInfo");
let PATH = app.globalData.PATH;
Page({
  data:{
    inputMoney: 'off',
    inputFocus: false,
    inputMoneyTip: '手动输入充值金额',
    initMoney: null,
    walletInfo:null
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
  // 提现
  bindWithdrawals: function () {
      let that = this;
      if (that.data.walletInfo.amount < 100) {
            wx.showModal({
                title: '当前无法提现',
                content: '嘀嘀币不足100无法提现',
                showCancel: false,
                confirmText: "知道了"
            })
      } else {
          wx.showModal({
              title: '确认申请提现',
              content: '嘀嘀币是虚拟货币，须经后台审核，而且一次性取完，最迟一周回复',
              success: function (res) {
                  if (res.confirm) {
                        console.log("tixian")
                        wx.request({
                          url: PATH + '/resource-service/wallet/amountToCashApply',
                            method: 'GET',
                            header: {
                                'Access-Token': app.globalData.accessToken,
                            },
                            data: {
                                userId: app.globalData.userId
                        
                            },
                            success: function (res) {
                                console.log(res);
                                if (res.statusCode == 200) {
                                    wx.showToast({
                                        title: '申请成功',
                                        icon: "success",
                                        duration: 2500,
                                        success: function() {
                                            setTimeout(function () {
                                                getWalletInfo(that);
                                            }, 2500)
                                        }

                                    })
                                }
                            }
                        })
                  }
              }
          })
      }
  },
  // 退共享金
  bindRefundMoney: function () {
    let that = this;
    
    console.log(that.data.walletInfo);

    if (that.data.walletInfo.shareAmount <= 0) {
      wx.showModal({
        title: '退共享金失败',
        content: '您的共享金为0',
        success: function (res) {
          return;
        }
      })
      return;
    };

     if (that.data.walletInfo.canReturnShare==0){
         console.log("aaaa ");
          wx.showModal({
          title: '退共享金失败',
          content: '请归还设备后重试！！！',           
          success: function (res) {
             return;
          }
        });
        return;
     };

    wx.showModal({
      title: '退还共享金',
      content: '您的享金共有： ' + that.data.walletInfo.shareAmount + " 元，现领取设备： " + that.data.deviceCount + "个,可退共享金共" +                    that.data.walletInfo.canReturnShare+"元",

      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: PATH + '/resource-service/wallet/refundShareMoney',
            method: 'GET',
            header: {
              'Access-Token': app.globalData.accessToken,
            },
            data: {
              userId: app.globalData.userId
            },
            //post success
            success: function (res) {
              console.log(res)
              if (res.statusCode == 200) {
                
                if (res.statusCode == 200 && res.data.status == 211) {
                  console.log("有欠款");


                  wx.showModal({
                    title: '提示',

                    content: '您有未支付订单共计：' + res.data.money + "元，详情请在我的钱包查看消费日志",
                    showCancel: false,
                    confirmText: "开始支付",
                    success: function (res) {
                      payDebt(app.globalData.userId);

                    }
                  });
                  return;
                }

                if (res.statusCode == 200 && res.data.status == 200){
                wx.showToast({
                  title: '共享金退还成功',
                  icon: 'loading',
                  duration: 1500,
                  success: function () {
                    setTimeout(function () {
                      getWalletInfo(that);
                    },1500);
                  }
                });

                }

              } else {
                wx.showToast({
                  title: res.data.message,
                  icon: 'loading',
                  duration: 1500
                });
              }

                
              // wx.showToast({
              //   title: "你有未完成的设备使用订单",
              //   icon: 'loading',
              //   duration: 2500,
              //   success: function () {
              //     setTimeout(function () {
              //       goToPayUseFee();
              //     }, 2500);
              //   }
              // });



            }
          });
        } else if (res.cancel) {
          return;
        }
      }
    });    
  },


  bindChoosePay:function (e) {
    console.log(e);
    this.setData({
      choosePay: e.currentTarget.dataset.money
    });
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
function getWalletInfo (that) {
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
                setTimeout(function () {
                  getWalletInfo(that);
                }, 1500);
                yinyue()
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




function yinyue() {
  wx.playBackgroundAudio({
    dataUrl: 'http://didicharging-v2.oss-cn-beijing.aliyuncs.com/didi.wav',


  })
}