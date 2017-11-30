// pages/login/login.js
let app = getApp();
let PATH = app.globalData.PATH;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showPage: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  bindGoAgreement: function () {
      wx.navigateTo({
          url: '../agreement/agreement',
      })
  },

  bindHome: function () {
    let that = this;
    wx.getSetting({
      success(auth) {
        if (!auth.authSetting['scope.userInfo'] || !auth.authSetting['scope.userLocation']) {
          wx.openSetting({
            success(auth) {
              if (auth.authSetting['scope.userInfo'] && auth.authSetting['scope.userLocation']) {
                wxLogin(that, 'yes');
              }
            }
          })
        } else {
          wxLogin(that, 'yes');
        }
      }
    })
    // wx.reLaunch({
    //   url: '../main/main',
    // })
  },

  onShareAppMessage: function (res) {
    let that = this;
    console.log(that.data.id)
    
    app.globalData.id = that.data.id
    let path_share = '/pages/login/login?id=' + that.data.id + "&invideCode=" + app.globalData.userId + '&type=active';


    return {
      title: that.data.title,
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
            // console.log(res);
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
  onLoad: function (options) {
    console.log(options);
    let that = this;
    getActive(this);
    if (options){
      this.setData({
        sence: options.sence
      });
    } else {
      this.setData({
        sence: null
      });
    }
    if (options.invideCode) {
        that.setData({
            invideCode: options.invideCode
        })
    } else {
        that.setData({
            invideCode: ''
        })
    }
    if (options.type == 'share') {
        that.setData({
            types: options.type,
            id: options.id
        })
    }

    if (options.sence && options.sence != "undefined") {
      let code = options.scene;
      wx.request({
        url: PATH + '/resource-service/device/getDeviceState',
        method: 'GET',
        header: {
          'Access-Token': app.globalData.accessToken,
        },
        data: {
          userId: app.globalData.userId,
          deviceNo: code,
        },
        //post success
        success: function (data) {
          // console.log(data)
          if (data.statusCode == 200 && data.data.status == 200) {
            if (data.data.device) {
              tipModal(data.data.message);
              return;
            }
            app.globalData.payInfo = data.data.payInfo;
            goToReceiveDev(code);
          } else {
            tipModal(data.data.message);
          }
        }
      })
    }
    /////
    wx.getSetting({
      success(auth) {
        if (!auth.authSetting['scope.userInfo'] && !auth.authSetting['scope.userLocation']) {
          console.log(0);
          that.setData({
            showPage: true
          })
          wx.authorize({
            scope: 'scope.userInfo',
            success() {
              console.log(2);
              if (!auth.authSetting['scope.userLocation']) {
                wx.authorize({
                  scope: 'scope.userLocation',
                  success() {
                    console.log(2);
                    wx.getLocation({
                      'type': 'gcj02',
                      success: function (res) {
                        app.globalData.location = res;
                        //不点击按钮直接跳转首页
                        //  wxLogin(that, 'yes');
                        wx.getSetting({
                          success(auth) {
                            if (!auth.authSetting['scope.userInfo'] || !auth.authSetting['scope.userLocation']) {
                              wx.openSetting({
                                success(auth) {
                                  if (auth.authSetting['scope.userInfo'] && auth.authSetting['scope.userLocation']) {
                                    wxLogin(that, 'yes');
                                  }
                                }
                              })
                            } else {
                              wxLogin(that, 'yes');
                            }
                          }
                        })
                      },
                    });
                  }
                });
              } 
            }
          });
        } else {
          wx.getLocation({
            'type': 'gcj02',
            success: function (res) {
              app.globalData.location = res;
              wxLogin(that, 'no');
            },
          });
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  goToMain: function () {
    let that = this;
    wx.getSetting({
      success(auth) {
        if (!auth.authSetting['scope.userInfo'] || !auth.authSetting['scope.userLocation']) {
          wx.openSetting({
            success(auth) {
              if (auth.authSetting['scope.userInfo'] && auth.authSetting['scope.userLocation']) {
                wxLogin(that, 'yes');
              }
            }
          })
        } else {
          wxLogin(that, 'yes');
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },
})

function getSet(that) {
  wx.getSetting({
    success(auth) {
      if (!auth.authSetting['scope.userInfo']) {
        wx.authorize({
          scope: 'scope.userInfo',
          success() {
      
          }
        })
      } else {
        console.log("ok");
        wxLogin(that)
      }
    }
  })
}

function wxLogin(that, newUser) {
  
  wx.showLoading({
    title: '加载中',
  })
  wx.login({
    success: function (res1) {
      if (res1.code) {
        wx.getUserInfo({
          success: function (res) {
            console.log(res);
            app.globalData.userInfo = res.userInfo
            // typeof cb == "function" && cb(that.globalData.userInfo)
            wx.request({
                url: PATH + '/gateway/onMiniProgramLogin',
              method: 'post',
              data: {
                code: res1.code,
                userInfo: res.userInfo,
                rawData: res.rawData,
                signature: res.signature,
                invideCode: that.data.invideCode
              },
              //post success
              success: function (res2) {
                // console.log(res2);
                if (res2 && res2.statusCode == 200) {
                  wx.hideLoading();
                  app.globalData.accessToken = res2.data.result.accessToken;
                  app.globalData.userId = res2.data.result.data.id;
                  if (that.data.types == 'share') {
                      wx.redirectTo({
                          url: '../shareDetail/shareDetail?id=' + that.data.id + '&type=' + that.data.types,
                      })
                      return
                  } 

                  
                  wx.redirectTo({
                    // url: '../main/main?sence=' + that.data.sence
                    url: '../main/main?newUser=' + newUser
                  })
                } else {
                  wx.hideLoading();
                  wx.showLoading({
                    title: '获取用户登录态失败！' + res.errMsg,
                    duration: 2000
                  })
                }
              }
            })
          }
        })
      } else {
        wx.hideLoading();
        console.log('获取用户登录态失败！' + res.errMsg)
        wx.showLoading({
          title: '获取用户登录态失败！' + res.errMsg,
          duration: 2000
        })
      }
    }
  })
}
function getActive(that) {
  wx.request({
    url: PATH + "/resource-service/share/getActive",
    header: {
      'Access-Token': app.globalData.accessToken,
    },
    method: "GET",
    data: {
      id: that.data.id
    },
    success: function (res) {
      console.log(res);
      if (res.statusCode == 200 && res.data.status == 200) {
        that.setData({
          activeImg: res.data.url
        });
      }
    }
  });
}