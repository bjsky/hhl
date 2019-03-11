import SceneBase from "../scene/SceneBase";
import { EVENT } from "../message/EventCenter";
import GameEvent from "../message/GameEvent";

export const SceneConst = { 
    LoadingScene:"LoadingScene",
    CityScene:"CityScene"
}

export default class SceneManager{

    private static _instance: SceneManager = null;
    public static getInstance(): SceneManager {
        if (SceneManager._instance == null) {
            SceneManager._instance = new SceneManager();
            
        }
        return SceneManager._instance;
    }

    private _curScene:SceneBase = null;
    //当前场景
    public get CurScene():SceneBase{
        return this._curScene;
    }

    private _curSceneName:string ="";
    //当前场景名
    public get CurSceneName(){
        return this._curSceneName;
    }

    public getCCScene():SceneBase{
        var sceneCvs:cc.Node = cc.director.getScene().getChildByName("Canvas");
        if(sceneCvs ){
            var scene:SceneBase = sceneCvs.getComponent(SceneBase);
            return scene;
        }else{
            return null;
        }
    }

    //切换场景
    public changeScene(name:string,complete?:Function){
        console.log("切换场景："+name);
        cc.director.loadScene(name, () => {
            console.log("加载场景结束："+name);
            let node = cc.director.getScene().getChildByName('Canvas');
            var scene:SceneBase = node.getComponent(SceneBase)
            if(scene){
                this._curScene = scene;
                this._curSceneName = name;
            }
            
            complete&&complete();
            EVENT.emit(GameEvent.Scene_Change_Complete,{name:name})
        });
    }
}

export var SCENE = SceneManager.getInstance();