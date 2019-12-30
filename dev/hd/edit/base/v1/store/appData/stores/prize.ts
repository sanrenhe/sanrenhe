export default {
    namespaced: true,
    state: {
        index: 0, // 当前编辑奖品序列号
        type: "", // 当前编辑奖品类型
        prizeSetCustom: []
    },
    mutations: {
        init(state: any, data: any) {
            state.prizeSetCustom = data.actSet.prizeSetCustom ||  [
                {
                    name: "普通奖池",
                    title: "普通奖品",
                    jackpot: "1",
                    probability_set: true,
                    other: {}
                },
                {
                    name: "安慰奖池",
                    title: "安慰奖品",
                    jackpot: "2",
                    probability_set: false,
                    other: {}
                }
            ];
            state.prizeSetCustom.forEach((item: any, index: number) => {
                let key = "general_" + item.jackpot;
                state[key] = [];
                if (index == 0) {
                    state.type = key;
                }
            });
        },
        prize_render(state:any, data:any) {
            // 处理奖品数据-添加编辑项标识
            data.content.forEach((val:any, index:number) => {
                // 添加编辑项字段
                let obj = {
                    input_num: 0,
                    code_num: 0,
                    renderType: "succ",
                    minnum: val.num, // 设置活动开启后默认最少数量
                    close: val.is_valid == 2 ? true : false,
                    class: val.is_valid == 2 ? "" : "unclose",
                    is_dzq:
                        val.type == ""
                            ? 2
                            : data.editInfo.prizesType[val.type].is_dzq, // 是否导入电子券 1-导，2-不导
                    title: "",
                    seq: "0",
                };
                let prize = Object.assign({}, val, obj);
                if (prize.is_valid == 2 && prize.num > 0) {
                    prize.code_num = prize.num;
                }
                if (prize.is_valid == 1) {
                    if (data.editInfo.prizesType[prize.type].is_dzq == 2) {
                        prize.input_num = prize.num;
                    } else {
                        prize.code_num = prize.num;
                    }
                }
                // 分发奖品至对应奖池
                let title = "";
                state.prizeSetCustom.forEach((item: any) => {
                    if (prize.jackpot == item.jackpot) {
                        title = item.title;
                    }
                });
                prize.title =
                    title + (state["general_" + prize.jackpot].length + 1);
                prize.seq = state["general_" + prize.jackpot].length + 1 + "";
                prize.name = prize.name == "" ? title : prize.name;
                prize.tabIndex = state["general_" + prize.jackpot].length + 1;
                state["general_" + prize.jackpot].push(prize);
            });
        },
        prize_handle(state:any, data:any) {
            let arr: any = [];
            state.prizeSetCustom.forEach((item: any) => {
                let key = "general_" + item.jackpot;
                arr = arr.concat(state[key]);
            });
            data.editInfo.prize = arr;
            data.editInfo.prize.forEach((prize:any, index:number) => {
                if (prize.is_dzq == 2) {
                    prize.num = prize.input_num;
                } else {
                    prize.num = prize.code_num;
                }
            });
        },
        prize_update(state:any, data:any) {
            state.prizeSetCustom.forEach((item: any) => {
                let key = "general_" + item.jackpot;
                state[key].forEach((prize: any) => {
                    prize.is_valid = 1;
                    prize.close = false;
                    prize.class = "unclose";
                    prize.minnum = prize.input_num;
                });
            });
        },
        /**
         * 更新当前奖品编辑序列号
         * @param state
         * @param index
         */
        prize_updateIndex(state:any, index: number) {
            state.index = index;
        },
        prize_updateType(state:any, type: string) {
            state.type = type;
        }
    },
    actions: {
        prize_render: {
            root: true,
            handler({ commit, dispatch, rootstate, state }:any, data:any) {
                return new Promise((resolve, reject) => {
                    commit("init", data);
                    commit("prize_render", data);
                    typeof resolve === "function" && resolve();
                });
            }
        },
        prize_handle: {
            root: true,
            handler({ commit, dispatch, rootstate, state }:any, data:any) {
                return new Promise((resolve, reject) => {
                    commit("prize_handle", data);
                    typeof resolve === "function" && resolve();
                });
            }
        },
        prize_update: {
            root: true,
            handler({ commit, dispatch, rootstate, state }:any, data:any) {
                return new Promise((resolve, reject) => {
                    commit("prize_update", data);
                    typeof resolve === "function" && resolve();
                });
            }
        }
    }
};
