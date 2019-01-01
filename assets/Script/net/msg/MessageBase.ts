export enum PropertyTypeEnum{
    PNmber = 0,
    PString ,
    PArray,
}
export default class MessageBase {

    public id:number = -1;
    public param:any = null;
    public resp:any = null;

    constructor(_id:number){
        this.id = _id;
    }

    public isLocal:boolean  = false;

    //本地数据回调
    public respFromLocal():any{
        return null;
    }

    //服务器数据回调
    public respFromServer(obj:any):any{
        return null;
    }

}
