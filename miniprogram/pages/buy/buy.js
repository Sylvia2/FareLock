
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    name:'',
    idCard:'',
    phone:'',
    flightID:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var flightId = options.FlightId;
    console.log(flightId);
    this.setData({
      flightID:flightId
    })
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
        }else{
          wx.login({
            success:function(){
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
      }
    }
  )},

buyTicket:function(e){
  var that=this;
  console.log(that.data);
  const db = wx.cloud.database({
    env: 'farelock-hswna'
  })
  db.collection('FareLock').where({
    _id: that.data.flightID
  }).get({
    success: function (a) {
      db.collection('BuyTicket').add({
        // data 字段表示需新增的 JSON 数据
        data: {
          "flightID": that.data.flightID,
          "name": that.data.name,
          "cardID": that.data.idCard,
          "phone": that.data.phone,
          "from":a.data[0].from,
          "to":a.data[0].to,
          "date":a.data[0].date
        },
        success: function (res) {
          // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
          console.log(res._id);
          wx.switchTab({
            url: '/pages/my/my',
          })
        },
        fail: console.error
      })
    },
    fail: console.error
  })
},

  getName:function(e){
    this.setData({
      name:e.detail.value
    })
  },

  getID:function(e){
    this.setData({
      idCard:e.detail.value
    })
  },

  getPhone:function(e){
    this.setData({
      phone:e.detail.value
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