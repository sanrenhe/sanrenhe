import { GetterTree, Dictionary } from "vuex";

const getters: GetterTree<any, any> = {
    info(state: Dictionary<any>) {      // 可编辑数据
        return state.appData.editInfo;
    },
    isShow(state: Dictionary<any>) {    // 编辑区是否显示
        return state.appData.isShow;
    },
    apiList(state: Dictionary<any>) {   // 接口api列表
        return state.appData.apiList;
    },
    whiteSet(state: Dictionary<any>) {  // 平台白名单设置项
        return state.appData.whiteSet;
    },
    loading(state: Dictionary<any>) {   // axios请求数据loading层
        return state.appData.loading;
    },
    isLoadShow(state: Dictionary<any>) {    // 是否显示loading层
        return state.appData.isLoadShow;
    },
    walletInfo(state: Dictionary<any>) {    // 钱包信息
        return state.appData.walletInfo;
    },
    activeEdit(state: Dictionary<any>) {    // 左侧展示区可编辑项数据
        return state.appData.activeEdit;
    },
    infoStatus(state: Dictionary<any>) {
        return state.appData.editInfoStatus;
    }
};

export default getters;
