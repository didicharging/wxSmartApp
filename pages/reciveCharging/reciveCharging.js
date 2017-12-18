  let app = getApp();
  let PATH = app.globalData.PATH;
  let IMG_PATH = app.globalData.IMG_PATH;

Page({

  /**
   * 页面的初始数据
   */
  data: {    
    items: [
      { name: '10', value: '10' },
      { name: '50', value: '50', checked: 'true' },
      { name: '100', value: '100' },
      { name: '500', value: '500' },
      { name: '1000', value: '1000' },
      { name: '2000', value: '2000' },
    ],
    IMG_PATH: IMG_PATH

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this;

    that.setData({

      inputMoney: "off",
      inputMoneyTip:"手动输入充值金额"
    
    });

    wx.request({
      url: PATH + '/resource-service/device/getDeviceDetail',
      method: 'GET',
      header: {
        'Access-Token': app.globalData.accessToken,
      },
      data: {
        //deviceId: options.deviceId,
        deviceId: "3",
      },
      success: function (data) {
        console.log(data)
        that.setData({ device: data.data.device });

        if (data.data.device.rentalType == 1) {
          that.setData({ rentalType: "小时" });
          that.setData({ rental: parseFloat(data.data.device.rentalH ) });
        }

        if (data.data.device.rentalType == 2) {
          that.setData({ rentalType: "日" });
          that.setData({ rental: parseFloat(data.data.device.rental ) });
        }

        if (data.data.device.rentalType == 3) {
          that.setData({ rentalType: "月" });
          that.setData({ rental: parseFloat(data.data.device.rentalM ) });
        }

        that.setData({

          deviceNo: options.deviceNo,
          payMoney: (parseFloat(that.data.money) + parseFloat(500) + that.data.rental).toFixed(2),
          shareMoney: options.shareMoney,

        });

      }

    });

  },



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



})