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
export default class LoadingScene extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    @property(cc.ProgressBar)
    loadingBar: cc.ProgressBar = null;
    @property(cc.Label)
    lblProgress: cc.Label = null;
    // onLoad () {}

    start () {

    }

    private time = 0;
    update (dt) {
        this.time +=dt;
        if(this.time>3)
            return;
        var pro = this.time/3;
        this.loadingBar .progress = pro;
        this.lblProgress.string = Math.floor(pro*100)+" %";

    }
}
