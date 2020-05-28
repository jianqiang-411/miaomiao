//app.js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error("未开启云能力");
    } else {
      wx.cloud.init({
        env: "miaomiao-dev-id",
        traceUser: true
      });
    }

    this.userInfo = {},
    this.userMessage = []
    
  }
})
