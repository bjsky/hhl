var wxlogin = require("./wxlogin");

///////////// global ////////////////////////
window.systemInfo = null;
window.wxToken = null;  //code

window.wxlogin = function(cb) {
  wx.checkSession({
    success: function() {
      //check Session success
      console.info('[launch]wx.checkSession, success');
      let loginInfo = wxlogin.getLoginInfo();
      if(loginInfo!= null){
        cb(loginInfo);
      }else{
        wxlogin.login(cb);
      }
    },
    fail: function(){
      // 如果Session过期则重新login
      wxlogin.login(cb);
    }
  });
}

window.createUserInfoButton = function(left,top,width,height,cb){
  var button = wx.createUserInfoButton({
    type: 'text',
    text: '',
    style: {
      left: left,
      top: top,
      width: width,
      height: height,
      // backgroundColor: '#ff0000',
      // color: '#ffffff',
    }
  });
  button.onTap((res) => {
    if(res.userInfo){
      console.log("[launch]用户授权成功:", JSON.stringify(res));
      var userInfo = res.userInfo;
      button.hide();
      cb(userInfo);
    }else{
      console.log("[launch]用户拒绝授权");
      cb(null);
    }
  });
}

window.getUserInfo = function (cb){
  wx.getSetting({
    success(res) {
      if(res.authSetting['scope.userInfo']){
        wx.getUserInfo({
          success:function(res){
            console.log("[launch]获得用户信息:",JSON.stringify(res));
            cb(res.userInfo);
          },
          fail:function(){
            console.log("[launch]获取用户信息失败:",JSON.stringify(res));
            cb(null);
          }
        })
      }else{
        console.log("[launch]获取授权信息失败:",JSON.stringify(res));
        cb(null);
      }
    }
  });
}

wx.onLaunch()
{
  var opt = wx.getLaunchOptionsSync();
  
  window.systemInfo = wx.getSystemInfoSync();
  console.log("[launch]取得设备信息:" + JSON.stringify(window.systemInfo));
}