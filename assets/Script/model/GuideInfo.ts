import InfoBase from "./InfoBase";
import { SGuideInfo } from "../net/msg/MsgLogin";
import { CFG } from "../manager/ConfigManager";
import { ConfigConst } from "../module/loading/steps/LoadingStepConfig";
import { SCGuideUpdate } from "../net/msg/MsgGuideUpdate";
import { GUIDE } from "../manager/GuideManager";

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
    // 参数
    public params:any = {};


    public initFromServer(data:SGuideInfo){
        this.guideId = data.guideId;

        this.setGuideInfo();
    }

    public setGuideInfo(){
        if(this.guideId>-1){
            var info = CFG.getCfgDataById(ConfigConst.Guide,this.guideId);
            this.guideName = info.name;
            this.nextId = info.nextId;
            this.type = info.type;
            this.npc = info.npc;
            this.npcIcon = info.npcIcon;
            this.npcDic = info.npcDir;
            this.content = info.content;
            this.arrowDir = info.arrowDir;
            this.nodeName = info.node_name;
            this.params = this.parseParams(info.param);
        }else{
            this.guideName = "";
            this.nextId = -1;
            this.type  =0;
            this.npc = "";
            this.npcIcon ="";
            this.npcDic = 0;
            this.content ="";
            this.arrowDir = 0;
            this.nodeName = "";
            this.params = null;
        }


        if(this.guideId != -1){
            GUIDE.isInGuide = true;
        }else{
            GUIDE.isInGuide = false;
        }
    }

    private parseParams(paramstr:string){
        if(paramstr == undefined || paramstr == ""){
            return null;
        }else{
            var param:any = {};
            var params:string[] = paramstr.split(",");
            for(var i = 0;i<params.length ;i++){
                var cp:string[] = params[i].split("=");
                if(cp.length == 2){
                    param[cp[0]] = cp[1];
                }
            }

            return param;
        }
    }

    public updateGuide(data:SCGuideUpdate){
        this.guideId = data.nextGuideId;

        this.setGuideInfo();
    }
    
}