import { filterExt } from "@base/utils/extHandle";
import { Dictionary } from "vuex";

export default {
    namespaced: true,
    state: {
        ignoreKeys: ["ext", "goodsType", "prizesType", "draw"],
        extData: {}
    },
    mutations: {
        ext_render(state:any, data: Dictionary<any>) {
            data.forEach((ext: Dictionary<any>) => {
                if (ext.type != 1) {
                    let extKey = ext.belong.split(".")[0];
                    let positionKey = ext.belong.split(".")[1];
                    if (state.extData[extKey] == undefined) {
                        state.extData[extKey] = [];
                    }

                    let obj = {
                        belong: positionKey,
                        edit: {
                            name: ext.name,
                            key: ext.key,
                            type: ext.type
                        }
                    };

                    state.extData[extKey].push(obj);
                }
            });
        },
        ext_package(state:any, data: Dictionary<any>) {
            // 扩展字段处理
            if (data.extData != undefined) {
                data.extData.forEach((ext:any) => {
                    let extEditKeys = ext.edit.key.split(",");
                    extEditKeys.forEach((key:any) => {
                        data.param[ext.belong][key] = filterExt(
                            ext.edit,
                            data.param[ext.belong][key]
                        );
                    });
                });
            }
        }
    },
    actions: {
        packageEditInfo: {
            root: true,
            handler(
                { commit, dispatch, rootState, state }:any,
                data?: Dictionary<any>
            ) {
                // 自定义忽略的数据字段，即不需要进行特殊处理的数组字段
                let customIgnoreKeys =
                    rootState.appData.actSet.editRenderIgnoreKey == undefined
                        ? []
                        : rootState.appData.actSet.editRenderIgnoreKey;

                // 与默认忽略处理的数据字段数组合并
                let ignoreKeys = state.ignoreKeys.concat(customIgnoreKeys);

                // 处理扩展字段数据
                commit("ext_render", rootState.appData.editInfo["ext"]);

                // 循环编辑数据，分发需要处理的数据至各个数据字段内的处理方法 （actions: <key>_render）
                return new Promise((resolve, reject) => {
                    rootState.appData.actSet.editDataKey.forEach(
                        (key: string) => {
                            if (ignoreKeys.indexOf(key) == -1) {
                                let actionName = key + "_render";

                                // 传递的数据包：
                                // content-数据内容
                                // editInfo-所有编辑数据
                                // extData-扩展字段
                                let dataObj = {
                                    content: rootState.appData.editInfo[key],
                                    editInfo: rootState.appData.editInfo,
                                    extData: state.extData[key],
                                    actSet: rootState.appData.actSet
                                };

                                dispatch(actionName, dataObj, {
                                    root: true
                                });
                            }
                        }
                    );
                    typeof resolve === "function" && resolve();
                });
            }
        },
        packageExtInfo: {
            root: true,
            handler({ commit }:any, data: Dictionary<any>) {
                return new Promise((resolve, reject) => {
                    commit("ext_package", data);
                    typeof resolve === "function" && resolve();
                });
            }
        }
    }
};
