import LoadingStep from "../loadingStep";
import { LoadingStepEnum } from "../LoadingStepManager";

export const ResConst = {
    MainUI:"prefabs/mainUI",
    AlertPanel:"prefabs/alertPanel",
    TipPanel:"prefabs/tipPanel",
    BuildPanel:"prefabs/buildPanel",
    CastlePanel:"prefabs/castlePanel",
    cardSmall:"prefabs/cardSmall",
    cardBig:"prefabs/cardBig",
    cardDescrip:"prefabs/cardDescrip",
    TemplePanel:"prefabs/templePanel",
    HeroPanel:"prefabs/heroPanel",
    BattlePanel:"prefabs/battlePanel",
    LineUpPopup:"prefabs/lineUpPopup",
    BattleHelp:"prefabs/battleHelp",
    GuideTap:"prefabs/guideTap",
    CardHead:"prefabs/cardHead",
    AwardPanel:"prefabs/awardPanel",
    FightPanel:"prefabs/fightPanel",
    CardFight:"prefabs/cardFight",
    BuffNode:"prefabs/buffNode",
    CostTipPanel:"prefabs/costTipPanel",
    FightTip:"prefabs/fightTip",
    FightResult:"prefabs/fightResult",
    resPanel:"prefabs/resPanel",
    sharePanel:"prefabs/sharePanel",
    singleAwardPanel:"prefabs/singleAwardPanel",
    ShareItem:"prefabs/shareItem",
    CardComposeUI:"prefabs/cardCompose",
    StorePanel:"prefabs/storePanel",
    StoreCardItem:"prefabs/storeCardItem",
    RankPanel:"prefabs/rankPanel",
    SevenDayPanel:"prefabs/sevendayPanel",
    TaskPanel:"prefabs/taskPanel",
    FighterDetailPanel:"prefabs/fighterDetail",
    FightRecordPanel:"prefabs/fightRecordPanel",
    BeFightPanel:"prefabs/beFightPanel",
    CardHeadTip:"prefabs/cardHeadTip",
    IntroPanel:"prefabs/introPanel"
}
/**
 * 加载配置
 */
export default class LoadingStepRes extends LoadingStep{
    
    private _resArr:string[];
    private _loadedCount:number = 0;
    private _totalCount:number = 0;
    public doStep(){
        super.doStep();
        this._resArr = [];
        for(var key in ResConst){
            this._resArr.push(ResConst[key]);
        }
        this._totalCount = this._resArr.length;
        this._loadedCount = 0;
        this.loadNext();

    }
    private loadNext(){
        if(this._resArr.length>0){
            cc.loader.loadRes(this._resArr.shift(),(err, prefab) =>{
                if (err) {
                    cc.error(err.message || err);
                    console.log("res load failed!",err.message);
                    return;
                }

                this._loadedCount ++;
                var pro = this._loadedCount *100 /this._totalCount;

                this.updateProgress(pro);
                this.loadNext();
            })
        }else{
            this.setNext(LoadingStepEnum.Scene);
        }
    }
}