var util = require("./util");

let login = function(gameCallback) {
    clearLoginInfo();
    wx.login({
        success: function (res) {
        if (res.code) {
            window.wxToken = res.code;
            console.log("[wxlogin]获得token信息，"+res.code);
            let reqData = {
            code: res.code,
            // platform: window.client_login_platform,
            // deviceid: window.client_deviceid,
            // version: window.client_version,
            };
            //发起网络请求
            // util.request('login', reqData, (res) => {
            //         gameCallback(res);
            //     }, (err) => {
            //         loginFail('登录失败，请稍后再试！', () => {
            //             login(gameCallback);
            //         });
            //         console.log("[wxlogin]登陆服请求失败:");
            //     }
            // )
            //没有账号服，直接登录游戏服
            saveLoginInfo(res);
            gameCallback(res);
        } else {
            loginFail('登录失败，请稍后再试！', () => {
                login(gameCallback);
            });
            console.log('[wxlogin]登录失败！' + res.errMsg)
        }
        },
        fail: function(err) {
        loginFail(err.errMsg, () => {
            login(gameCallback);
        });
        }
    });
}

let loginFail = function (msg, success) {
    wx.showModal({
      title: '提示',
      content: msg,
      showCancel: false,
      success: success
    })
}

let getLoginInfo = function () {
    let data = localStorage.getItem('login_info');
    if (data == null) {
      return null;
    }
    if (!data.length) {
      return null;
    }
    try {
      data = JSON.parse(data);
    } catch (e) {
    }
    if (data == null || data.token == null || data.uid == null || data.serverid == null) {
      return null;
    }
    if (data.token == '' || data.uid == '' || data.serverid == '') {
      return null;
    }
    return data;
}

let clearLoginInfo = function() {
    localStorage.setItem('login_info', '');
}

let saveLoginInfo =function(data) {
    let s = JSON.stringify(data);
    localStorage.setItem('login_info', s);
}

module.exports = {
    login:login,
    getLoginInfo:getLoginInfo,
    clearLoginInfo:clearLoginInfo,
    saveLoginInfo:saveLoginInfo
}