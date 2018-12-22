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
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}


    // update (dt) {}

    /**
     * 加载图片
     * @param path 
     * @param type 
     */
    public load(path:string,type:string = null){
        if (path == null) {
            return;
        }
        if(path == ""){
            this.spriteFrame = null;
            return;
        }
        let self = this;
        if (path.indexOf("http://") >= 0) {
             cc.loader.load({url: path, type: type},this.loadComplete.bind(this));
        }else if (path.indexOf("resources") >= 0) {
            let __self = this;
            var newPath = this.checkUrlPath(path);
            cc.loader.loadRes(newPath,cc.SpriteFrame,
                (error: Error, resource: cc.SpriteFrame) => {
                    __self.spriteFrame = resource;
                }
            );
        }else{
            let __self = this;
            cc.loader.loadRes(path,cc.SpriteFrame,
                (error: Error, resource: cc.SpriteFrame) => {
                    __self.spriteFrame = resource;
                }
            );
        }
    }

    private loadComplete(err,tex)
    {
        if(err){
            console.log("MIconLoader.load fial: "+ err);
        }else{
            this.spriteFrame = new cc.SpriteFrame(tex);
        }
    }

    private checkUrlPath(resPath :string){
        if (resPath.indexOf("resources") >= 0) {
            resPath = resPath.replace('resources/','')
        } 
        return resPath;
    }
    
}
