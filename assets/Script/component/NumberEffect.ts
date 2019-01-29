import StringUtil from "../utils/StringUtil";


const {ccclass, property} = cc._decorator;

@ccclass
export default class NumberEffect extends cc.Component{

    @property(cc.Label)
    label:cc.Label = null;
    
    @property()
    format:number = 0;

    private _curValue:number = NaN;
    private _complete:Function = null;
    public setValue(value:number,anim:boolean = true,complete?:Function){
        value = Number(value);
        this._complete = complete;
        if(!isNaN(this._curValue) && value!=this._curValue && anim){
            this._toValue = value;
            this._speed = (this._toValue - this._curValue)/this._aspeed;
            this._isUpdating = true;
        }else{
            this._curValue = value;
            var showValue:string = this._curValue.toFixed(0).toString();
            this.label.string = (this.format == 1?StringUtil.formatReadableNumber(value):showValue);
        }
    }

    private _isUpdating:boolean = false;
    private _speed:number =1;
    private _aspeed:number =20;
    private _toValue:number;

    update (dt) {
        if(!this._isUpdating)
            return;
        
        this._curValue += this._speed;
        if(this._speed>0){
            if(this._curValue>this._toValue){
                this._curValue = this._toValue;
                this._isUpdating = false;
                this._complete && this._complete();
            }
        }else{
            if(this._curValue<this._toValue){
                this._curValue = this._toValue;
                this._isUpdating = false;
                this._complete && this._complete();
            }
        }
        var showValue:string = this._curValue.toFixed(0).toString();
        this.label.string = (this.format == 1?StringUtil.formatReadableNumber(this._curValue):showValue);
    }

    public stop(){
        this._isUpdating = false;
    }
}