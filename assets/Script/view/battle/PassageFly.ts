import StringUtil from "../../utils/StringUtil";

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
export default class PassageFly extends cc.Component {

    @property(cc.Label)
    lblAddValue: cc.Label = null;


    // LIFE-CYCLE CALLBACKS:

    onLoad () {

        this.node.opacity = 0;
    }

    start () {

    }
    //增加的小数部分
    private _addFloatValue:number = 0;

    public reset(){
        this._addFloatValue = 0;
        this.node.opacity = 0;
        this.node.stopAllActions();
    }

    public playEffect(addValue:number):number{
        this.node.stopAllActions();
        this.node.setPosition(this.getStartPos());

        var intAddValue:number = Math.floor(addValue);
        var floatValue = addValue - intAddValue;
        this._addFloatValue += floatValue;
        if(this._addFloatValue>1){
            intAddValue+=1;
            this._addFloatValue-=1;
        }

        this.lblAddValue.string = intAddValue.toString();

        var seq = cc.spawn(
            cc.moveBy(1.6,cc.v2(0,50)),
            cc.sequence(
                cc.fadeIn(0.3),
                cc.delayTime(1),
                cc.fadeOut(0.3)
            )
        )
        this.node.runAction(seq);

        return intAddValue;
    }

    private getStartPos(){
        var randomX = this.node.parent.width * Math.random();
        var randomY = - this.node.parent.height * Math.random();
        return cc.v2(randomX,randomY)
    }

    // update (dt) {}
}
