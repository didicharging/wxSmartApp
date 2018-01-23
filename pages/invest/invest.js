

let app = getApp();
let PATH = app.globalData.PATH;

Page({

  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },


  bindInputBlur: function (e) {
    this.setData({
      money: e.detail.value
    });
  },


  pay:function(){
    
    let that =this;
   
    console.log(that.data.money);
   
    wx.request({
      url: PATH + '/resource-service/pay/invest',
      method: 'post',
      header: {
        'Access-Token': app.globalData.accessToken,
      },
    
      //这里的坑在于number 是关键字 所以用numbe
      data: {
        userId: app.globalData.userId,
        numbe: that.data.money
      },

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

 
})