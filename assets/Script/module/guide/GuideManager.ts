import GuideInfo from "../../model/GuideInfo";

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

    private _isINGuide:boolean = false;
    public get isInGuide(){
        return this._isINGuide;
    }

    public initGuide(data:any){
        this.guideInfo.initFromServer(data);

        if(this.guideInfo.guideId != -1){
            this._isINGuide = true;
        }else{
            this._isINGuide = false;
        }
    }
}

export var GUIDE = GuideManager.getInstance();

