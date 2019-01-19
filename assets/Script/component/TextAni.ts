import { COMMON } from "../CommonData";


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
export default class TextAni extends cc.Component {
    @property (cc.RichText)
    htmltext:cc.RichText = null;
    
    private html:string = '';
    private step:number = 0;
    private showContend:string = "";
    private textColor:string ="";
        
    /**
     * 添加文字打字机效果
     * 
     */
    public addTypewriterAni(content:string, cb:Function, color:string, interval:number = 120):void
    {
        this.showContend = content;
        this.textColor = color;

        var arr = content.split('');
        var len:number = arr.length;
        var func = ()=> {
            if(arr[this.step] == "#"){
                arr[this.step] = "<color=#33FF00>" + COMMON.userInfo.name +"</color> ";
            }
            if(arr[this.step] == "$"){
                arr[this.step] = "<br/>";
            }
            
            this.html += arr[this.step];
            this.htmltext.string ="<color="+this.textColor+">"+this.html+"</color>";
            // console.log(this.htmltext.string,this.htmltext.node.color);
            if (++this.step == len) {
                this.htmltext.unschedule(func);
                this.step = 0;
                this.html = "";
                this.showContend = "over";
                cb();
            }
        }
        this.htmltext.schedule(func,interval/1000, cc.macro.REPEAT_FOREVER, 0)
    }
    
    
    public speedTypewriterAni(content:string, cb:Function, interval:number = 20):void{
        if(this.showContend != "over"){
            var arr = content.split('');
            var len:number = arr.length;
            var func = ()=> {
                if(arr[this.step] == "#"){
                    arr[this.step] = "<color= '#FF0000'>" + COMMON.userInfo.name +"</color>  "
                }
                if(arr[this.step] == "$"){
                    arr[this.step] = "<br/>";
                }
                this.html += arr[this.step];
                this.htmltext.string = "<color="+this.textColor+">"+this.html+"</color>";
                // console.log(this.htmltext.string,this.htmltext.node.color);
                if (++this.step == len) {
                    this.htmltext.unschedule(func);
                    this.step = 0;
                    this.html = "";
                    this.showContend = "over";
                    cb();
                }
            }
            this.htmltext.schedule(func,interval/1000, cc.macro.REPEAT_FOREVER, 0)
        }
    }
    
    public removeTypewriterAni():void{
        this.htmltext.unscheduleAllCallbacks();
    }
}