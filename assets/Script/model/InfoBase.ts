export default class InfoBase{

    public parse(obj:any){
        for( var key in this){
            if(obj[key]!=undefined){
                this[key] = obj[key];
            }
        }

        
    }
}