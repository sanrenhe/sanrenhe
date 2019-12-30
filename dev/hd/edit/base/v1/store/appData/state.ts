import { Dictionary } from "vuex";

const state: Dictionary<any> = {
    /**
     * 默认获取数据keys     activity-活动信息 ext-扩展字段 platforms-发布平台 draw-抽奖 prize-奖品 prizesType-奖品类型
     */
    defaultDataKeys: ["activity", "ext", "platforms", "advert"],
    /**
     * 存储数据key
     */
    dataKeys: [],
    /**
     * 需要更新的数据key
     */
    handleKeys: ["advert"],
    /**
     * 保存成功后更新的编辑数据
     */
    updateKeys: ["platforms"],
    /**
     * 接口返回数据
     */
    info: null,
    /**
     * 保存的数据
     */
    saveData: {},
    /**
     * 接口apis (getter)
     */
    apiList: [],
    /**
     * 编辑所需信息 (getter)
     */
    editInfo: {},
    /**
     * 平台上传白名单信息 (getter)
     */
    whiteSet: {
        list: [],
        platform_ids: []
    },
    /**
     * 钱包金额信息
     */
    walletInfo: {
        activityCurrentMoney: 0,
        activityRemainMoney: 0,
        subjectCurrentMoney: 0,
        subjectRemainMoney: 0
    },
    /**
     * 编辑区显示 (getter)
     */
    isShow: false,
    /**
     * axiso请求状态（getter）
     */
    loading: 0,
    /**
     * axiso请求是否显示loading层,默认显示
     */
    isLoadShow: true,
    /**
     * 当前编辑tabs,ele
     */
    activeEdit: {
        tab: "base", // 设置区
        ele: {}, // 编辑项 type: '', // 虚线框颜色样式 white black
        path: "", // 编辑字段
        offset: {
            // 编辑虚线框定位
            w: 0,
            h: 0,
            x: 0,
            y: 0
        },
        scroll: {
            // 滚动
            x: 0,
            y: 0
        }
    },
    /**
     * 编辑区数据状态 未编辑-0/已修改-1
     */
    editInfoStatus: 0,
};

export default state;
