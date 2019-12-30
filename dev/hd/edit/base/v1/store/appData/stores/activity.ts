export default {
    namespaced: true,
    mutations: {
        activity_render(state:any, data:any) {
            // 处理活动时间
            data.content.start_time = new Date(data.content.start_time * 1000);
            data.content.end_time = new Date(data.content.end_time * 1000);

            // 扩展字段处理
            this.dispatch("packageExtInfo", {
                extData: data.extData,
                param: data.content
            });
        }
    },
    actions: {
        activity_render: {
            root: true,
            handler({ commit }:any, data:any) {
                return new Promise((resolve, reject) => {
                    commit("activity_render", data);
                    typeof resolve === "function" && resolve();
                });
            }
        }
    }
};
