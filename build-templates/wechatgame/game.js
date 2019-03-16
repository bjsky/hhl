require('libs/weapp-adapter/index');
var Parser = require('libs/xmldom/dom-parser');
window.DOMParser = Parser.DOMParser;
require('libs/wx-downloader.js');
require('src/settings');
var settings = window._CCSettings;
require('main');
require(settings.debug ? 'cocos2d-js.js' : 'cocos2d-js-min.js');
require('./libs/engine/index.js');

wxDownloader.REMOTE_SERVER_ROOT = "https://s.1233k.com";
wxDownloader.SUBCONTEXT_ROOT = "";
var pipeBeforeDownloader = cc.loader.md5Pipe || cc.loader.assetLoader;
cc.loader.insertPipeAfter(pipeBeforeDownloader, wxDownloader);

if (cc.sys.browserType === cc.sys.BROWSER_TYPE_WECHAT_GAME_SUB) {
    require('./libs/sub-context-adapter');
}
else {
    // Release Image objects after uploaded gl texture
    cc.macro.CLEANUP_IMAGE_CACHE = true;
}

require("./launch");
// //测试服务器地址
// window.login_server_url = "wss://www.xh52.top:8580/websocket";//服务器域名地址
//正式服务器地址
window.login_server_url = "wss://wz.1233k.com:8580/websocket";//服务器域名地址

window.boot();