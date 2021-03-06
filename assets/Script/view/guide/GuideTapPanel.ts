import UIBase from "../../component/UIBase";
import GuideInfo from "../../model/GuideInfo";
import TextAni from "../../component/TextAni";
import { COMMON } from "../../CommonData";
import CityScene from "../../scene/CityScene";
import { SCENE } from "../../manager/SceneManager";
import { GuideTypeEnum, GUIDE, GuideNpcDir, GuideArrowDir, GuideForceEnum } from "../../manager/GuideManager";
import { EVENT } from "../../message/EventCenter";
import GameEvent from "../../message/GameEvent";
import { UI } from "../../manager/UIManager";
import { NET } from "../../net/core/NetController";
import MsgGuideUpdate from "../../net/msg/MsgGuideUpdate";

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
    private _guideId:number =0;
    private _guideInfo:GuideInfo = null;
    private _guideForce:GuideForceEnum = 0;

    //设置数据
    public setData(data){
    }

    start () {

    }

    public show(data){
        this._guideInfo = data;
        this._guideId = this._guideInfo.guideId;
        this._guideForce = GuideForceEnum.Force;

        this.unscheduleAllCallbacks();
        GUIDE.setBlockEnable(true);
        this.guideArrowNode.stopAllActions();
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
        }else if(this._guideInfo.type == GuideTypeEnum.GuideArrow||
            this._guideInfo.type == GuideTypeEnum.GuideDrag ||
            this._guideInfo.type == GuideTypeEnum.GuideNodeTalk
            ){
            this.arrowNode.active = false;
            this.storyNode.active = this.dialogNode.active = false;
            this._checkNodeTime = 0;
            this._checkNodeMaxTime = this._guideInfo.checkTime;
            this.schedule(this.checkNode,this._checkNodeInterval);
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
        this.clickLabel.node.active = true;

        this.clickNode.on(cc.Node.EventType.TOUCH_START,this.onStoryClick,this);
        // this.storyTextani.addTypewriterAni(this._guideInfo.content,this.storyComplete.bind(this),"#FFFFFF");
        this.storyImg.setPosition(cc.v2(0,-cc.winSize.height+300));
        var act = cc.sequence(
            cc.moveTo(30,cc.v2(0,0)),
            cc.callFunc(()=>{
                this.storyComplete();
            })
        )
        this.storyImg.runAction(act);
    }

    private storyComplete(){
        this.scheduleOnce(this.endStory.bind(this),5);
        this.storyImg.stopAllActions();
    }

    private onStoryClick(e){
        if(!this._isEndStory){
            this._isEndStory = true;
            this.storyImg.position = cc.v2(0,0);
            this.storyComplete();
        }else{
            this._isEndStory = false;
            this.endStory();
        }
    }
    private _isEndStory:boolean = false;
    private endStory(){
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
        this.dialogNode.runAction(cc.sequence(cc.fadeIn(0.3),cc.callFunc(this.dialogComplete.bind(this))));
    }
    private showComplete(){
        // this.dialogTextAni.addTypewriterAni(this._guideInfo.content,this.dialogComplete.bind(this),"#FFFFFF");
    }

    private hideDialog(cb:Function) {
        this.dialogNode.runAction(cc.sequence(cc.fadeOut(0.3),cc.callFunc(cb.bind(this))));
    }

    private dialogComplete(){
        var content:string = this._guideInfo.content.replace("#","<color=#33FF00>" + COMMON.userInfo.name +"</color> ");
        this.content.string = content;
        this.clickNode.on(cc.Node.EventType.TOUCH_START,this.onDialogClick,this);
    }

    private onDialogClick(e) {
        this.clickNode.off(cc.Node.EventType.TOUCH_START,this.onDialogClick,this);
        this.content.string = "";
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

                if(this._guideInfo.delay>0){
                    this.scheduleOnce(()=>{
                        this.checkEndShowArrow(node);
                    },this._guideInfo.delay)
                }else{
                    this.checkEndShowArrow(node);
                }
            }
        }else{
            if(this._guideForce == GuideForceEnum.Force){
                GUIDE.endGuide();
                NET.send(MsgGuideUpdate.create(-1),(msg:MsgGuideUpdate)=>{
                    // GUIDE.endGuide();
                },this)
            }else if(this._guideForce == GuideForceEnum.Weak){
                GUIDE.endWeakGuide();
            }
        }
    }

    private checkEndShowArrow(node:cc.Node){
        if(this._guideInfo.nodeName.indexOf("building_")>-1){
            var city:CityScene = SCENE.CurScene as CityScene;
            // var tPos:cc.Vec2 = cc.v2(cc.winSize.width/2,cc.winSize.height/2).sub(node.parent.convertToWorldSpaceAR(node.position));
            // var tPos:cc.Vec2 = this.node.parent.convertToWorldSpaceAR(COMMON.ZERO);
            var wPos = node.parent.convertToWorldSpaceAR(node.position);
            city.moveSceneToPos(wPos,()=>{
                this.showArrow(node);
            })
        }else{
            if(this._guideInfo.type == GuideTypeEnum.GuideArrow)
            {
                this.showArrow(node);
            }else if(this._guideInfo.type == GuideTypeEnum.GuideDrag){
                this.showDrag(node,node.children[1],node.children[0]);
            }else if(this._guideInfo.type == GuideTypeEnum.GuideNodeTalk){
                this.setDialogShow();
            }
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
        else if(this._guideInfo.nodeName.indexOf("ui_")>-1){
            return UI.getMainUIGuideNode(this._guideInfo.nodeName);
        }
        else {
            return null;
        }
    }

    private showArrow(find:cc.Node){
        this.arrowNode.active = true;
        if(this._guideInfo.arrowDir == GuideArrowDir.ArrowDirLeft){
            this.guideArrowNode.scaleX = 1;
        }else if(this._guideInfo.arrowDir == GuideArrowDir.ArrowDirRight){
            this.guideArrowNode.scaleX = -1;
        }
        this.setClickArea(find);
        var wPos:cc.Vec2 = find.parent.convertToWorldSpaceAR(find.position);
        if(this._guideForce == GuideForceEnum.Force){ //强制类型处理遮罩
            GUIDE.updateGuideMaskPosAndSize(wPos,find.getContentSize(),cc.v2(find.anchorX,find.anchorY),51);
        }
        this.guideArrowNode.stopAllActions();
        this.guideArrowNode.setPosition(this.clickNode.position)
        this.guideArrowNode.runAction(cc.sequence(
            cc.moveBy(0.5,cc.v2(0,30))
            ,cc.moveBy(0.5,cc.v2(0,-30))
            ).repeatForever());
        
       this.clickNode.on(cc.Node.EventType.TOUCH_START,this.onArrowClick,this);
    }

    private onArrowClick(){

        this.clickNode.off(cc.Node.EventType.TOUCH_START,this.onArrowClick,this);
        this.guideArrowNode.stopAllActions();
        this.arrowNode.active = false;
        if(this._guideForce == GuideForceEnum.Force){
            EVENT.emit(GameEvent.Guide_Touch_Complete,{id:this._guideId,name:this._guideInfo.nodeName});
        }else if(this._guideForce == GuideForceEnum.Weak){
            EVENT.emit(GameEvent.Guide_Weak_Touch_Complete,{id:this._guideId,name:this._guideInfo.nodeName});
        }
    }


    private showDrag(find:cc.Node,dragNode:cc.Node,dropNode:cc.Node){
        this.arrowNode.active = true;
        if(this._guideInfo.arrowDir == GuideArrowDir.ArrowDirLeft){
            this.guideArrowNode.scaleX = 1;
        }else if(this._guideInfo.arrowDir == GuideArrowDir.ArrowDirRight){
            this.guideArrowNode.scaleX = -1;
        }
        this.setClickArea(find);
        GUIDE.setBlockEnable(false);
        var wPos:cc.Vec2 = find.parent.convertToWorldSpaceAR(find.position);
        GUIDE.updateGuideMaskPosAndSize(wPos,find.getContentSize(),cc.v2(find.anchorX,find.anchorY),51);
        var posFrom =  this.guideArrowNode.parent.convertToNodeSpaceAR(dragNode.parent.convertToWorldSpaceAR(dragNode.position));
        var posTo =  this.guideArrowNode.parent.convertToNodeSpaceAR(dropNode.parent.convertToWorldSpaceAR(dropNode.position));
        this.guideArrowNode.setPosition(posFrom)
        this.guideArrowNode.runAction(cc.sequence(
            cc.moveTo(0.8,posTo)
            ,cc.delayTime(0.2),
            cc.callFunc(()=>{
                this.guideArrowNode.setPosition(posFrom)
            })
            ).repeatForever());
    }
    // update (dt) {}

/////////////弱引导/////////////////
    /**
     * 显示若引导
     * @param guideInfo 
     */
    public showWeak(guideInfo:GuideInfo){

        this._guideInfo = guideInfo;
        this._guideId = this._guideInfo.guideId;
        this._guideForce = GuideForceEnum.Weak;

        this.unscheduleAllCallbacks();
        this.arrowNode.active = false;
        this.storyNode.active = this.dialogNode.active = false;
        this._checkNodeTime = 0;
        this._checkNodeMaxTime = this._guideInfo.checkTime;
        this.schedule(this.checkNode,this._checkNodeInterval);
        this.node.on(cc.Node.EventType.TOUCH_START,this.onNodeTouch,this);
    }

    onDisable(){
        this.node.off(cc.Node.EventType.TOUCH_START,this.onNodeTouch,this);
    }
    private onNodeTouch(e){
        if(e.target !=this.clickNode){
            GUIDE.endWeakGuide();
        }
    }
}
