export default {
    namespaced: true,
    state: {
        list: [],
        index: 0
    },
    mutations: {
        advert_render(state:any, data:any) {
            data.editInfo.advert.forEach((advert:any) => {
                let adObj = {
                    seq: (state.list.length + 1).toString(),
                    tabTitle:
                        "广告" + (state.list.length + 1)
                };
                advert.is_show =
                    advert.is_show == 0 ? "2" : (advert.is_show).toString();
                advert = Object.assign({}, advert, adObj);
                state.list.push(advert);
            });
        },
        advert_handle(state:any, data:any) {
            data.editInfo.advert = state.list;
        },
        advert_updateIndex(state:any, index: number) {
            state.index = index;
        }
    },
    actions: {
        advert_render: {
            root: true,
            handler({ commit }:any, data:any) {
                return new Promise((resolve, reject) => {
                    commit("advert_render", data);
                    typeof resolve === 'function' && resolve();
                });
            }
        },
        advert_handle: {
            root: true,
            handler({ commit }:any, data:any) {
                return new Promise((resolve, reject) => {
                    commit("advert_handle", data);
                    typeof resolve === 'function' && resolve();
                });
            }
        }
    }
};
