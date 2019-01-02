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
export default class ResBounceEffect extends cc.Component {

   

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    private _isplaying:boolean =false;
    private _waitPlay:boolean = false;
    play(){
        if(this._isplaying){
            this._waitPlay = true;
            return;
        }
        this._isplaying = true;
        let callback = cc.callFunc(function(){
            this._isplaying = false;
            if(this._waitPlay){
                this._waitPlay = false;
                this.play();
            }
        },this)
        let seq = cc.sequence(
            cc.scaleTo(0.15,1.2,1.1),cc.scaleTo(0.1,1),callback
        );
        this.node.runAction(seq);
    }

    start () {

    }

    // update (dt) {}
}
