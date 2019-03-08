require('libs/weapp-adapter/index');

var Parser = require('libs/xmldom/dom-parser');
window.DOMParser = Parser.DOMParser;
require('libs/wx-downloader.js');

// window.login_server_url = "ws://192.168.0.102:8502/websocket";//服务器域名地址
window.login_server_url = "wss://www.xh52.top:8580/websocket";//服务器域名地址
window.login_server_gameid = '10017001'; // 登录服appid -- 平台提供
window.login_server_gamekey = 'uRH21v8SDxfdvWbO'; // 登录签名key -- 平台提供

// wxDownloader.REMOTE_SERVER_ROOT = "https://www.xh52.top"; //远程cdn资源地址/
wxDownloader.REMOTE_SERVER_ROOT = "https://s.1233k.com/test/"; //远程cdn资源地址
wxDownloader.SUBCONTEXT_ROOT = "";


require("./launch");
require('src/settings');
require('main');
