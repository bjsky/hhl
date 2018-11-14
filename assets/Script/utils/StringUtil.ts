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
}