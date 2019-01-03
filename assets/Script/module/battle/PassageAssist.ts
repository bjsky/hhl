import { SPassageInfo } from "../../net/msg/MsgLogin";
import PassageInfo from "../../model/PassageInfo";

export default class PassageAssist{

    private static _instance: PassageAssist = null;
    public static getInstance(): PassageAssist {
        if (PassageAssist._instance == null) {
            PassageAssist._instance = new PassageAssist();
            
        }
        return PassageAssist._instance;
    }

    public passageInfo:PassageInfo = new PassageInfo();

    public initPassageInfo(info:SPassageInfo){
        this.passageInfo.initFromServer(info);
    }
}

export var Passage = PassageAssist.getInstance();

