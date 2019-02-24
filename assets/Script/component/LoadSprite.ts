import StringUtil from "../utils/StringUtil";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class LoadSprite extends cc.Sprite{

    @property
    public url:string ="";
    @property
    public resType:"jpg"|"png" ="png";
    @property(cc.SpriteFrame)
    public defaultSpr:cc.SpriteFrame = null;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    private static _spriteAtlasMap:any ={};
    /**
     * 配置图集动态加载
     * @param path 
     * @param atlasUrl 
     */
    public static addSpriteAtlas(path:string,atlas:string){
        this._spriteAtlasMap[path] = atlas;
    }
    private static getAtlas(path:string):string{
        var atlas = "";
        for (var key in this._spriteAtlasMap){
            if(path.indexOf(key)>-1){
                atlas = this._spriteAtlasMap[key];
                break;
            }
        }
        return atlas;
    }

    // update (dt) {}
    private _callback:Function = null;

    /**
     * 加载图片
     * @param path 
     * @param type 
     */
    public load(path:string,type:string = null,cb:Function = null){
        if (path == null ) {
            return;
        }
        if(path == ""){
            this.spriteFrame = null;
            return;
        }
        if(type == null || type == undefined){
            type = this.resType;
        }
        this._callback = cb;
        let self = this;
        // console.log("LoadSprite.load: ","url:"+path,",type:"+type);
        if (path.indexOf("http://") >= 0|| path.indexOf("https://")>=0) {
             cc.loader.load({url: path, type: type},(err,tex)=>{
                if(err){
                    console.log("LoadSprite.load failed: "+ err.message,"url:"+path);
                    this.spriteFrame = this.defaultSpr;
                }else{
                    this.spriteFrame = new cc.SpriteFrame(tex, new cc.Rect(0, 0, tex.pixelWidth, tex.pixelHeight))
                    this._callback && this._callback();
                }
             });
        }else{
            let __self = this;
            var atlasUrl:string = LoadSprite.getAtlas(path);
            if(atlasUrl!=""){ //动态加载图集资源
                cc.loader.loadRes(atlasUrl, cc.SpriteAtlas, function (err, atlas) {
                    if(err){
                        console.log("LoadSprite.load atlas failed:"+ err.message);
                        this.spriteFrame = this.defaultSpr;
                    }else{
                        var name = path.substring(path.lastIndexOf("/"),path.length-1);
                        var frame = atlas.getSpriteFrame(name);
                        if(__self.isValid){
                            __self.spriteFrame = frame;
                        }
                    }
                });
            }else{  //散图资源
                if(path.indexOf("resources") >= 0){
                    path = this.checkUrlPath(path);
                }
                cc.loader.loadRes(path,cc.SpriteFrame,
                    (error: Error, resource: cc.SpriteFrame) => {
                        if(error){
                            console.log("LoadSprite.load failed:"+ error.message);
                            this.spriteFrame = this.defaultSpr;
                        }else{
                            if(__self.isValid){
                                __self.spriteFrame = resource;
                            }
                        }
                        cb && cb();
                    }
                );
            }
        }
    }

    private checkUrlPath(resPath :string){
        if (resPath.indexOf("resources") >= 0) {
            resPath = resPath.replace('resources/','')
        } 
        return resPath;
    }
    
}
