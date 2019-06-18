//app.js
App({
  onLaunch: function (opt) {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }
    console.log(opt);
    if(opt.scene==1044){
      wx.getShareInfo({
        shareTicket: shareTickets[0],
        success: function (res) {
          var encryptedData = res.encryptedData;
          var iv = res.iv;
          console.log(encryptedData);
          console.log(iv);
        }
      })
    }

  }

})
