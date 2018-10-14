export class HttpRequest
{
    private static _inst:HttpRequest;
    public static getInst(){
        return this._inst ||(this._inst=new HttpRequest())
    }

    private constructor() {

    }

    private quest(option, callback) {
        let url = option.url;
        let method = option.method;
        let data = option.data;
        let timeout = option.timeout || 3000;
    
        let xhr = new XMLHttpRequest();
        (timeout > 0) && (xhr.timeout = timeout);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status >= 200 && xhr.status < 400) {
                let result = xhr.responseText;
                try {result = JSON.parse(xhr.responseText);} catch (e) {}
                    callback && callback({state:xhr.status,data:result});
                } else {
                    callback && callback({state:xhr.status});
                }
            }
        }.bind(this);
        xhr.open(method, url, true);
        xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded;charset=UTF-8');

        if(typeof data === 'object'){
            try{
                data = JSON.stringify(data);
            }catch(e){}
        }
        xhr.send(data);
        xhr.ontimeout = function () {
            callback && callback({state:-1});
            console.log('%c连%c接%c超%c时', 'color:red', 'color:orange', 'color:purple', 'color:green');
        };
    };
    public get(url, callback) {
        let option = url.url ? url : { url: url };
        option.method = 'get';
        this.quest(option, callback);
    };
    
    public post(option, callback) {
        option.method = 'post';
        this.quest(option, callback);
    };
}

export var HTTP = HttpRequest.getInst();