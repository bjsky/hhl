import GuideInfo from "../../model/GuideInfo";
import { UI } from "../../manager/UIManager";
import GuideStory from "./GuideStory";

export enum GuideTypeEnum {
    GuideStory = 1,
    GuideTalk = 2,
    GuideArrow = 3

}


export default class GuideManager{
    private static _instance: GuideManager = null;
    public static getInstance(): GuideManager {
        if (GuideManager._instance == null) {
            GuideManager._instance = new GuideManager();
            
        }
        return GuideManager._instance;
    }

    //引导数据
    public guideInfo:GuideInfo = new GuideInfo();
    
    public guideStory:GuideStory = null;

    private _isINGuide:boolean = false;
    public get isInGuide(){
        return this._isINGuide;
    }
    public set isInGuide(bool:boolean){
        this._isINGuide = bool;
    }

    public initGuide(data:any){
        this.guideInfo.initFromServer(data);
    }

    public startGuide(){
        if(this.guideInfo.type == GuideTypeEnum.GuideStory){
            if(this.guideStory == null){
                this.guideStory = new GuideStory();
            }
            this.guideStory.show(this.guideInfo);
        }
    }

    public nextGuide(){
        this.startGuide();
    }


    
}

export var GUIDE = GuideManager.getInstance();

