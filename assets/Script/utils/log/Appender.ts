export interface Appender {
    write(msgs: {[key:string]:string});
}

function build_msg(msgs: {[key:string]: string}): string {
    let ret = ""
    if (msgs["log_time"] !== undefined) {
        ret += msgs["log_time"] + " "
    }
    if (msgs["log_name"] !== undefined) {
        ret += msgs["log_name"] + " "
    }
    if (msgs["log_level"] !== undefined) {
        ret += msgs["log_level"] + " "
    }
    if (ret.length === 0) {
        ret = "Log ";
    }
    ret += "-";
    for (const m in msgs) {
        if (m !== "log_time" && m !== "log_name" && m !== "log_level") {
            ret += ` ${ m }=${ msgs[m] }`
        }
    }
    return ret;
}

export class ConsoleAppender implements Appender {
    public write(msgs: {[key:string]: string}) {
        if (Object.keys(msgs).length > 0) {
            console.log(build_msg(msgs));
        }
    }
}

export enum HTTPMsgType {
    Json = 1
    , URL
    , Text
}
export class HTTPAppender implements Appender {
    private readonly url: string;
    private readonly type: HTTPMsgType;

    constructor(url: string, type: HTTPMsgType = HTTPMsgType.Json) {
        this.url = url;
        this.type = type;
    }
    public write(msgs: {[key:string]: string}) {
        if (Object.keys(msgs).length > 0) {
            switch (this.type) {
                case HTTPMsgType.Json:
                    this.write_json(msgs);
                    break;
    
                case HTTPMsgType.URL:
                    this.write_url(msgs);
                    break;
    
                case HTTPMsgType.Text:
                    this.write_text(msgs);
                    break;
            }
        }
    }
    private write_json(msgs: {[key:string]:string}) {
        fetch(this.url,
        {
            headers: {
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify(msgs)
        })
        .catch(() => console.log('发送日志到 ', this.url, ' 失败'));
    }
    private write_url(msgs: {[key:string]:string}) {
        let msg = "";
        for (const m in msgs) {
            msg += `&${ m }=${ msgs[m] }`
        }
        if (msg.length > 0) {
            const url = `${ this.url }?${ msg.substr(1) }`
            fetch(url);
        }
    }
    private write_text(msgs: {[key:string]:string}) {
        const msg = build_msg(msgs);
        fetch(this.url,
        {
            headers: {
                'Content-Type': 'text/plain;charset=UTF-8'
            },
            method: "POST",
            body: msg
        })
        .catch(() => console.log('发送日志到 ', this.url, ' 失败'));
    }
}
