export default {
    namespaced: true,
    state: {
        list: [], // 商品列表
        index: 0, // 当前编辑商品序列号
    },
    mutations: {
        goods_render(state:any, data:any) {
            // 处理商品数据-添加编辑项标识
            data.content.forEach((good:any) => {
                // 添加编辑项字段
                let obj = {
                    input_num: 0,
                    code_num: 0,
                    minnum: good.num, // 设置活动开启后默认最小库存
                    close: good.is_valid == 2 ? true : false,
                    class: good.is_valid == 2 ? "" : "unclose",
                    is_dzq:
                        good.type == ""
                            ? 2
                            : data.editInfo.goodsType[good.type].is_dzq, // 是否导入电子券 1-导，2-不导
                    title: "",
                    seq: "0"
                };
                good = Object.assign({}, good, obj);
                if (good.is_valid == 2 && good.num > 0) {
                    good.code_num = good.num;
                }
                if (good.is_valid == 1 && good.type) {
                    if (data.editInfo.goodsType[good.type].is_dzq == 2) {
                        good.input_num = good.num;
                    } else {
                        good.code_num = good.num;
                    }
                }
                good.name =
                    good.name == ""
                        ? "商品" +
                          (state.list.length + 1) +
                          "号"
                        : good.name;
                good.title = "商品" + (state.list.length + 1);
                good.seq = state.list.length + 1 + "";

                // 扩展字段处理
                this.dispatch("packageExtInfo", {
                    extData: data.extData,
                    param: good
                });

                state.list.push(good);
            });
        },
        goods_handle(state:any, data:any) {
            data.editInfo.goods = state.list;

            data.editInfo.goods.forEach((goods:any) => {
                if (goods.is_dzq == 2) {
                    goods.num = goods.input_num;
                } else {
                    goods.num = goods.code_num;
                }
            });
        },
        goods_update(state:any) {
            state.list.forEach((good:any) => {
                good.is_valid = 1;
                good.close = false;
                good.class = "unclose";
                good.minnum = good.input_num;
            });
        },
        goods_updateIndex(state:any, index: number) {
            state.index = index;
        }
    },
    actions: {
        goods_render: {
            root: true,
            handler({ commit }:any, data:any) {
                return new Promise((resolve, reject) => {
                    commit("goods_render", data);
                });
            }
        },
        goods_handle: {
            root: true,
            handler({ commit }:any, data:any) {
                return new Promise((resolve, reject) => {
                    commit("goods_handle", data);
                });
            }
        },
        goods_update: {
            root: true,
            handler({ commit }:any, data:any) {
                return new Promise((resolve, reject) => {
                    commit("goods_update", data);
                });
            }
        }
    }
};
