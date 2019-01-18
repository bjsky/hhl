import UIBase from "../../component/UIBase";
import GuideInfo from "../../model/GuideInfo";
import TextAni from "../../component/TextAni";
import { COMMON } from "../../CommonData";
import CityScene from "../../scene/CityScene";
import { SCENE } from "../../manager/SceneManager";
import { GuideTypeEnum, GUIDE, GuideNpcDir } from "../../manager/GuideManager";
import { EVENT } from "../../message/EventCenter";
import GameEvent from "../../message/GameEvent";
import { UI } from "../../manager/UIManager";

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
export default class GuideTapPanel extends UIBase {

    @property(cc.Node)
    clickNode: cc.Node = null;

    @property(cc.Node)
    dialogNode: cc.Node = null;
    @property(cc.Node)
    npc: cc.Node = null;
    @property(cc.Node)
    npc2: cc.Node = null;
    @property(cc.Label)
    title: cc.Label = null;
    @property(cc.RichText)
    content: cc.RichText = null;
    @property(TextAni)
    dialogTextAni:TextAni = null;
    @property(cc.Node)
    dialogBg: cc.Node = null;

    @property(cc.Node)
    storyNode: cc.Node = null;
    @property(cc.RichText)
    storyText: cc.RichText = null;
    @property(TextAni)
    storyTextani: TextAni = null;
    @property(cc.Node)
    storyImg: cc.Node = null;
    @property(cc.Label)
    clickLabel: cc.Label = null;

    @property(cc.Node)
    arrowNode: cc.Node = null;
    @property(cc.Node)
    guideArrowNode:cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.storyText.string = "";
        this.content.string ="";
        this.clickLabel.node.active = false;
    }

    // onEnable(){
    //     this.clickNode.on(cc.Node.EventType.TOUCH_START,this.onMaskClick,this);
    // }

    // onDisable(){
    //     this.clickNode.off(cc.Node.EventType.TOUCH_START,this.onMaskClick,this);
    // }

    private _guideId:number =0;
    private _guideInfo:GuideInfo = null;

    //设置数据
    public setData(data){
    }

    start () {

    }

    public show(data){
        this._guideInfo = data;
        this._guideId = this._guideInfo.guideId;

        this.unscheduleAllCallbacks();
        if(this._guideInfo.type == GuideTypeEnum.GuideStory){
            this.storyNode.active = true;
            this.dialogNode.active = false;
            this.arrowNode.active = false;
            this.clickNode.position = COMMON.ZERO;
            this.clickNode.setContentSize(cc.winSize);
            GUIDE.updateGuideMaskPosAndSize(cc.v2(0,0),cc.size(0,0),cc.v2(0.5,0.5),255,false);
            this.showStory();
        }else if(this._guideInfo.type == GuideTypeEnum.GuideTalk){
            this.storyNode.active = this.arrowNode.active = false;
            if(this._guideInfo.delay>0){
                this.scheduleOnce(()=>{
                    this.setDialogShow();
                },this._guideInfo.delay)
            }else{
                this.setDialogShow();
            }
        }else if(this._guideInfo.type == GuideTypeEnum.GuideArrow){
            this.arrowNode.active = false;
            this.storyNode.active = this.dialogNode.active = false;
            this._checkNodeTime = 0;
            if(this._guideInfo.delay>0){
                this.scheduleOnce(()=>{
                    this.schedule(this.checkNode,this._checkNodeInterval);
                },this._guideInfo.delay)
            }else{
                this.schedule(this.checkNode,this._checkNodeInterval);
            }
        }
    }

    private setClickArea(node:cc.Node){
        let worldPos = node.parent.convertToWorldSpaceAR(node.getPosition());
        let contSize = node.getContentSize();
        if (worldPos != null) {
            let p = this.node.convertToNodeSpaceAR(worldPos);
            this.clickNode.position = p;
        }
        let arcPos = node.getAnchorPoint();
        this.clickNode.setAnchorPoint( arcPos );
        if (contSize != null) {
            this.clickNode.setContentSize(contSize);
            this.clickNode.active = true;
        } 
        else {
            this.clickNode.active = false;
        }
    }

    private showStory(){
        // this.storyTextani.addTypewriterAni(this._guideInfo.content,this.storyComplete.bind(this),"#FFFFFF");
        this.storyImg.setPosition(cc.v2(0,-cc.winSize.height+300));
        var act = cc.sequence(
            cc.moveTo(40,cc.v2(0,0)),
            cc.callFunc(()=>{
                this.storyComplete();
            })
        )
        this.storyImg.runAction(act);
    }

    private storyComplete(){
        this.scheduleOnce(this.onStoryClick.bind(this),5);
        this.storyImg.stopAllActions();
        this.clickNode.on(cc.Node.EventType.TOUCH_START,this.onStoryClick,this);
        this.clickLabel.node.active = true;
    }

    private onStoryClick(e){
        this.clickNode.off(cc.Node.EventType.TOUCH_START,this.onStoryClick,this);
        this.storyText.unscheduleAllCallbacks();
        this.storyTextani.removeTypewriterAni();

        if(this._guideInfo.params && Boolean(this._guideInfo.params.hideMask) == true){
            GUIDE.endStoryGuide(this._guideId);
        }else{
            GUIDE.nextGuide(this._guideId);
        }
        
    }

    private setDialogShow(){
        this.dialogNode.active = true;
        this.dialogNode.opacity = 0;
        this.setClickArea(this.dialogBg);
        GUIDE.updateGuideMaskPosAndSize(cc.v2(0,0),cc.size(0,0),cc.v2(0.5,0.5),0,false);
        this.showDialog();
    }

    private showDialog(){
        this.title.string = this._guideInfo.npc;
        this.npc.active = (this._guideInfo.npcDic == GuideNpcDir.NpcDirLeft)?true:false;
        this.npc2.active = (this._guideInfo.npcDic == GuideNpcDir.NpcDirRight)?true:false;
        this.content.string = this._guideInfo.content;
        this.dialogNode.runAction(cc.sequence(cc.fadeIn(0.3),cc.callFunc(this.dialogComplete.bind(this))));
    }
    private showComplete(){
        // this.dialogTextAni.addTypewriterAni(this._guideInfo.content,this.dialogComplete.bind(this),"#FFFFFF");
    }

    private hideDialog(cb:Function) {
        this.dialogNode.runAction(cc.sequence(cc.fadeOut(0.3),cc.callFunc(cb.bind(this))));
    }

    private dialogComplete(){
        this.clickNode.on(cc.Node.EventType.TOUCH_START,this.onDialogClick,this);
    }

    private onDialogClick(e) {
        this.clickNode.off(cc.Node.EventType.TOUCH_START,this.onDialogClick,this);
        this.hideDialog(()=>{
            GUIDE.nextGuide(this._guideId);
        });
    }


    private _checkNodeInterval:number = 0.1;
    private _checkNodeTime:number = 0;
    private _checkNodeMaxTime:number = 5;
    private checkNode(){
        this._checkNodeTime += this._checkNodeInterval;
        if(this._checkNodeTime < this._checkNodeMaxTime){
            var node:cc.Node = this.findGuideNode();
            if(node){
                this.unscheduleAllCallbacks();
                this._checkNodeTime = 0;
                if(this._guideInfo.nodeName.indexOf("building_")>-1){
                    var city:CityScene = SCENE.CurScene as CityScene;
                    // var tPos:cc.Vec2 = cc.v2(cc.winSize.width/2,cc.winSize.height/2).sub(node.parent.convertToWorldSpaceAR(node.position));
                    // var tPos:cc.Vec2 = this.node.parent.convertToWorldSpaceAR(COMMON.ZERO);
                    var wPos = node.parent.convertToWorldSpaceAR(node.position);
                    city.moveSceneToPos(wPos,()=>{
                        this.showArrow(node);
                    })
                }else{
                    this.showArrow(node);
                }
            }
        }else{
            GUIDE.endGuide();
        }
    }

    private findGuideNode():cc.Node{
        var city:CityScene = SCENE.CurScene as CityScene;
            if(this._guideInfo.nodeName.indexOf("building_")>-1){
            return city.getGuideNode(this._guideInfo.nodeName);
        }else if (this._guideInfo.nodeName.indexOf("buildPanel_")>-1){
            if(city.activeBuild){
                return city.activeBuild.getGuideNode(this._guideInfo.nodeName);
            }else{
                return null;
            }
        }else if(this._guideInfo.nodeName.indexOf("popup_")>-1){
            return UI.getPopupGuideNode(this._guideInfo.nodeName);
        }
        else {
            return null;
        }
    }

    private showArrow(find:cc.Node){
        this.arrowNode.active = true;
        this.setClickArea(find);
        var wPos:cc.Vec2 = find.parent.convertToWorldSpaceAR(find.position);
        GUIDE.updateGuideMaskPosAndSize(wPos,find.getContentSize(),cc.v2(find.anchorX,find.anchorY),51);
        this.guideArrowNode.setPosition(this.clickNode.position)
        this.guideArrowNode.runAction(cc.sequence(
            cc.moveBy(0.5,cc.v2(0,50))
            ,cc.moveBy(0.5,cc.v2(0,-50))
            ).repeatForever());
       this.clickNode.on(cc.Node.EventType.TOUCH_START,this.onArrowClick,this);
    }

    private onArrowClick(){
        this.clickNode.off(cc.Node.EventType.TOUCH_START,this.onArrowClick,this);
        this.guideArrowNode.stopAllActions();
        this.arrowNode.active = false;
        EVENT.emit(GameEvent.Guide_Touch_Complete,{id:this._guideId,name:this._guideInfo.nodeName});
    }

    // update (dt) {}
}
