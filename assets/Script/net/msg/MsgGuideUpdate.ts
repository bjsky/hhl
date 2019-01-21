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

    public static parse(obj:any):SCGuideUpdate{
        var data:SCGuideUpdate = new SCGuideUpdate();
        data.nextGuideId = obj.nextGuideId;
        return data;
    }
}

export default class MsgGuideUpdate extends MessageBase{
    public param:CSGuideUpdate;
    public resp:SCGuideUpdate;

    constructor(){
        super(NetConst.GuideUpdate);
        this.isLocal = true;
    }

    public static create(guideId:number){
        var msg = new MsgGuideUpdate();
        msg.param = new CSGuideUpdate();
        msg.param.currentGuideId = guideId;
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
        return this.parse(json);
    }

    private parse(obj:any):MessageBase{
        this.resp = SCGuideUpdate.parse(obj);
        return this;
    }
    public respFromServer(obj:any):MessageBase{
        return this.parse(obj);
    }
}