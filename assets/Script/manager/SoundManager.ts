
export default class SoundManager{

    private _bgVolume:number = 1;

    private _musicSwitch:boolean = false;
    private _bgMusicSwitch:boolean = false;

    private static _instance: SoundManager = null;
    public static getInstance(): SoundManager {
        if (SoundManager._instance == null) {
            SoundManager._instance = new SoundManager();
            
        }
        return SoundManager._instance;
    }
    /**
     * 播放按钮声音
     */
    public playBtnSound(){
        this.playSoundOnce(SoundConst.Btn_sound);
    }

    public playSoundOnce(path:string){
        var self = this;
        if (this._bgMusicSwitch == false) {
            return;
        }
        cc.loader.loadRes(path, cc.AudioClip, function (err, clip) {
            cc.audioEngine.play(clip,false,self._bgVolume);
        });
    }

    public getBgMusicSwitch() {
        return this._bgMusicSwitch;
    }

    public getMusicSwitch() {
        return this._musicSwitch;
    }

    public SetBgMuiscOpen() {
        this._bgMusicSwitch = !this._bgMusicSwitch;
        if (this._bgMusicSwitch) {
            this.resumeBgSound();
        }else {
            this.stopBgSound();
        }
        let val = this._bgMusicSwitch ? 1 : 0;
    }

    public SetMuiscOpen() {
        this._musicSwitch = !this._musicSwitch;
        let val = this._musicSwitch ? 1 : 0;
    }

    private _currentSoundId:number = NaN;
    private _loadBgSound:boolean = false;
    /**
     * 播放背景音乐
     */
    public playBgSound(soundName:string = SoundConst.Bg_sound)
    {
        if ( this._bgMusicSwitch == false || this._loadBgSound) {
            return;
        }
        
        if(!isNaN(this._currentSoundId)){
            cc.audioEngine.stop(this._currentSoundId);
        }
        var self = this;
        this._loadBgSound = true;
        cc.loader.loadRes(soundName, cc.AudioClip, (err, clip) =>{
            this._loadBgSound = false;
            this._currentSoundId = cc.audioEngine.play(clip,true,self._bgVolume);
            cc.log("music start:",this._currentSoundId);
        });
    }

    public resumeBgSound()
    {
        if(!isNaN(this._currentSoundId)){
            cc.audioEngine.resume(this._currentSoundId);
            cc.log("music resume:",this._currentSoundId);
        }else{
            this.playBgSound(SoundConst.Bg_sound);
        }
    }

    public stopBgSound()
    {
        if(!isNaN(this._currentSoundId))
        {
            cc.audioEngine.pause(this._currentSoundId);
            cc.log("music pause:",this._currentSoundId);
        }
    }

    public playGetCardSound(){
        this.playSoundOnce(SoundConst.Card_sound);
    }
    public playFightWinSound(){
        this.playSoundOnce(SoundConst.Fight_win_sound);
    }
    public playFightFailSound(){
        this.playSoundOnce(SoundConst.Fight_fail_sound);
    }
    public playFighthitSound(){
        this.playSoundOnce(SoundConst.Fight_hit_sound);
    }
    public playFightSkillSound(){
        this.playSoundOnce(SoundConst.Fight_skill_sound);
    }
}

export class SoundConst {
    public static Card_sound:string ="sound/getcard"
    public static Btn_sound:string ="sound/dianji";
    public static Bg_sound:string ="sound/bgmusic";
    public static Fight_sound:string ="sound/fightbgm";
    public static Fight_win_sound:string ="sound/fightwin";
    public static Fight_fail_sound:string ="sound/fightfailed";
    public static Fight_hit_sound:string ="sound/fighthit";
    public static Fight_skill_sound:string = "sound/skill";
}

export var SOUND = SoundManager.getInstance();