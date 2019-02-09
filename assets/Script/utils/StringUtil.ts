export default class StringUtil{
    /**
     * 格式化字符串  XXX ==> X.X(M)
     * @param num 
     * 
     */
    public static formatReadableNumber(value: any,i:number=3, n:boolean=false): string {
        var num:number = Number(value);
        if(isNaN(Number(num))){
            return "";
        }
        var ret:string;
        if (num >= Math.pow(10,14)) {
            ret = Number(num * 0.000000000001).toFixed(0) + "T";
        }
        else if (num >= Math.pow(10,13) && num < Math.pow(10,14)) {
            ret = Number(num * 0.000000000001).toFixed(1) + "T";
        }
        else if (num >= Math.pow(10,12) && num < Math.pow(10,13)) {
            ret = Number(num * 0.000000000001).toFixed(2) + "T";
        }
        else if (num >= Math.pow(10,11) && num < Math.pow(10,12)) {
            ret = Number(num * 0.000000001).toFixed(0) + "B";
        }
        else if (num >= Math.pow(10,10) && num < Math.pow(10,11)) {
            ret = Number(num * 0.000000001).toFixed(1) + "B";
        }
        else if (num >= Math.pow(10,9) && num < Math.pow(10,10)) {
            ret = Number(num * 0.000000001).toFixed(2) + "B";
        }
        else if (num >= Math.pow(10,8) && num < Math.pow(10,9)) {
            ret = Number(num * 0.000001).toFixed(0) + "M";
        }
        else if (num >= Math.pow(10,7) && num < Math.pow(10,8)) {
            ret = Number(num * 0.000001).toFixed(1) + "M";
        }
        else if (num >= Math.pow(10,6) && num < Math.pow(10,7)) {
            ret = Number(num * 0.000001).toFixed(2) + "M";
        }
        else if (num >= Math.pow(10,5) && num < Math.pow(10,6)) {
            ret = Number(num * 0.001).toFixed(0) + "K";
        }
        else if (num >= Math.pow(10,4) && num < Math.pow(10,5)) {
            ret = Number(num * 0.001).toFixed(1) + "K";
        }
        else if (num >= Math.pow(10,3) && num < Math.pow(10,4)) {
            ret = Number(num * 0.001).toFixed(2) + "K";
        }else{
            ret = Number(num).toFixed(0) + "";
        }
        return ret;
    }
    /**
     * 格式化时间 dd 00:00:00
     * @param seconds 秒
     * @param len 长度 4:天：小时：分：秒，3：小时：分：秒,2:分：秒,1: 秒
     */
    public static formatTimeHMS(seconds: number,len:number=3): string {
        var result: string = "";
        var hour: number = 0;
        hour = Math.floor(seconds / 3600);
        var hourTotal: number = hour;
        var day: number = 0;
        if (hour >= 24) {
            day = Math.floor(Math.floor(hour / 24));
            hour -= day * 24;
        }
        var minute: number = 0;
        minute = Math.floor((seconds - hourTotal * 3600) / 60);
        var second: any = Number(seconds - hourTotal * 3600 - minute * 60);
        if (day > 0)
            result += day + "d ";
        else if(len>3)
            result += "0d:"
        if (hour > 0)
            result += StringUtil.padNumber(hour) + ":";
        else if(len>2)
            result += "00:";
        if (minute > 0)
            result += StringUtil.padNumber(minute) + ":";
        else if(len>1)
            result += "00:";
        result += StringUtil.padNumber(second);
        return result;
    }
    public static padNumber(num: number, length: number = 2): string {
        return StringUtil.leftPad(String(num), length, '0');
    }
    public static leftPad(source: string, targetLength: number, padChar: string = " "): string {
        if (source.length < targetLength) {
            var padding: string = "";
            while (padding.length + source.length < targetLength)
                padding += padChar;
            return padding + source;
        }
        return source;
    }
    /**
     * 格式化字符串 xxxx ==> x,xxx
     * @param num 
     * 
     */
    public static formatNumber(num: number): string {
        var sign: boolean = true;
        var orig: string = String(num);
        if (num < 1000) {
            if (!sign)
                orig = '-' + orig;
            return orig;
        }
        var result: string = "";
        var dotindex: number = orig.indexOf('.');
        var len: number = 0, remainder: number = 0, nowindex: number = 0;
        if (dotindex >= 0) {
            len = dotindex;
            remainder = len % 3;
            if (remainder > 0)
                result += orig.slice(0, remainder) + ',';
            nowindex = remainder;
            while (nowindex < len) {
                result += orig.slice(nowindex, nowindex + 3);
                nowindex += 3;
                if (nowindex < len)
                    result += ',';
            }
            result += orig.slice(dotindex, -1);
        }
        else {
            len = orig.length;
            remainder = len % 3;
            if (remainder > 0)
                result += orig.slice(0, remainder) + ',';
            nowindex = remainder;
            while (nowindex < len) {
                result += orig.slice(nowindex, nowindex + 3);
                nowindex += 3;
                if (nowindex < len)
                    result += ',';
            }
        }
        if (!sign)
            result = '-' + result;
        return result;
    }
    //获取一个uuid
    public static getUUidClient():string{
        var uuid = new Date().getTime()+ Number(Math.random()*1000000).toFixed(0);
        return uuid;
    }
}