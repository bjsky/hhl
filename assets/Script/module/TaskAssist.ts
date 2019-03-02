import { STaskInfo } from "../net/msg/MsgLogin";
import TaskInfo, { GrowRewardType } from "../model/TaskInfo";

export default class TaskAssist{
    private static _instance: TaskAssist = null;
    public static getInstance(): TaskAssist {
        if (TaskAssist._instance == null) {
            TaskAssist._instance = new TaskAssist();
            
        }
        return TaskAssist._instance;
    }

    public taskInfo:TaskInfo = new TaskInfo();
    public initTask(sTask:STaskInfo):void{

        this.taskInfo.initFormServer(sTask);
    }
}

export var Task:TaskAssist = TaskAssist.getInstance();