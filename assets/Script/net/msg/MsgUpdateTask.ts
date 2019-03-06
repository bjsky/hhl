import MessageBase from "./MessageBase";
import NetConst from "../NetConst";
import { STaskInfo, STaskProgressInfo } from "./MsgLogin";
import { Task } from "../../module/TaskAssist";
import { CFG } from "../../manager/ConfigManager";
import { ConfigConst } from "../../module/loading/steps/LoadingStepConfig";


export class CSUpdateTask{
    //每日任务id
    public taskId:number = 0;   
    //已完成次数
    public finishNum:number = 0;

}

export class SCUpdateTask{
    //任务数据(活跃度，进度变更)
    public taskInfo:STaskInfo = null;

    public static parse(obj:any):SCUpdateTask{
        var info:SCUpdateTask = new SCUpdateTask();
        info.taskInfo = STaskInfo.parse(obj.taskInfo);
        return info;
    }
}
//更新任务进度
export default class MsgUpdateTask extends MessageBase{
    public param:CSUpdateTask;
    public resp:SCUpdateTask;

    constructor(){
        super(NetConst.UpdateTask);
        // this.isLocal = true;
    }

    public static create(taskId:number,num:number){
        var msg = new MsgUpdateTask();
        msg.param = new CSUpdateTask();
        msg.param.taskId = taskId;
        msg.param.finishNum = num;
        return msg;
    }

    public respFromLocal(){
        var info:STaskInfo = Task.taskInfo.cloneServerInfo();
        var taskProgress:STaskProgressInfo;
        for(var i:number =0;i<info.taskProgresses.length;i++){
            if(info.taskProgresses[i].taskId == this.param.taskId){
                taskProgress = info.taskProgresses[i];
                break;
            }
        }
        if(!taskProgress){
            taskProgress =new STaskProgressInfo();
            taskProgress.taskId = this.param.taskId;
            info.taskProgresses.push(taskProgress);
        }
        taskProgress.finishNum = this.param.finishNum;
        var score:number = Number(CFG.getCfgDataById(ConfigConst.Task,this.param.taskId).taskScore);
        info.activeScore+= score;
        var json:any ={taskInfo:info};
        return this.parse(json);
    }
    private parse(obj:any):MessageBase{
        this.resp = SCUpdateTask.parse(obj);
        return this;
    }
    public respFromServer(obj:any):MessageBase{
        return this.parse(obj);
    }
}