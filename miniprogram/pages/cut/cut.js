// miniprogram/pages/cut/cut.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ticket:{},
    hasCut:0,
    nickName:'',
    avatarUrl: './user-unlogin.png',
    userInfo:{},
    id:'',
    process:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
    var that = this
    var bean = JSON.parse(options.queryBean)
    console.log(bean)
    this.setData({
      nickName: bean.name,
      id: bean.id
    })
    const db = wx.cloud.database({
      env: 'farelock-hswna'
    })
    db.collection('FareLock').where({
      _id: that.data.id
    }).get({
      success: res => {
        db.collection('CutRecord').where({
          _openid:that.data.userInfo._openid,
          name:that.data.nickName,
          flightID:that.data.id
        }).get({
          success: res => {
            console.log(res)
            if(res.data[0]!=null){
              this.setData({
                hasCut:1,
              })
            }
          },
          fail: err => {
            wx.showToast({
              icon: 'none',
              title: '查询记录失败'
            })
          }
        })
        this.setData({
          ticket: res.data[0]
        });
        console.log(that.data.ticket)
        db.collection('UserTicket').where({
          name: that.data.nickName,
          flightID: that.data.id
        }).get({
          success: res => {
            if (res.data[0] != null) {
              this.setData({
                process: Math.floor(((that.data.ticket.price - res.data[0].price) / that.data.ticket.price)*100)
              })
              console.log(that.data.process)
            }
          },
          fail: err => {
            wx.showToast({
              icon: 'none',
              title: '查询记录失败'
            })
          }
        })
        
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
      }
    })

  },

cutNow:function(){
  var that=this;
  console.log(that.data.userInfo.nickName);
  //砍了多少钱？
  var price = Math.floor(Math.random()*10 + 10);
  console.log(price);
  const db = wx.cloud.database({
    env: 'farelock-hswna'
  })
  db.collection('CutRecord').add({
    // data 字段表示需新增的 JSON 数据
    data: {
      "amount": price,
      "hasCut":1,
      "name":that.data.nickName,
      "flightID":that.data.id
    },
    success: function (res) {
      // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
      console.log(res);
      //更新用户的参加进度
      var userID;
      var newNum;
      var newPrice;
      var newstatus=0;
      db.collection('UserTicket').where({
        name:that.data.nickName,
        flightID:that.data.id
      }).get({
        success: res => {
          console.log(res.data[0]);
          userID=res.data[0]._id;
          newNum=res.data[0].num+1;
          newPrice=res.data[0].price-price;
          if(newPrice<=9){
            newstatus=1;
          }
          console.log(userID);
          db.collection('UserTicket').doc(userID).update({
            // data 传入需要局部更新的数据
            data: {
              // 表示将 done 字段置为 true
              num: newNum,
              price: newPrice,
              status: newstatus
            },
            success: res=>{
              wx.showToast({
                title: '您已帮助该用户砍价成功', success: res => {
                  console.log('dsds');
                  //用onLoad周期方法重新加载，实现当前页面的刷新
                  wx.switchTab({
                    url: '/pages/index/index',
                  })
                }
              })
            },
            fail: console.error
          })
          

        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '查询记录失败'
          })
        }
      })

    },
    fail: console.error
  })
  wx.redirectTo({
    url: '/pages/index/index',
  })
},

  canjia:function(){
    console.log("dada")
    wx.switchTab({
      url: '/pages/index/index',
    });
  },

  buy:function(){
    wx.navigateTo({
      url: '/pages/buy/buy',
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
    var that=this
    var queryBean = {
      "id": that.data.id,
      "name": that.data.nickName
    }
    var queryString = JSON.stringify(queryBean);
    console.log(queryString)
    return {
      title: '快来帮我砍价拿特价机票呀',
      path: '/pages/cut/cut?queryBean='+queryString,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})