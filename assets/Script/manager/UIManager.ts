import NetMessage from "../net/NetMessage";
import UIBase from "../component/UIBase";

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
        this.UILayer = root.getChildByName("PopupLayer");
        this.UILayer = root.getChildByName("TipLayer");
        this.UILayer = root.getChildByName("PlotLayer");
        this.UILayer = root.getChildByName("GuideLayer");
    }

    private _uiPool:UIPool = new UIPool();

    public loadUI(res:string,data:any,parent:cc.Node){
        var node:cc.Node = this._uiPool.getUIFromPool(res);
        if(node!=null){
            let ui = node.getComponent(UIBase);
            if (ui != undefined) {
                data!=null && ui.setData(data);
            }
            parent.addChild(node);
        }else{
            cc.loader.loadRes(res, function(err, prefab) {
                if (err) {
                    console.log(err.message || err);
                    return;
                }
                let node: cc.Node = cc.instantiate(prefab);
                let ui = node.getComponent(UIBase);
                if (ui != undefined) {
                    data!=null && ui.setData(data);
                }
                parent.addChild(node);
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
        let pool: cc.NodePool = this._uiPools[name];
        if (pool == null) {
            pool = new cc.NodePool();
            this._uiPools[name] = pool;
        }
        return pool.put(ui.node);
    }

}


export var UI = UIManager.getInstance();
