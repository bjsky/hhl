
export default class SceneManager{

    private static _instance: SceneManager = null;
    public static getInstance(): SceneManager {
        if (SceneManager._instance == null) {
            SceneManager._instance = new SceneManager();
            
        }
        return SceneManager._instance;
    }
}

export var SCENE = SceneManager.getInstance();