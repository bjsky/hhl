import { Appender, ConsoleAppender, HTTPAppender } from "./Appender";
import { Logger, LogLevel } from "./Logger";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

export class ElexLogger {
    private static instance: ElexLogger = null;
    private readonly logger: Logger = null;
    private readonly consist: {[key: string]: string} = {};

    private constructor() {
        this.logger = new Logger();
        this.logger.setName('COK农场');
        this.logger.addAppender(new ConsoleAppender());
    }

    public static getLogger() : ElexLogger {
        if (ElexLogger.instance === null) {
            ElexLogger.instance = new ElexLogger()
        }
        return ElexLogger.instance;
    }
    public addAppender(apd: Appender): ElexLogger {
        this.logger.addAppender(apd)
        return this;
    }
    public setLevel(level: number): ElexLogger {
        this.logger.setLevel(level);
        return this;
    }
    public setDeviceID(did: string): ElexLogger {
        this.addConsist("device_id", did);
        return this;
    }
    public setVersion(ver: string): ElexLogger {
        this.addConsist("version", ver);
        return this;
    }
    public addConsist(key: string, value: string): ElexLogger {
        this.consist[key] = value;
        return this;
    }
    public write(level: number, msgs ?: {[key:string]: string}): ElexLogger {
        if (msgs === undefined || msgs === null) {
            return this;
        }
        for (const c in this.consist) {
            if (msgs[c] === undefined) {
                msgs[c] = this.consist[c];
            }
        }
        this.logger.write(level, msgs);
        return this;
    }
}

export const ElexTrace = ElexLogger.getLogger().write.bind(ElexLogger.getLogger(), LogLevel.Trace);
export const ElexDebug = ElexLogger.getLogger().write.bind(ElexLogger.getLogger(), LogLevel.Debug);
export const ElexInfo = ElexLogger.getLogger().write.bind(ElexLogger.getLogger(), LogLevel.Info);
export const ElexWarning = ElexLogger.getLogger().write.bind(ElexLogger.getLogger(), LogLevel.Warning);
export const ElexError = ElexLogger.getLogger().write.bind(ElexLogger.getLogger(), LogLevel.Error);
export const ElexFatal = ElexLogger.getLogger().write.bind(ElexLogger.getLogger(), LogLevel.Fatal);

export default {
    debug: DEBUG,
    info: INFO,
    error: ERROR,
    warning: WARNING,
    fatal: FATAL,
    trace: TRACE,
}

export function TRACE(...args: any[]) {
    if (args.length > 0) {
        ElexTrace({'msg': args.join('')});
    }
}

export function DEBUG(...args: any[]) {
    if (args.length > 0) {
        ElexDebug({'msg': args.join('')});
    }
}

export function INFO(...args: any[]) {
    if (args.length > 0) {
        ElexInfo({'msg': args.join('')});
    }
}

export function WARNING(...args: any[]) {
    if (args.length > 0) {
        ElexWarning({'msg': args.join('')});
    }
}

export function ERROR(...args: any[]) {
    if (args.length > 0) {
        ElexError({'msg': args.join('')});
    }
}

export function FATAL(...args: any[]) {
    if (args.length > 0) {
        ElexFatal({'msg': args.join('')});
    }
}
