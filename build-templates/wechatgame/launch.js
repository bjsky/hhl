var wxlogin = require("./wxlogin");

///////////// global ////////////////////////
window.systemInfo = null;
window.wxToken = null;  //code

window.wxlogin = function(cb) {
  wx.checkSession({
    success: function() {
      //check Session success
      console.info('[launch]wx.checkSession, success');
    },
    fail: function(){
      // 如果Session过期则重新login
      wxlogin.login(cb);
    }
  });
}

wx.onLaunch()
{
  var opt = wx.getLaunchOptionsSync();
  
  window.systemInfo = wx.getSystemInfoSync();
  console.log("[launch]取得设备信息:" + JSON.stringify(window.systemInfo));
}