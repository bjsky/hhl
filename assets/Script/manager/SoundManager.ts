
export default class SoundManager{

    private _bgVolume:number = 0.8;
    private _volume:number = 1;

    // private _musicSwitch:boolean = true;
    private _bgMusicSwitch:boolean = true;

    private _clipMaps:any ={};

    private static _instance: SoundManager = null;
    public static getInstance(): SoundManager {
        if (SoundManager._instance == null) {
            SoundManager._instance = new SoundManager();
            
        }
        return SoundManager._instance;
    }
    
    public getBgMusicSwitch() {
        return this._bgMusicSwitch;
    }

    // public getMusicSwitch() {
    //     return this._musicSwitch;
    // }

    public SetBgMuiscOpenClose() {
        this._bgMusicSwitch = !this._bgMusicSwitch;
        if (this._bgMusicSwitch) {
            this.resumeMusic();
        }else {
            this.pauseMusic();
        }
        let val = this._bgMusicSwitch ? 1 : 0;
    }

    // public SetMuiscOpen() {
    //     this._musicSwitch = !this._musicSwitch;
    //     let val = this._musicSwitch ? 1 : 0;
    // }

    private _currentOnceId:number = NaN;
    private _loadingEffect:boolean = false;
    private playEffectSound(path:string){
        if (this._bgMusicSwitch == false ||this._loadingEffect){
            return;
        }
        if(!isNaN(this._currentOnceId)){
            cc.audioEngine.stop(this._currentOnceId);
        }
        if(this._clipMaps[path]){
            this._currentOnceId = cc.audioEngine.play(this._clipMaps[path],false,this._volume);
        }else{
            this._loadingEffect = true;
            cc.loader.loadRes(path, cc.AudioClip, (err, clip)=>{
                this._currentOnceId = cc.audioEngine.play(clip,false,this._volume);
                this._clipMaps[path] = clip;
                this._loadingEffect = false;
                console.log("sound start:",this._currentOnceId,path);
            });
        }
    }

    private _currentBgId:number = NaN;
    private _loadingMusic:boolean = false;
    private playMusicSound(path:string){
        if (this._bgMusicSwitch == false ||this._loadingMusic){
            return;
        }
        if(!isNaN(this._currentBgId)){
            cc.audioEngine.stop(this._currentBgId);
        }
        if(this._clipMaps[path]){
            this._currentBgId = cc.audioEngine.play(this._clipMaps[path],true,this._bgVolume);
        }else{
            this._loadingMusic = true;
            cc.loader.loadRes(path, cc.AudioClip, (err, clip)=>{
                this._currentBgId = cc.audioEngine.play(clip,true,this._bgVolume);
                this._clipMaps[path] = clip;
                this._loadingMusic = false;
                console.log("music start:",this._currentBgId,path);
            });
        }
    }

    public resumeMusic(){
        if(isNaN(this._currentBgId)){
            this.playMusicSound(SoundConst.Bg_sound);
        }else{
            cc.audioEngine.resume(this._currentBgId);
            console.log("music resume:",this._currentBgId);
        }
    }

    public pauseMusic(){
        if(!isNaN(this._currentBgId)){
            cc.audioEngine.pause(this._currentBgId);
            console.log("music pause:",this._currentBgId);
        }
    }
    /**
     * 播放按钮声音
     */
    public playBtnSound(){
        this.playEffectSound(SoundConst.Btn_sound);
    }
    public playGetCardSound(){
        this.playEffectSound(SoundConst.Card_sound);
    }
    public playFightWinSound(){
        this.playEffectSound(SoundConst.Fight_win_sound);
    }
    public playFightFailSound(){
        this.playEffectSound(SoundConst.Fight_lose_sound);
    }
    public playFighthitSound(){
        this.playEffectSound(SoundConst.Fight_hit_sound);
    }
    public playFightSkillSound(){
        this.playEffectSound(SoundConst.Fight_skill_sound);
    }
    public playBgSound(){
        this.playMusicSound(SoundConst.Bg_sound);
    }
    public playFightBgSound(){
        this.playMusicSound(SoundConst.Fight_sound);
    }
}

export class SoundConst {
    public static Card_sound:string ="sound/getcard"
    public static Btn_sound:string ="sound/dianji";
    public static Bg_sound:string ="sound/bgmusic";
    public static Fight_sound:string ="sound/fightbgm";
    public static Fight_win_sound:string ="sound/fightwin";
    public static Fight_lose_sound:string ="sound/fightlose";
    public static Fight_hit_sound:string ="sound/fighthit";
    public static Fight_skill_sound:string = "sound/skill";
}

export var SOUND = SoundManager.getInstance();