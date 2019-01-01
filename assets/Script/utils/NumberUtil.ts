export default class NunmberUtil{

    /**
     * 获得权重随机数
     * @param arr 权重数组
     */
    public static getRandomFromWeightArr(arr:Array<string>){
        
        var totalWeight:number = 0;
        var objs:Array<any> = [];
        arr.forEach(str => {
            var obj:any = {val:str.split(";")[0],weight:Number(str.split(";")[1])};
            objs.push(obj);
            totalWeight+=obj.weight;
        });
        var random:number = (Math.random()*totalWeight);
        var cur:number = 0;
        for(var i = 0;i<objs.length;i++){
            var obj = objs[i];
            cur+=obj.weight;
            if(random <= cur){
                return obj.val;
            }
        }
    }
}