import LineupInfo from "../../model/LineupInfo";
import { UI } from "../../manager/UIManager";
import { ResConst } from "../../module/loading/steps/LoadingStepRes";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class LineUpUI extends cc.Component {

    @property(cc.Label)
    labelPower: cc.Label = null;

    @property(cc.Node)
    nodeHead0: cc.Node = null;
    @property(cc.Node)
    nodeHead1: cc.Node = null;
    @property(cc.Node)
    nodeHead2: cc.Node = null;
    @property(cc.Node)
    nodeHead3: cc.Node = null;
    @property(cc.Node)
    nodeHead4: cc.Node = null;



    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    private _lineupInfos:Array<LineupInfo> = [];
    private _totalPower:number = 0;

    private getPosLineup(pos:number,arr?:LineupInfo[]):LineupInfo{
        for(var i:number = 0;i<arr.length;i++){
            if(arr[i].pos == pos){
                return arr[i];
            }
        }
        return null;
    }

    public updateLineup(arr:Array<LineupInfo>){
        if(this._lineupInfos.length == 0){
            for(var i:number = 0;i<5;i++){
                this.updateIndex(i,arr);
            }
        }else{
            for(i = 0;i<5;i++){
                var lineup = this.getPosLineup(i,arr);
                var oldLineup = this.getPosLineup(i,this._lineupInfos);
                if((lineup && !oldLineup)
                    ||(oldLineup && !lineup)
                    ||(oldLineup && lineup && !lineup.equalTo(oldLineup))){
                        this.updateIndex(i,arr)
                    }
            }
        }
        this._lineupInfos = arr;
        this.updateTotalPower();
    }

    private updateIndex(index:number,arr:LineupInfo[]){
        console.log("update lineupIndex:"+index);
        var node:cc.Node;
        node = this["nodeHead"+index];
        if(node.childrenCount>0){
            UI.removeUI(node.children[0]);
        }
        var lineup:LineupInfo = this.getPosLineup(index,arr);
        if(lineup!=null){
            var upStarObj = {head:lineup.headUrl,grade:lineup.grade,power:lineup.power}
            UI.loadUI(ResConst.CardHead,upStarObj,node);
        }
    }

    private updateTotalPower(){
        var power = 0;
        this._lineupInfos.forEach((lineup:LineupInfo)=>{
            power += Number(lineup.power);
        })
        this._totalPower = power;
        this.labelPower.string = this._totalPower.toString();
    }
    // update (dt) {}
}
