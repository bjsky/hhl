var wxlogin = require("./wxlogin");

///////////// global ////////////////////////
window.systemInfo = null;
window.wxToken = null;  //code
window.isPlayVideoAd = false;

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
    button.hide();
    if(res.userInfo){
      console.log("[launch]用户授权成功:", JSON.stringify(res));
      var userInfo = res.userInfo;
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
window.createGameClubButton = function (){
  wx.createGameClubButton({
    icon: 'green',
  style: {
    left: 10,
    top: 120,
    width: 50,
    height: 50
  }
  })
}

window.shareAppMessage = function(title,image,query){
  wx.shareAppMessage({
    title: title,
    imageUrl: image,
    query: query,
  })
}
// 视频广告
window.showVideoAd = function (cb, VideoAd_type) {
  if (wx.createRewardedVideoAd == undefined) {
    return false;
  }

  if (window.isPlayVideoAd == false) {
    window.isPlayVideoAd = true;
    if (VideoAd_type == 2) {
      // 看视频送金币
      window.rewardedVideoAd = wx.createRewardedVideoAd({
        adUnitId: 'adunit-5dffa8a2d343c81c'
      })
    } else if (VideoAd_type == 3){
      // 看视频送灵石
      window.rewardedVideoAd = wx.createRewardedVideoAd({
        adUnitId: 'adunit-c610ec0fe1e6b502'
      })
    }

    window.rewardedVideoAd.onLoad(() => {
      console.log('激励视频 广告加载成功');
      window.rewardedVideoAd.offLoad();

    })
    window.rewardedVideoAd.onError(err => {
      console.log(err, "激励视频 广告加载失败");
      window.rewardedVideoAd.offError();
      cb(2);

    })


    window.rewardedVideoAd.onClose(res => {
      window.isPlayVideoAd = false;

      let retCode = 0;
      if (res && res.isEnded || res === undefined) {
        // 正常播放结束，可以下发游戏奖励
        if (cb != null) {
          console.log("发奖励，", res);
          cb(1);
        }
        retCode = 0;
      }
      else {
        // 播放中途退出，不下发游戏奖励
        retCode = 1;
        cb(0);
      }

      window.rewardedVideoAd.offClose();

    })
    window.rewardedVideoAd.load()
      .then(() => window.rewardedVideoAd.show())
      .catch(err => {
        console.log(err.errMsg)
        window.isPlayVideoAd = false;
      })

  }
}

let shareCallbackFunc = function(){
  return {
    title:"快来玩大家都在玩的洪荒故事小游戏！",
    imageUrl:"https://www.xh52.top/resShare/share_1.jpg",
    query:"",
  }
}
let onHideFunc = function(res){
  console.log("OnHide Info:" + JSON.stringify(res));
  
  window["wxOnHide"](res);
}


let onshowFunc = function(res){
  console.log("OnShow Info:" + JSON.stringify(res));
  
  window["wxOnShow"](res);
}

let checkUpdate = function() {
  console.log("[log] will check udpate ")
  if (typeof wx.getUpdateManager === 'function') {
    const updateManager = wx.getUpdateManager()
  
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log("[log] is udpate : " + res.hasUpdate)
    })
  
    updateManager.onUpdateReady(function () {
      // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
      wx.showModal({
        title: '更新提示',
        content: '又一个棒棒哒新版本，去瞅瞅~',
        success: function (res) {
          if (res.confirm) {
          // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
          updateManager.applyUpdate()
          }
        }
      })        
    })
  
    updateManager.onUpdateFailed(function () {
      // 新的版本下载失败
    })
  }
  
}

wx.onLaunch()
{
  var opt = wx.getLaunchOptionsSync();
  
  window.systemInfo = wx.getSystemInfoSync();
  console.log("[launch]取得设备信息:" + JSON.stringify(window.systemInfo));

  // 设置右上角显示转发
  wx.showShareMenu();
  // 注册用户点击右上角转发侦听
  wx.onShareAppMessage(shareCallbackFunc)
  //显示饮茶
  wx.onHide(onHideFunc);
  wx.onShow(onshowFunc)

  checkUpdate();
}