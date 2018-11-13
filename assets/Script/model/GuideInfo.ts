
import InfoBase from "./InfoBase";

export default class GuideInfo extends InfoBase{


    public parse(obj:any){
        this.guideId = obj.guideId;
        return this;
    }

    //引导步骤
    public guideId:number = -1;  //-1:引导完成
}