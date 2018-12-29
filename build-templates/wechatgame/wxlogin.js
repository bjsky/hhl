var util = require("./util");

let login = function(gameCallback) {
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
            util.request('login', reqData, (res) => {
                gameCallback(res);
            }, (err) => {
                loginFail('登录失败，请稍后再试！', () => {
                    login(gameCallback);
                });
                console.log("[wxlogin]登陆服请求失败:");
            }
            )
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

module.exports = {
    login:login
}