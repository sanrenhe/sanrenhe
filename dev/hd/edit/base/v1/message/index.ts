import { Dictionary } from "vue-router/types/router";

// 消息类型
export enum MessageType {
    empty = 0,
    init = 1,
    update = 2,
    tapClick = 3,
    tapHover = 4,
    tapScroll = 5,
    edit = 6
}

// 消息数据
export class MessageData {
    // 消息类型
    type: MessageType = MessageType.empty;
    // 消息
    data: Dictionary<any>;
    // 构造函数
    constructor(data?: Dictionary<any>) {
        this.data = data || {};
    }
    // 发送消息
    postMessage() {
        MessageData.postMessage(this.type, this.data);
    }
    // 实现
    static postMessage(
        type: MessageType,
        data?: Dictionary<any>,
        name: string = "view"
    ) {
        if (name == "view") {
            (window.frames as Dictionary<any>)[name].contentWindow.postMessage(
                {
                    _HDCRM_: true, // 标识
                    type: type,
                    data: data
                },
                "*"
            );
        } else {
            window.postMessage(
                {
                    _HD_: true, // 标识
                    type: type,
                    data: data
                },
                "*"
            );
        }
    }
}

// 监听message
export function listenMessage(
    callback: (data: MessageData, e: MessageEvent) => void
) {
    window.addEventListener(
        "message",
        function(e) {
            if (typeof e.data === "object" && e.data._HD_) {
                callback(e.data, e);
            }
        },
        false
    );
}
