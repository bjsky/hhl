import { Appender } from "./Appender";

export enum LogLevel {
    All = 0
    , Trace
    , Debug
    , Info
    , Warning
    , Error
    , Fatal
    , Off
}

export class Logger {
    private name = "未命名";
    private level: number;
    private readonly appenders: Appender[];

    public constructor() {
        this.appenders = [];
    }
    public addAppender(apd: Appender): Logger {
        this.appenders.push(apd);
        return this;
    }
    public setName(name: string): Logger {
        this.name = name;
        return this;
    }
    public setLevel(level: number): Logger {
        this.level = level;
        return this;
    }
    public levelName(level: number) {
        return LogLevel[level];
    }
    public write(level: number, msgs: {[key:string]: string} = null): Logger {
        if (level < this.level || msgs === null) {
            return this
        }
        if (msgs["log_level"] === undefined) {
            msgs["log_level"] = this.levelName(level);
        }
        this.write_to_appender(msgs);
        return this;
    }
    private get_time_string(): string {
        const now = new Date();
        const ms = now.getMilliseconds();
        let ret = now.toLocaleString("chinese", {hour12: false}) + ".";
        if (ms < 10) {
            ret += "00" + ms;
        } else if (ms < 100) {
            ret += "0" + ms;
        } else if (ms < 1000) {
            ret += ms;
        } else {
            ret += ms % 1000;
        }
        return ret;
    }
    private write_to_appender(msgs: {[key:string]: string}) {
        for (const apd of this.appenders) {
            if (msgs["log_time"] === undefined) {
                msgs["log_time"] = this.get_time_string();
            }
            if (msgs["log_name"] === undefined) {
                msgs["log_name"] = this.name;
            }
            apd.write(msgs);
        }
    }
}
