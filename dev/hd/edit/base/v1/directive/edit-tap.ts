import Vue from "vue";
import { MessageData, MessageType } from "../message";

// 传递编辑数据
Vue.directive("edit-tap", {
    bind(el, binding) {
        let value = binding.value || {};
        if (typeof value !== "object" || Array.isArray(value)) {
            throw new Error("binding value 格式错误");
        }
        value.name = value.name || binding.arg;
        $(el)
            .on("mouseover", () => {
                // 发送消息
                MessageData.postMessage(MessageType.tapHover, {
                    offset: getOffset(el),
                    scroll: { x: window.scrollX, y: window.scrollY },
                    ...value
                }, 'edit');
                return false;
            })
    }
});

function getOffset(el: HTMLElement) {
    let $el = $(el);
    return {
        w: el.offsetWidth,
        h: el.offsetHeight,
        x: (<HTMLElement>el.parentElement).offsetLeft,
        y: (<HTMLElement>el.parentElement).offsetTop
    };
}
