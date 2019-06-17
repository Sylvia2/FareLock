// miniprogram/pages/my/my.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    array:[],
    buyArray:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })

            }
          })
        } else {
          wx.login({
            success: function () {
              wx.getSetting({
                success: res => {
                  if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                      success: res => {
                        this.setData({
                          avatarUrl: res.userInfo.avatarUrl,
                          userInfo: res.userInfo
                        })

                      }
                    })
                  }
                }
              })
            }
          })
        }
        var that = this;
        console.log(that.data);
        const db = wx.cloud.database({
          env: 'farelock-hswna'
        })
        db.collection('UserTicket').where({
          name: that.data.userInfo.nickName
        }).get({
          success: function (a) {
            that.setData({
              array: a.data
            })
          },
          fail: console.error
        })

        db.collection('BuyTicket').where({
          _openid: that.data.userInfo._openid
        }).get({
          success: function (a) {
            that.setData({
              a: a.data
            })
          },
          fail: console.error
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

  },

  //滑动切换
  swipeTab: function (e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });
  },
  
  //点击切换
  clickTab: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  }
})
