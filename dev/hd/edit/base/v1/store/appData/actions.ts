import { ActionTree, Dictionary } from "vuex";
import http from "../../plugins/axios/http";
import { api } from "../../plugins/axios/api";
import { Message } from "element-ui";

const actions: ActionTree<any, any> = {
    /**
     * @description: 加载状态
     * @param {num: number}
     */
    async Loading({ commit }:any, num: number) {
        commit("setLoading", num);
    },
    /**
     * @description: 获取编辑数据
     * @param {id: string}
     */
    async getData({ dispatch }, id: string) {
        return new Promise((resolve, reject) => {
            dispatch("getApiList", id).then(() => {
                resolve();
            });
        });
    },
    /**
     * @description: 获取接口数据
     * @param {id: string}
     */
    async getApiList({ state, dispatch }, id: string) {
        return new Promise((resolve, reject) => {
            http.get(api.getApiList + "/" + id)
                .then((res: any) => {
                    state.apiList = res.data;
                    dispatch("getInfo").then(() => {
                        resolve();
                    });
                })
                .catch((error: any) => {
                    console.error(error);
                    reject();
                });
        });
    },
    /**
     * @description: 获取编辑数据
     * @param {}
     */
    async getInfo({ state, commit }) {
        return new Promise((resolve, reject) => {
            http.get(state.apiList.infoUrl).then((res: any) => {
                commit("initData", res.data);
                resolve();
                this.dispatch("getWhiteList");
            });
        });
    },
    /**
     * @description: 获取平台白名单数据
     * @param {}
     */
    async getWhiteList({ state, commit }) {
        http.post(state.apiList.whiteCurCountUrl, {
            platform_ids: state.whiteSet.platform_ids
        }).then(res => {
            commit("renderWhiteData", res.data);
        });
    },
    /**
     * @description: 保存前需要处理数据字段，即在保存前分发需要处理的编辑字段至每个对应的字段类型方法中处理
     * @param {data:any}
     */
    async handleData({ state, dispatch }:any, data:any) {
        return new Promise((resolve, reject) => {
            let customHandleKeys =
                state.actSet.editHandleKey == undefined
                    ? []
                    : state.actSet.editHandleKey;
            let handleKeys = state.handleKeys.concat(customHandleKeys);
            if (data) {
                dispatch(
                    data.actionName,
                    {
                        content: state.editInfo[data.key],
                        editInfo: state.editInfo
                    },
                    {
                        root: true
                    }
                );
            } else {
                state.actSet.editDataKey.forEach((key: string) => {
                    if (handleKeys.indexOf(key) != -1) {
                        let actionName = key + "_handle";
                        dispatch(
                            actionName,
                            {
                                content: state.editInfo[key],
                                editInfo: state.editInfo
                            },
                            {
                                root: true
                            }
                        );
                    }
                });
            }
            typeof resolve === "function" && resolve();
        });
    },
    /**
     * @description: 更新数据：保存成功 或 编辑过程中需要更新数据时
     * @param {data:any}
     */
    async updateData({ state, dispatch }:any, data:any) {
        let customUpdateKeys =
            state.actSet.editUpdateKey == undefined
                ? []
                : state.actSet.editUpdateKey;
        let updateKeys = state.updateKeys.concat(customUpdateKeys);
        return new Promise((resolve, reject) => {
            if (data) {
                dispatch(
                    data.actionName,
                    {
                        content: state.editInfo[data.key],
                        editInfo: state.editInfo
                    },
                    {
                        root: true
                    }
                );
            } else {
                state.actSet.editDataKey.forEach((key: string) => {
                    if (updateKeys.indexOf(key) != -1) {
                        let actionName = key + "_update";
                        dispatch(
                            actionName,
                            {
                                content: state.editInfo[key],
                                editInfo: state.editInfo
                            },
                            {
                                root: true
                            }
                        );
                    }
                });
            }
            typeof resolve === "function" && resolve();
        });
    },
    /**
     * @description: 保存操作：处理编辑数据为可保存的数据
     * @param {}
     */
    async save({ commit, dispatch }) {
        return new Promise((resolve, reject) => {
            commit("renderSaveData");
            dispatch("saveInfo").then(() => {
                resolve();
            });
        });
    },
    /**
     * @description: 保存数据：推送数据
     * @param {}
     */
    async saveInfo({ state, dispatch, commit }) {
        return new Promise((resolve, reject) => {
            http.post(state.apiList.saveUrl, state.saveData).then(
                (res: Dictionary<any>) => {
                    if (res.status == "success") {
                        resolve();
                        Message({
                            showClose: true,
                            message: res.message,
                            type: "success"
                        });
                        // 保存后更新编辑数据
                        dispatch("updateData");
                        commit("updateEditInfoStatus", 0);
                    } else {
                        Message({
                            showClose: true,
                            message: res.message,
                            type: "error",
                            duration: 5000
                        });
                        if (res.data) {
                            commit("handleError", res.data);
                        }
                    }
                }
            );
        });
    },
    /**
     * @description: 预览操作：先行保存，后进行预览
     * @param {type}
     */
    async preview({ state }) {
        return new Promise((resolve, reject) => {
            http.post(state.apiList.previewUrl).then((res: Dictionary<any>) => {
                if (res.status == "success") {
                    resolve(res);
                } else {
                    Message({
                        showClose: true,
                        message: res.message,
                        type: "error",
                        duration: 5000
                    });
                }
            });
        });
    },
    /**
     * @description: 获取钱包金额
     * @param {totalMoney}
     */
    async getWallet({ state, commit }, totalMoney) {
        commit('updateLoadShow', false);
        return new Promise((resolve, reject) => {
            http.get(state.apiList.activityWalletUrl, { totalMoney: totalMoney}).then(res => {
                commit("renderWalletInfo", res.data);
                commit('updateLoadShow', true);
                resolve();
            })
        })
    },
};

export default actions;
