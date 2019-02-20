
export default class SoundManager{

    private _bgVolume:number = 0.8;
    private _volume:number = 1;

    // private _musicSwitch:boolean = true;
    private _bgMusicSwitch:boolean = true;

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
    private playEffectSound(path:string){
        if (this._bgMusicSwitch == false){
            return;
        }
        cc.loader.loadRes(path, cc.AudioClip, (err, clip)=>{
            if(!isNaN(this._currentOnceId)){
                cc.audioEngine.stop(this._currentOnceId);
            }
            this._currentOnceId = cc.audioEngine.play(clip,false,this._volume);
            cc.log("sound start:",this._currentOnceId);
        });
    }

    private _currentBgId:number = NaN;
    private playMusicSound(path:string){
        if (this._bgMusicSwitch == false){
            return;
        }
        cc.loader.loadRes(path, cc.AudioClip, (err, clip)=>{
            if(!isNaN(this._currentBgId)){
                cc.audioEngine.stop(this._currentBgId);
            }
            this._currentBgId = cc.audioEngine.play(clip,true,this._bgVolume);
            cc.log("music start:",this._currentBgId);
        });
    }

    public resumeMusic(){
        if(isNaN(this._currentBgId)){
            this.playMusicSound(SoundConst.Bg_sound);
        }else{
            cc.audioEngine.resume(this._currentBgId);
            cc.log("music resume:",this._currentBgId);
        }
    }

    public pauseMusic(){
        if(!isNaN(this._currentBgId)){
            cc.audioEngine.pause(this._currentBgId);
            cc.log("music pause:",this._currentBgId);
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