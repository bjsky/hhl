
export default class ResourceManager{

    private static _instance: ResourceManager = null;
    public static getInstance(): ResourceManager {
        if (ResourceManager._instance == null) {
            ResourceManager._instance = new ResourceManager();
            
        }
        return ResourceManager._instance;
    }
    constructor(){
        this._loadParams = {};
        this._loadQueue = [];
    }

    private _downloadUrl:string ="";
    private _resMap:any ={};

    private _loadParams:any;
    private _loadQueue:string[];
    private _loading:boolean = false;
    private _loadName:string;
    private _loadItems:any;

    /**
     * 加载资源
     * @param resources  资源名或资源队列
     * @param complete 资源完成回调
     * @param progress 资源进度回调
     * @param failed   资源失败回调
     */
    public load(resources:string|string[],complete?:Function,progress?:Function,failed?:Function){
        var loadName:string ="";
        if ((typeof resources) === "string") {
            loadName = <string>resources;
            this._loadParams[loadName] = { path: [<string>resources],completeCb:complete,failedCb:failed};
            this._loadQueue.push(loadName);
        } else if (resources instanceof Array) {
            loadName = (<Array<string>>resources).join("_");
            if(this._loadParams[loadName]==undefined){
                this._loadParams[loadName] = {path:<Array<string>>resources,completeCb:complete,progressCb:progress,failedCb:failed};
                this._loadQueue.push(loadName);
            }else{
                console.log("same name load ignored");
            }
        }

        this.loadNext();
    }

    private loadNext(){
        if(!this._loading && this._loadQueue.length>0){
            this._loading = true;
            this._loadName = this._loadQueue.shift();
            this._loadItems = this._loadParams[this._loadName];

            this._loadItems.urls = this._loadItems.path.slice();
            this.checkloadUrls(this._loadItems.urls);

            this._curloadNum = 0;
            this._totalloadNum = this._loadItems.urls.length;
            this._loadCount = 0;
            this.doLoad(this._loadItems.urls);
        }
    }

    private _curloadNum:number = 0;
    private _totalloadNum:number = 0;
    private _loadCount:number = 0;
    private _loadMaxCount:number = 3;
    private doLoad(resList:string[]){
        var self = this;
        cc.loader.load(resList, (completedCount: number, totalCount: number, item: any) => {
            if(item.error) {
                //console.log("加载失败：" + "item.error.status: " + item.error.status + ", "  +item.error.errorMessage + " url: " + item.url);
            } else {
                // 进度
                self._curloadNum += 1;
                let progress = self._curloadNum  * 100 / self._totalloadNum;
                if(self._loadItems["progressCb"]!= undefined){
                    self._loadItems["progressCb"](progress);
                }
            }
        },(errors, results) => {
            if (errors) {
                if(self._loadCount >= self._loadMaxCount){ // 重试三次依然无法下载，网络问题
                    if(self._loadItems["failedCb"]!= undefined){
                        self._loadItems["failedCb"]("资源加载失败，请检查网络:"+ errors);
                    }
                    self.completeLoad();
                }else if(self._loadCount < self._loadMaxCount){
                    self._loadCount += 1; // 计数加1
                    self.doLoad(errors);
                }
		    } else {
                if(self._loadItems["completeCb"]!= undefined){
                    self._loadItems["completeCb"](self._loadItems.path.length==1?self.get(self._loadItems.path):self._loadItems.path);
                }
                self.completeLoad();
            }
        });
    }

    private completeLoad(){
        this._loading = false;
        delete this._loadParams[this._loadName];
        this._loadName = "";
        this._loadItems = null;
        this.loadNext();
    }

    /**
     * 设置资源下载远程路径，没有则为本地
     */
    public set downloadUrl(url) {
        this._downloadUrl = url;
    }

    /**
     * 检查下载资源格式
     * @param resList 
     */
    public checkloadUrls(resList:Array<string>):void
    {
        if(resList instanceof Array) {
            resList.forEach((value:string,idx:number,arr:string[])=>{

                if(value.indexOf("http")<0 && value.indexOf("res/raw-assets/")<0) // 第一次尝试
                {
                    var url:string = this._downloadUrl + cc.url.raw(value) + (this._downloadUrl === "" ? "" : "?v=" + new Date().getTime());
                    arr[idx] = url;
                    this._resMap[value] = url;
                }
               
            }, this)
        }
    }

    /**
     * 获取资源
     * @param resname 资源名、
     */
    public get(resname:string): any {
        let res = null;
        (res = cc.loader.getRes(this._resMap[resname])) ||
        (res = cc.loader.getRes(resname)) 
        return res;
    }
}

export var RES = ResourceManager.getInstance();