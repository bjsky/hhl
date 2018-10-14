import NetMessage from "../net/NetMessage";

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

export var UI = UIManager.getInstance();
