export default {
    namespaced: true,
    mutations: {
        platforms_render(state:any, data:any) {
            // 处理发布平台是否可更改逻辑
            data.editInfo.platformArr = [];
            for (let key in data.editInfo.platforms) {
                let obj = {
                    label: key,
                    name: data.editInfo.platforms[key],
                    disabled: false
                };
                for (
                    let i = 0, len = data.editInfo.activity.platforms.length;
                    i < len;
                    i++
                ) {
                    if (
                        data.editInfo.activity.status == 1 &&
                        key == data.editInfo.activity.platforms[i]
                    ) {
                        obj.disabled = true;
                    }
                }
                data.editInfo.platformArr.push(obj);
            }
        },
        platforms_update(state:any, data:any) {
            if (data.editInfo.activity.status == 1) {
                data.editInfo.platformArr.forEach((platform:any, index:number) => {
                    data.editInfo.activity.platforms.forEach((val:any, index:number) => {
                        if (platform.label == val) {
                            platform.disabled = true;
                        }
                    });
                });
            }
        }
    },
    actions: {
        platforms_render: {
            root: true,
            handler({ commit, dispatch, rootstate, state }:any, data:any) {
                return new Promise((resolve, reject) => {
                    commit("platforms_render", data);
                    typeof resolve === 'function' && resolve();
                });
            }
        },
        platforms_update: {
            root: true,
            handler({ commit, dispatch, rootstate, state }:any, data:any) {
                return new Promise((resolve, reject) => {
                    commit("platforms_update", data);
                    typeof resolve === 'function' && resolve();
                });
            }
        }
    }
};
