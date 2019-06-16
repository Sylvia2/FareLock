// miniprogram/pages/cut/cut.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ticket:{},
    hasCut:1,
    nickName:'',
    avatarUrl: './user-unlogin.png',
    userInfo:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var bean=JSON.parse(options.queryBean)
    console.log(bean)
    var id=bean.id
    this.setData({
      nickName:bean.name
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo:res.userInfo
              })
            }
          })
        }
      }
    })
    const db = wx.cloud.database({
      env: 'farelock-hswna'
    })
    db.collection('FareLock').where({
      _id: id
    }).get({
      success: res => {
        this.setData({
          ticket: res.data[0]
        });
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
      }
    })

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