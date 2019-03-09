import PopUpBase from "../component/PopUpBase";
import { UI } from "../manager/UIManager";
import TouchHandler from "../component/TouchHandler";
import FlowGroup from "../component/FlowGroup";
import { COMMON } from "../CommonData";
import { EVENT } from "../message/EventCenter";
import GameEvent from "../message/GameEvent";
import { GUIDE } from "../manager/GuideManager";
import { SCENE } from "../manager/SceneManager";
import CityScene from "../scene/CityScene";
import { GAME } from "../GameController";
import { Share } from "../module/share/ShareAssist";
import { Passage } from "../module/battle/PassageAssist";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


export enum AwardTypeEnum{
    CardDestroyAward = 1,
    PassageCollect,
}

const {ccclass, property} = cc._decorator;

@ccclass
export default class AwardPanel extends PopUpBase {

    @property(cc.Label)
    lblDesc: cc.Label = null;

    @property(cc.Node)
    btnShouqu: cc.Node = null;

    @property(FlowGroup)
    awardGroup:FlowGroup = null;

    @property(cc.Sprite)
    doubleIcon:cc.Sprite= null;
    @property(cc.Node)
    doubleNode:cc.Node= null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}


    public onClose(e){
        var seq = cc.sequence(
            cc.moveBy(0.3,cc.v2(0,500)).easing(cc.easeBackIn()),
            cc.callFunc(()=>{
                var city = (SCENE.CurScene as CityScene);
                if(city){
                    city.activeBuild.enableGetGuideNode = true;
                }
                this.node.position = COMMON.ZERO;
                UI.closePopUp(this.node);
                GAME.showLevelUp();
            })
        )
        this.node.runAction(seq)
    }

    onEnable(){
        super.onEnable();
        this.btnShouqu.on(TouchHandler.TOUCH_CLICK,this.onShouquTouch,this);
        this.doubleNode.on(cc.Node.EventType.TOUCH_START,this.onDoubleTouch,this);

        EVENT.on(GameEvent.Guide_Touch_Complete,this.onGuideTouch,this);
        this.showAward();
    }

    onDisable(){
        super.onDisable();
        this.btnShouqu.off(TouchHandler.TOUCH_CLICK,this.onShouquTouch,this);
        this.doubleNode.off(cc.Node.EventType.TOUCH_START,this.onDoubleTouch,this);

        EVENT.off(GameEvent.Guide_Touch_Complete,this.onGuideTouch,this);
        this.removeAward();
    }

    private _type:AwardTypeEnum = 0;
    private _resArr:Array<any> =[];
    public setData(data:any){
        super.setData(data);
        this._type = data.type;
        this._resArr = data.arr;
    }
    start () {

    }

    private showAward(){
        if(this._type == AwardTypeEnum.CardDestroyAward){
            this.lblDesc.string ="回收获得："
            this.doubleNode.active = false;
        }else if(this._type == AwardTypeEnum.PassageCollect){
            this.lblDesc.string = "挂机获得：";
            if(GUIDE.isInGuide){
                this.doubleNode.active = false;
            }else{
                this.doubleNode.active = true;
                this.setDoubleSelect(this._doubleSelect);
            }
        }
        this.awardGroup.setGroupData(this._resArr);
    }

    private removeAward(){
        this.awardGroup.setGroupData([]);
    }

    private onShouquTouch(e){
        if(this._type == AwardTypeEnum.CardDestroyAward){
            this.showResClose();
        }else if(this._type == AwardTypeEnum.PassageCollect){
            if(this._doubleSelect && !GUIDE.isInGuide){
                Share.shareAppMessage(()=>{
                    this.onReceivedDouble(true);
                },()=>{
                    this.onReceivedDouble(false);
                });
            }else{
                this.onReceivedDouble(false);
            }
        }
    }

    private onReceivedDouble(isDouble:boolean){
        Passage.collectRes(GUIDE.isInGuide,()=>{
            this.showResClose();
        });
    }
    private showResClose(){
        EVENT.emit(GameEvent.Show_Res_Add,{types:this._resArr});
        this.onClose(null);
    }

    protected onMaskTouch(e){
        this.onShouquTouch(e);
    }


    protected onShowComplete(){
        super.onShowComplete();
        this._enableGetGuideNode = true;
    }

    private _enableGetGuideNode:boolean =false;


    private _doubleSelect:boolean =true;
    private setDoubleSelect(select:boolean){
        this._doubleSelect = select;
        this.doubleIcon.node.active = select;
    }

    private onDoubleTouch(e){
        this.setDoubleSelect(!this._doubleSelect);
    }
    /////////////////
    //  guide
    //////////////////
    public getGuideNode(name:string):cc.Node{
        if(name == "popup_rewardReceive" && this._enableGetGuideNode){
            return this.btnShouqu;
        }
        else{
            return null;
        }
    }

    private onGuideTouch(e){
        var guideId = e.detail.id;
        var nodeName = e.detail.name;
        if(nodeName == "popup_rewardReceive"){
            var city = (SCENE.CurScene as CityScene);
            if(city){
                city.activeBuild.enableGetGuideNode = false;
            }
            this.onShouquTouch(null);
            GUIDE.nextGuide(guideId);
        }

    }
    // update (dt) {}
}
