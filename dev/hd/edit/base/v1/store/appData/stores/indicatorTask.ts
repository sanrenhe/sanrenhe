export default {
    namespaced: true,
    state: {
        list: [], // 任务指标
    },
    mutations: {
        indicatorTask_render(state: any, data: any) {
            data.content.forEach((val: any) => {
                let obj = {
                    deleteVisible: false,
                    status: 1,
                }
                let task = Object.assign({}, val, obj);
                state.list.push(task);
            })
        },
        indicatorTask_handle(state: any, data: any) {
            data.editInfo.indicatorTask = state.list;
        },
        indicatorTask_update(state: any, data: any) {
        }
    },
    actions: {
        indicatorTask_render: {
            root: true,
            handler({ commit, dispatch, rootstate, state }:any, data:any) {
                return new Promise((resolve, reject) => {
                    commit("indicatorTask_render", data);
                    typeof resolve === "function" && resolve();
                });
            }
        },
        indicatorTask_handle: {
            root: true,
            handler({ commit, dispatch, rootstate, state }:any, data:any) {
                return new Promise((resolve, reject) => {
                    commit("indicatorTask_handle", data);
                    typeof resolve === "function" && resolve();
                });
            }
        },
        indicatorTask_update: {
            root: true,
            handler({ commit, dispatch, rootstate, state }:any, data:any) {
                return new Promise((resolve, reject) => {
                    commit("indicatorTask_update", data);
                    typeof resolve === "function" && resolve();
                });
            }
        }
    }
}