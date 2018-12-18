import CardInfo from "../model/CardInfo";
import { Card } from "../module/card/CardAssist";
import { UI } from "../manager/UIManager";
import { ResConst } from "../module/loading/steps/LoadingStepRes";
import UIBase from "./UIBase";
import CardSmall, { CardSimpleShowType } from "../view/card/CardSmall";

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
export default class CardEffect extends cc.Component {

    @property
    curIndex: number = 0;

    public PosArr:Array<cc.Vec2> = [cc.v2(-288,-166),cc.v2(-165,-166),cc.v2(0,-166),cc.v2(165,-166),cc.v2(288,-166)];
    public ScaleArr:Array<number> = [0.6,0.8,1,0.8,0.6];

    // LIFE-CYCLE CALLBACKS:

    private _cardFrontUI:CardSmall  = null;

    onLoad(){
        this.node.position = this.PosArr[this.curIndex];
        this.node.scale = this.ScaleArr[this.curIndex];
    }

    private _during:number = 0.3;
    public play(during:number){
        if(this._cardFrontUI!=null){
            this._cardFrontUI.node.active = true;
            UI.removeUI(this._cardFrontUI.node);
            this._cardFrontUI = null;
        }
        this.node.stopAllActions();
        this._during = during;
        this.curIndex +=1;
        if(this.curIndex>this.PosArr.length-1){
            this.curIndex = 0;
            this.node.zIndex = 1;
            var fadeAct = cc.sequence(
                cc.spawn(
                    cc.fadeOut(this._during/2),
                    cc.scaleTo(this._during/2,0.4,0.4),
                ),cc.callFunc(()=>{
                    this.node.position = this.PosArr[0];
                }),
                cc.spawn(
                    cc.fadeIn(this._during/2),
                    cc.scaleTo(this._during/2,this.ScaleArr[0],this.ScaleArr[0]),
                )//,
                // cc.callFunc(()=>{
                //     this.moveToNext();
                // })
            )
            this.node.runAction(fadeAct);
        }else{
            if(this.curIndex== 1){
                this.node.zIndex = 2;
            }else if(this.curIndex == 2){
                this.node.zIndex = 4;
            }else if(this.curIndex == 3){
                this.node.zIndex = 3;
            }else if(this.curIndex == 4){
                this.node.zIndex = 1;
            }
            var moveAct = 
            // cc.sequence(
                cc.spawn(
                    cc.moveTo(this._during,this.PosArr[this.curIndex]), 
                    cc.scaleTo(this._during,this.ScaleArr[this.curIndex],this.ScaleArr[this.curIndex])
                )//,
                // cc.callFunc(()=>{
                //     this.moveToNext();
                // })
            // )
            this.node.runAction(moveAct);
        }
    }

    private _showEffectEndCB:Function = null;
    public playShowEffect(cardUuid:string,cb:Function){
        this._showEffectEndCB = cb;
        this.node.stopAllActions();
        UI.loadUI(ResConst.cardSmall,{uuid:cardUuid,type:CardSimpleShowType.Owner},this.node,(base:UIBase)=>{
            this._cardFrontUI = base as CardSmall;
            this._cardFrontUI.node.active = false;
            var scaleOut = cc.sequence(cc.scaleTo(0.15,0,1),cc.callFunc(()=>{
                this._cardFrontUI.node.active = true;
                var scaleIn = cc.sequence(cc.scaleTo(0.15,1,1),cc.callFunc(()=>{
                    this._showEffectEndCB && this._showEffectEndCB();
                }));
                this.node.runAction(scaleIn);
            }))
            this.node.runAction(scaleOut);
        })
    }

    // onLoad () {}

    start () {

    }

    // update (dt) {}
}
