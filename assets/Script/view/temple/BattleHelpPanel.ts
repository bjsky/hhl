
import PopUpBase from "../../component/PopUpBase";
import { Battle } from "../../module/battle/BattleAssist";

const {ccclass, property} = cc._decorator;

@ccclass
export default class battleHelpPanel extends PopUpBase {
    

    // update (dt) {}

    @property(cc.RichText)
    richScore:cc.RichText = null;

    onEnable(){
        super.onEnable();
        
        var scoreText:string = "";
        var scoreTpeMap = Battle.scoreTypeCfgMap; 
        for(var key in scoreTpeMap){
            var cfg = scoreTpeMap[key].type;
            
            var scoreAreaStr:string ="";
            if(Number(cfg.scoreMax) == 0){
                scoreAreaStr = "大于"+cfg.scoreMin;
            }else{
                scoreAreaStr = cfg.scoreMin+ "-"+cfg.scoreMax;
            }
            scoreText += ("[<color=#D43F97>"+cfg.scoreName+"</c>] 积分<color=#29b92f>"+scoreAreaStr+"</c>"+
            "，经验：<color=#29b92f>"+cfg.getExp+"</c>，钻石：<color=#29b92f>"+cfg.getDiamond+"</c><br />")
        }
        
        this.richScore.string = "<color=#D42834>" +scoreText+"</c>";
    }
}
