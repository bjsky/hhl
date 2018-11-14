import InfoBase from "./InfoBase";
import { SGuideInfo } from "../net/msg/MsgLogin";
import { GUIDE } from "../module/guide/GuideManager";
import { CFG } from "../manager/ConfigManager";
import { ConfigConst } from "../module/loading/steps/LoadingStepConfig";

export default class GuideInfo extends InfoBase{
    //引导步骤
    public guideId:number = -1;  //-1:引导完成

    //引导名
    public guideName:string ="";
    //下一个引导id
    public nextId:number = -1;
    //引导类型
    public type:number = 0;
    //npc名
    public npc:string ="";
    //npcicon
    public npcIcon:string ="";
    //npc方向
    public npcDic:number = 0;
    //内容
    public content:string ="";
    //箭头方向
    public arrowDir:number = 0;
    //节点名
    public nodeName:string ="";


    public initFromServer(data:SGuideInfo){
        this.guideId = data.guideId;

        var info = CFG.getCfgDataById(ConfigConst.Guide,this.guideId);
        this.guideName = info.name;
        this.nextId = info.nextId;
        this.npc = info.npc;
        this.npcIcon = info.npcIcon;
        this.npcDic = info.npcDir;
        this.content = info.content;
        this.arrowDir = info.arrowDir;
        this.nodeName = info.node_name;
    }
    
}