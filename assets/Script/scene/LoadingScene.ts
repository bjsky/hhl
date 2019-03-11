import SceneBase from "./SceneBase";
import { GAME } from "../GameController";
import { UI } from "../manager/UIManager";
import AlertPanel from "../view/AlertPanel";
import UIBase from "../component/UIBase";

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
export default class LoadingScene extends SceneBase {

    // LIFE-CYCLE CALLBACKS:

    @property(cc.Node) uicanvas: cc.Node = null;
    @property(cc.Node) netLayer: cc.Node = null;
    onLoad () {
        //常驻ui
        UI.registerLayer(this.uicanvas);
    }

    private _netAlert:AlertPanel = null;
    private _netAlertLoading:boolean =false;
    public showNetAlert(res:string,data:any){
        if(this._netAlertLoading){
            return;
        }
        if(this._netAlert!=null){
            this._netAlert.onClose(null);
        }
        this._netAlertLoading = true;
        UI.loadUI(res,data,this.netLayer,(ui:UIBase)=>{
            this._netAlertLoading = false;
            this._netAlert = ui as AlertPanel;
        });
    }

    start () {

        GAME.start();
        
    }

    onDisable(){
        if(this._netAlert!=null){
            this._netAlert.onClose(null);
        }   
    }


    update () {
    }
}
