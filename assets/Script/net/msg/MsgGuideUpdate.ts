import MessageBase from "./MessageBase";
import NetConst from "../NetConst";
import { CFG } from "../../manager/ConfigManager";
import { ConfigConst } from "../../module/loading/steps/LoadingStepConfig";

/**
 * 更新引导id
 */
export class CSGuideUpdate{
    public currentGuideId:number = 0;
}

export class SCGuideUpdate{
    public nextGuideId:number = 0;
}

export default class MsgGuideUpdate extends MessageBase{
    public param:CSGuideUpdate;
    public resp:SCGuideUpdate;

    constructor(guideId:number){
        super(NetConst.GuideUpdate);

        this.param = new CSGuideUpdate();
        this.param.currentGuideId = guideId;
    }

    public static createLocal(guideId:number){
        var msg = new MsgGuideUpdate(guideId);
        msg.isLocal = true;
        return msg;
    }

    public respFromLocal(){
        var info:any = CFG.getCfgDataById(ConfigConst.Guide, this.param.currentGuideId);
        var json:any;
        if(info){
            json = {nextGuideId:info.nextId
            };
        }else{
            json = {nextGuideId:-1
            };
        }
        
        this.resp = this.parse(json);
        return this;
    }

    protected parse(obj:any){
        var data:SCGuideUpdate = new SCGuideUpdate();
        data.nextGuideId = obj.nextGuideId;
        return data;
    }
}