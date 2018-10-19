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
export default class ButtonEffect extends cc.Component {

    @property originalScale:number = 1;
    private onNodeTouchStart(evt) {
        this.node.stopAllActions();
        var seq = cc.sequence(
            cc.scaleTo(0.06, 1.3 * this.originalScale),
            cc.scaleTo(0.1, 1.1 * this.originalScale)
        );
        this.node.runAction(seq);
    }

    private onNodeTouchEnd(evt) {
        this.node.stopAllActions();
        var seq = cc.sequence(
            cc.scaleTo(0.05, 1.2 * this.originalScale),
            cc.scaleTo(0.06, 1 * this.originalScale)
        );
        this.node.runAction(seq);
    }

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        
    }

    start () {

    }

    onEnable() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onNodeTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onNodeTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onNodeTouchEnd, this);
    }

    onDisable() {
        this.node.off(cc.Node.EventType.TOUCH_START, this.onNodeTouchStart, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.onNodeTouchEnd, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.onNodeTouchEnd, this);
    }

    // update (dt) {}

    onDestroy() {

    }
}
