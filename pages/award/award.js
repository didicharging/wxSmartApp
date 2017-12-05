// pages/award/award.js
let app = getApp();
let PATH = app.globalData.PATH;

let IMG_PATH = app.globalData.IMG_PATH;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    IMG_PATH: IMG_PATH,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  formSubmit:function(e){
      console.log(e)
      let value = e.detail.value
      let remarks = value.remarks
      let name = value.name
      let phone = value.phone
      let address = value.address
      if (address == '' || name == '' || phone==''){
        // console.log('内容不能为空')
        wx.showToast({
          title: '内容不能为空',
          icon: 'loading',
          // duration: 1500
        })
      }else{
        wx.request({
          url: PATH + '/resource-service/share/recivePrize',
          data: {
            name :name,
            phone :phone,
            address :address
          },
          method: 'GET',
          success: function(res) {
            if(status==200){
              wx.redirectTo({
                url: '/pages/login/login',

              })
            }
            
          },
         
        })
      }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})