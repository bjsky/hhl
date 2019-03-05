import DListItem from "../../component/DListItem";
import { TaskProgressInfo } from "../../model/TaskInfo";

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
export default class TaskItem extends DListItem{

    @property(cc.Label)
    activeScore: cc.Label = null;
    @property(cc.Label)
    desc: cc.Label = null;

    @property(cc.Button )
    btnGoto: cc.Button = null;
    @property(cc.RichText)
    lablNum: cc.RichText = null;


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    private _taskPro:TaskProgressInfo = null;
    public setData(data:any){
        super.setData(data);
        this._taskPro = data as TaskProgressInfo;
        
    }

    start () {

    }

    onEnable(){
        super.onEnable();
        this.initView();
    }

    onDisable(){
        super.onDisable();
        
    }

    private _finishNum :number = 0;
    private initView(){
        this.activeScore.string = (this._taskPro.taskScore).toString();
        this.desc.string = this._taskPro.taskDesc;
        this._finishNum = this._taskPro.finishNum;
        if(this._finishNum>=this._taskPro.taskCount){
            this._finishNum = this._taskPro.taskCount;
            this.lablNum.string = "<color=#92501B>已完成</c>";
            this.lablNum.node.x = 276;
        }else{
            this.lablNum.string = "<color=#92501B><color=#F3ED4A>"+this._finishNum+"</c>/"+this._taskPro.taskCount+"</c>";
            this.lablNum.node.x = 163;
        }
        this.btnGoto.node.active = this._finishNum<this._taskPro.taskCount;
    }

    // update (dt) {}
}
