
require('utils/md5');

let getSig = function(data) {
    let arr = [];
    for (let k in data) {
        arr.push(k);
    }
    arr.sort((a, b) => {
        if (a > b) {
        return 1
        } else {
        return -1;
        }
        return 0;
    });
    let sig = '';
    for (let i = 0; i < arr.length; i++) {
        let k = arr[i];
        sig += k + '=' + data[k];
        if (i != arr.length - 1) {
        sig += "&";
        }
    }
    sig += '&key=' + window.login_server_gamekey;
    return window.md5.hex_md5(sig);
}

let request = function(action, data, success, fail) {
    if (data != null) {
        data.sig = getSig(data);
    }
    let reqUrl = window.login_server_url + '/' + action + '/' + window.login_server_gameid;
    console.info('[NET] wx.request: action =', action, reqUrl, JSON.stringify(data));
    let t = Date.now();
    wx.request({
        url: reqUrl,
        data: data,
        method: 'post',
        success: (res) => {
        if (res.data.code == 0) {
            console.info('[NET] wx.response, action =', action, JSON.stringify(res.data), Date.now() - t);
        } else {
            console.error('[NET] wx.response, action =', action, JSON.stringify(res.data), Date.now() - t);
        }        
        success(res);
        },
        fail: (err) => {
        console.info('[NET] wx.response, action =', action, JSON.stringify(err), Date.now() - t);
        fail(err)
        },
    });
}

module.exports = {
    getSig:getSig,
    request:request
}