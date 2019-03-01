import { SRewardInfo } from "../net/msg/MsgLogin";

export default class ActivityAssist{
    private static _instance: ActivityAssist = null;
    public static getInstance(): ActivityAssist {
        if (ActivityAssist._instance == null) {
            ActivityAssist._instance = new ActivityAssist();
            
        }
        return ActivityAssist._instance;
    }

    public senvendayRewardId:number =0;
    public senvendayRewardRecevie:boolean = false;
    
    public initSenvenday(sSenvenday:SRewardInfo){
        this.senvendayRewardId = sSenvenday.rewardId;
        this.senvendayRewardRecevie = sSenvenday.isReceived;
    }
}

export var Activity:ActivityAssist = ActivityAssist .getInstance();
    