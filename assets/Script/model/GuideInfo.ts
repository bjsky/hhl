import InfoBase from "./InfoBase";
import { SGuideInfo } from "../net/msg/MsgLogin";

export default class GuideInfo extends InfoBase{
    //引导步骤
    public guideId:number = -1;  //-1:引导完成

    public initFromServer(data:SGuideInfo){
        this.guideId = data.guideId;
    }
    
}