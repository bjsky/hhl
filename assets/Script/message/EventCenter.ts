
/**
 *全局 事件控制器
 */
export default class EventCenter extends cc.EventTarget{

    private static _instance: EventCenter = null;
    public static getInstance(): EventCenter {
        if (EventCenter._instance == null) {
            EventCenter._instance = new EventCenter();
        }
        return EventCenter._instance;
    }
}
export var EVENT = EventCenter.getInstance();
