//index.js
const app = getApp()

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    array:[],
    name:'',
    ticket:{},
    id:''
  },

  onLoad: function() {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo,
                name:res.userInfo.nickName
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
      type: '1'
    }).get({
      success: res => {
        console.log(res);
       this.setData({
         array:res.data
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

  cutTicket:function(e){
    var that=this;
    this.setData({
      id:e.target.id
    })
    const db = wx.cloud.database({
      env: 'farelock-hswna'
    })
    db.collection('FareLock').where({
      _id:that.data.id
    }).get({
      success: res => {
        console.log("sasas");
        this.setData({
          ticket: res.data[0]
        });
        db.collection('UserTicket').where({
          _openid:that.data.userInfo._openid,
          flightID:that.data.id
        }).get({
          success: res => {
            if(res.data[0]==null){
              db.collection('UserTicket').add({
                // data 字段表示需新增的 JSON 数据
                data: {
                  "flightID": that.data.id,
                  "price": that.data.ticket.price,
                  "num": 0,
                  "status": 0,
                  "name": that.data.name
                },
                success: function (res) {
                  // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
                },
                fail: console.error
              })
            }
            var queryBean = {
              "id": that.data.id,
              "name": that.data.name
            }
            var queryString = JSON.stringify(queryBean);
            console.log(queryString)
            wx.navigateTo({
              url: '/pages/cut/cut?queryBean=' + queryString,
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
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
      }
    })
   
  }

})
