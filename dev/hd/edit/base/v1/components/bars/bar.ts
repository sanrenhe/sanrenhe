import Vue from "vue";
import { Getter } from "vuex-class";
import { Dictionary } from "vuex";

class Bar extends Vue {
    @Getter public info!: Dictionary<any>;          // 编辑信息
    @Getter public editEleBlackList!: string[];     // 可编辑项黑名单
    @Getter public apiList!: Dictionary<any>;       // 接口列表
    @Getter public activeEdit!: Dictionary<any>;    // 左右联动关联项
    @Getter public activeNames!: Dictionary<any>;   // 设置区显示数组
    popover: object;                                // 警告文案

    constructor(popover: object) {
        super();
        this.popover = popover;
    }
}

export default Bar;