
export default class GuideManager{
    private static _instance: GuideManager = null;
    public static getInstance(): GuideManager {
        if (GuideManager._instance == null) {
            GuideManager._instance = new GuideManager();
            
        }
        return GuideManager._instance;
    }

    private _isINGuide:boolean = false;
    public get isInGuide(){
        return this._isINGuide;
    }
}

export var GUIDE = GuideManager.getInstance();

