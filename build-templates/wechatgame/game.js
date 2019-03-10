require('libs/weapp-adapter/index');

var Parser = require('libs/xmldom/dom-parser');
window.DOMParser = Parser.DOMParser;
require('libs/wx-downloader.js');

// //测试服务器地址
// window.login_server_url = "wss://www.xh52.top:8580/websocket";//服务器域名地址
//正式服务器地址
window.login_server_url = "wss://wz.1233k.com:8580/websocket";//服务器域名地址

// wxDownloader.REMOTE_SERVER_ROOT = "https://s.1233k.com/"; //远程cdn资源地址
//测试资源地址
wxDownloader.REMOTE_SERVER_ROOT = "https://s.1233k.com/test/"; //远程cdn资源地址
wxDownloader.SUBCONTEXT_ROOT = "";


require("./launch");
require('src/settings');
require('main');
