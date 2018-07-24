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
export default class PanelManager extends cc.Component {

    // LIFE-CYCLE CALLBACKS:
    @property(cc.Node) uiLayer: cc.Node = null;
    @property(cc.Node) panelLayer: cc.Node = null;
    @property(cc.Node) tipLayer: cc.Node = null;
    @property(cc.Node) topLayer: cc.Node = null;
    onLoad () {

        cc.game.addPersistRootNode(this.node);

    }

    start () {

    }

    // update (dt) {}
}
