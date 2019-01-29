import NetMessage from "../net/NetMessage";
import UIBase from "../component/UIBase";
import { AlertBtnType } from "../view/AlertPanel";
import { ResConst } from "../module/loading/steps/LoadingStepRes";
import { EVENT } from "../message/EventCenter";
import GameEvent from "../message/GameEvent";
import PathUtil from "../utils/PathUtil";

/**
 * 管理各种界面单例,层级
 * 
 */
export default class UIManager{
    private static _instance: UIManager = null;
    public static getInstance(): UIManager {
        if (UIManager._instance == null) {
            UIManager._instance = new UIManager();
            
        }
        return UIManager._instance;
    }


    //ui层
    public UILayer:cc.Node = null;
    //建筑面板层
    public PanelLayer:cc.Node = null;
    //拖动层
    public DragLayer:cc.Node = null;
    //弹窗层级
    public PopupLayer:cc.Node = null;
    //提示层级
    public TipLayer:cc.Node = null;
    //剧情层级
    public PlotLayer:cc.Node = null;
    //引导层
    public GuideLayer:cc.Node = null;

    /**
     * 注册层级
     * @param root  ui根节点
     */
    public registerLayer(root:cc.Node){
        cc.game.addPersistRootNode(root);

        root.addComponent(NetMessage);
        
        this.UILayer = root.getChildByName("UILayer");
        this.PanelLayer = root.getChildByName("PanelLayer");
        this.DragLayer = root.getChildByName("DragLayer");
        this.PopupLayer = root.getChildByName("PopupLayer");
        this.TipLayer = root.getChildByName("TipLayer");
        this.PlotLayer = root.getChildByName("PlotLayer");
        this.GuideLayer = root.getChildByName("GuideLayer");

        this.initMaskLayer();
    }

    private _uiPool:UIPool = new UIPool();
    //获取ui池
    public get uiPool(){
        return this._uiPool;
    }

    // private _isLoading:boolean = false;
    public loadUI(res:string,data:any,parent:cc.Node,complete?:Function){
        // if(this._isLoading)
        //     return;
        // this._isLoading = true;
        var node:cc.Node = this._uiPool.getUIFromPool(res);
        if(node!=null){
            // this._isLoading = false;
            let ui = node.getComponent(UIBase);
            if (ui != undefined) {
                data!=null && ui.setData(data);
            }
            parent.addChild(node);
            complete && complete(ui);
        }else{
            cc.loader.loadRes(res,(err, prefab)=> {
                if (err) {
                    console.log(err.message || err);
                    return;
                }
                // this._isLoading = false;
                let node: cc.Node = cc.instantiate(prefab);
                let ui = node.getComponent(UIBase);
                if (ui != undefined) {
                    ui.name = res;
                    data!=null && ui.setData(data);
                }
                parent.addChild(node);
                complete && complete(ui);
            });
        }
    }

    public removeUI(node:cc.Node){
        let ui = node.getComponent(UIBase);
        if (ui != undefined) {
            this._uiPool.putUIToPool(ui);
        }else{
            node.destroy();
        }
    }

    /////////////////////////
    //  popUp
    ///////////////////////
    private _popups:Array<UIBase> = [];
    private _mask:cc.Node = null;
    private _panelMask:cc.Node = null;
    private _curPopup:UIBase = null;

    private initMaskLayer() {
        if (this._mask != null) {
            return;
        }
        this._mask = new cc.Node();
        this._mask.setAnchorPoint(0.5, 0.5);
        this._mask.addComponent(cc.BlockInputEvents);
        let sp = this._mask.addComponent(cc.Sprite);
        cc.loader.loadRes(PathUtil.getMaskBgUrl(),cc.SpriteFrame,(error: Error, spr: cc.SpriteFrame) => {
            sp.spriteFrame = spr;
        })
        //sp.spriteFrame = new cc.SpriteFrame('res/raw-internal/image/default_sprite_splash.png');
        sp.sizeMode = cc.Sprite.SizeMode.CUSTOM;
        this._mask.opacity = 51;
        this._mask.color = cc.color(0, 0, 0);
        this._mask.zIndex = 0;
        this._mask.setContentSize(cc.winSize.width, cc.winSize.height);
        this._mask.parent = this.PopupLayer;
        this._mask.active = false;
        this._mask.on(cc.Node.EventType.TOUCH_START,this.onMaskClick,this);

        this._panelMask = new cc.Node();
        this._panelMask.setAnchorPoint(0.5, 0.5);
        this._panelMask.addComponent(cc.BlockInputEvents);
        let panelSpr = this._panelMask.addComponent(cc.Sprite);
        cc.loader.loadRes(PathUtil.getMaskBgUrl(),cc.SpriteFrame,(error: Error, spr: cc.SpriteFrame) => {
            panelSpr.spriteFrame = spr;
        })
        //sp.spriteFrame = new cc.SpriteFrame('res/raw-internal/image/default_sprite_splash.png');
        panelSpr.sizeMode = cc.Sprite.SizeMode.CUSTOM;
        this._panelMask.opacity = 0;
        this._panelMask.color = cc.color(0, 0, 0);
        this._panelMask.zIndex = 0;
        this._panelMask.setContentSize(cc.winSize.width, cc.winSize.height);
        this._panelMask.parent = this.PanelLayer;
        this._panelMask.active = false;
    }

    private onMaskClick(e){
        EVENT.emit(GameEvent.Mask_touch);
    }

    public createPopUp(res:string,data:any,createComplete?:Function){
        this._mask.active = true;
        this._mask.zIndex = this._popups.length > 0?this._popups[this._popups.length -1].node.zIndex+1:0;
        console.log("createPopup,mask index:"+this._mask.zIndex)
        this.loadUI(res,data,this.PopupLayer,(ui:UIBase)=>{
            if(ui){
                this._popups.push(ui);
                this._curPopup = ui;
                ui.node.zIndex = this._popups.length * 2;
                this._mask.opacity = ui.maskOpacity;
                console.log("createPopup,node index:"+ui.node.zIndex)
                // this.checkMaskLayer();
                createComplete && createComplete(ui);
            }
        });
    }

    public loadPanel(res:string,data:any,createComplete?:Function){
        this.loadUI(res,data,this.PanelLayer,(ui:UIBase)=>{
            if(ui){
                this._panelMask.active = true;
                // this.checkMaskLayer();
                createComplete && createComplete(ui);
            }
        });
    }

    public removePanel(node:cc.Node){
        node.parent = null;
        this._panelMask.active = false;
    }

    public showPanelLayer(){
        this.PanelLayer.active = true;
    }
    public hidePanelLayer(){
        this.PanelLayer.active = false;
    }
    public closePopUp(node:cc.Node){
        var ui:UIBase = node.getComponent(UIBase);
        if(ui){
            var index:number = this._popups.indexOf(ui);
            if(index>-1){
                this._popups.splice(index, 1);
            }
            if(this._popups.length > 0){
                this._mask.active = true;
                this._mask.zIndex = this._popups[this._popups.length -1].node.zIndex-1;
                this._curPopup = this._popups[this._popups.length-1];
                this._mask.opacity = this._curPopup.maskOpacity;
            }else{
                this._mask.active = false;
                this._mask.zIndex = 0;
                this._curPopup = null;
            }
            console.log("closePopup,mask index:"+this._mask.zIndex)
        }
        this.removeUI(node);
    }

    //获得当前弹窗上的节点
    public getPopupGuideNode(name:string):cc.Node{
        if(this._curPopup){
            return this._curPopup.getGuideNode(name);
        }else{
            return null;
        }
    }

    /////////////////////////
    //  interface
    ///////////////////////

    // 转圈提示
    public addLoadingLayer(worldPoint:cc.Vec2 = null)
    {
        // this._panelHolder.addLoadingLayer(worldPoint);
    }

        // 转圈提示隐藏
    public removeLoadingLayer()
    {
        // this._panelHolder.removeLoadingLayer();
    }
    /**
     * 显示网络提示框，不能点击遮罩关闭。登陆阶段loadingscene被ui层挡住，需要临时加到场景
    */
    public showNetAlert(title:string,message:string,okCallback?:Function,cancelCallback?:Function,btnType?:number, act:boolean=false){
        var data = {content:message,okCb:okCallback,cancelCb:cancelCallback,btnType:btnType};
        this.createPopUp(ResConst.AlertPanel,data);
    }

    /**
     * 一个漂浮提示
     * @param content 内容
     * @param pos 位置
     */
    public showTip(content:string){
        this.loadUI(ResConst.TipPanel,{content:content},this.TipLayer);
    }

    public showTipCustom(tipRes:string,data:any,pos?:cc.Vec2,complete?:Function){
        this.loadUI(tipRes,{data:data,pos:pos,complete:complete},this.TipLayer);
    }

    public showAlert(content:string,okCallback?:Function,cancelCallback?:Function,btnType:number = AlertBtnType.OKButton){
        var data = {content:content,okCb:okCallback,cancelCb:cancelCallback,btnType:btnType};
        this.createPopUp(ResConst.AlertPanel,data);
    }
}

export class UIPool{

    private _uiPools:any ={};

    public getUIFromPool(res: string):cc.Node {
        let pool = this._uiPools[res];
        if (pool == null) {
            return null;
        }
        let node = pool.get();
        return node;
    }

    public putUIToPool(ui:UIBase) {
        let pool: cc.NodePool = this._uiPools[ui.name];
        if (pool == null) {
            pool = new cc.NodePool();
            this._uiPools[ui.name] = pool;
        }
        return pool.put(ui.node);
    }

}


export var UI = UIManager.getInstance();
