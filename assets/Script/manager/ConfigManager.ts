
export default class ConfigManager{

    private static _instance: ConfigManager = null;
    public static getInstance(): ConfigManager {
        if (ConfigManager._instance == null) {
            ConfigManager._instance = new ConfigManager();
            
        }
        return ConfigManager._instance;
    }
    private _cfgMap:any = {};
    public parseCfg(key: string,config:any) {
        var obj = {};
        config.json.forEach(item => {
            obj[item["id"]] = item;
        });
        this._cfgMap[key] = obj;
    }

    /**
     * 
     * @param cfgName 配置表名
     * @returns 配置表json对象
     */
    public getCfgGroup(cfgName:string):any{
        return this._cfgMap[cfgName];
    }

    /**
     * 
     * @param cfgName 配置表名
     * @param id 数据id
     * @returns 数据项
     */
    public getCfgDataById(cfgName:string,id:any):any{
        var sid:string = String(id);
        var data:any = this.getCfgGroup(cfgName);
        return data[sid];
    }
    /**
     * 根据属性对应的值取数据
     * @param cfgName  表名
     * @param args  key,value,key,value....
     */
    public getCfgByKey(cfgName:string,...args):Array<any>
    {
        let len = args.length
        if(len%2!=0)
        {
            console.log("cfg.getCfgByKey所需参数不是完整的key-value")
            return;
        }
        let dic:any = this.getCfgGroup(cfgName);
        let obj:any;
        let arr:Array<any> =[];
        for(let key in dic){
            obj = dic[key];
            let ret:boolean = true;
            for(let i = 0;i<len;i++)
            {
                if(obj[args[i]]!=args[++i])
                {
                    ret = false;
                    break;
                }
            }
            if(ret)
            {
                arr.push(obj);
            }
         }
         return arr;
       

    }
}

export var CFG = ConfigManager.getInstance();