import { MutationTree, Dictionary } from "vuex";

const mutations: MutationTree<any> = {
    /**
     * @description: 加载状态
     * @param {num: number}
     */
    setLoading(state: any, num: number) {
        state.loading = num;
    },
    /**
     * @description: 初始化数据
     * @param {data: Dictionary<any>}
     */
    initData(state: any, data: Dictionary<any>) {
        // 存储数据key值
        for (let key in data) {
            state.dataKeys.push(key);
        }
        state.info = data;
        this.commit("filterData");
    },
    /**
     * @description: 过滤数据
     * @param {}
     */
    filterData(state) {
        state.actSet = state.actSet
            ? state.actSet
            : { editDataKey: state.defaultDataKeys, editEleBlackList: [] };

        // 处理活动编辑数据
        state.actSet.editDataKey.forEach((key: string) => {
            console.log(key);
            state.editInfo[key] = state.info[key] ? state.info[key] : null;
        });

        // 组装编辑数据
        this.dispatch("packageEditInfo");

        // 处理平台白名单
        for (let key in state.editInfo.platforms) {
            // 初始化白名单
            let whiteObj = {
                count: 0,
                platform_id: key,
                platform_name: state.editInfo.platforms[key]
            };
            state.whiteSet.list.push(whiteObj);
            state.whiteSet.platform_ids.push(key);
        }
        console.log(state);
    },
    /**
     * @description: 处理平台白名单数据列表
     * @param {data: Dictionary<any>}
     */
    renderWhiteData(state: any, data: Dictionary<any>) {
        state.whiteSet.list = data.length == 0 ? state.whiteSet.list : data;
        state.isShow = true;
    },
    /**
     * @description: 保存前处理编辑数据
     * @param {}
     */
    renderSaveData(state: any) {
        this.dispatch("handleData");

        let customHandleKeys = state.actSet.editHandleCustomKey == undefined ? [] : state.actSet.editHandleCustomKey;
        customHandleKeys.forEach((key: string) => {
            let mutationName = key + '_handle_custom';
            this.commit(mutationName, state);
        });

        state.actSet.editDataKey.forEach((key: string) => {
            state.saveData[key] = state.editInfo[key];
        });
    },
    /**
     * @description: 处理钱包金额数据
     * @param {data: any}
     */
    renderWalletInfo(state: any, data: any) {
        state.walletInfo = data;
    },
    /**
     * @description: axois请求loading层显示隐藏
     * @param {data: any}
     */
    updateLoadShow(state: any, data: any) {
        state.isLoadShow = data;
    },
    /**
     * @description: 显示已折叠的设置区域
     * @param {data: any}
     */
    updateActiveNames(state: any, data: any) {
        if (state.actSet.activeNames.active.indexOf(data) == -1) {
            state.actSet.activeNames.active.push(data);
        }
    },
    /**
     * @description: 更新虚线框位置信息
     * @param {data: any}
     */
    updateUiWrapper(state: any, data: any) {
        state.activeEdit.offset = data.offset;
        state.activeEdit.scroll = data.scroll;
        state.activeEdit.ele = data.ele;
    },
    /**
     * @description: 页面滚动时更新虚线框位置信息
     * @param {data: any}
     */
    updateScrollUiWrapper(state: any, data: any) {
        state.activeEdit.scroll.y = data.scroll.y;
        state.activeEdit.scroll.x = data.scroll.x;
    },
    /**
     * @description: 重置虚线框数据
     * @param {data: any}
     */
    resetUiWrapper(state: any, data: any) {
        state.activeEdit.offset = Object.assign({}, state.activeEdit.offset, {
            w: 0,
            h: 0,
            x: 0,
            y: 0
        });
        state.activeEdit.scroll = Object.assign({}, state.activeEdit.scroll, {
            x: 0,
            y: 0
        });
        state.activeEdit.path = "";
        state.activeEdit.ele = {};
    },
    /**
     * @description: 左侧与编辑区对应关系
     * @param {data: any}
     */
    updateEditWrapper(state: any, data: any) {
        state.activeEdit.tab =
            data.tab == undefined || "" ? state.activeEdit.tab : data.tab;
        state.activeEdit.path = data.path;
    },
    /**
     * @description: 保存失败处理流程
     * @param {type}
     */
    handleError(state: any, data: any) {
        let errArr = data.split(".");
        let primary = errArr[0];
        let keyword =
            primary == "prize" || primary == "advert" || primary == "goods"
                ? errArr[2]
                : errArr[1];
        let setType = state.activeEdit.tab;
        let activeName = "";
        let isJump = false;

        switch (primary) {
            case "activity":
                let keywords = ["share_set", "title", "rules", "end_time", "start_time", "platforms", "logo_url"];
                if (keywords.indexOf(keyword) != -1) {
                    if (keyword == "logo_url") {
                        setType = "senior";
                        activeName = "logo";
                    } else {
                        setType = "base";
                        if (keyword == "share_set") {
                            activeName = "share";
                        } else {
                            activeName = "base";
                        }
                    }
                } else {
                    isJump = true;
                }
                break;
            case "prize":
                setType = "award";
                let prizeIndex = errArr[1];
                let prizeLength = 0;

                let prizeSetCustom = state.actSet.prizeSetCustom ||  [
                    {
                        name: "普通奖池",
                        title: "普通奖品",
                        jackpot: "1",
                    },
                    {
                        name: "安慰奖池",
                        title: "安慰奖品",
                        jackpot: "2",
                    }
                ];

                let prizeType = '';
                try {
                    prizeSetCustom.forEach((item: Dictionary<any>, index: number) => {
                        let key = "general_" + item.jackpot;
                        if(prizeIndex <= (state.prize[key].length - 1) + prizeLength) {
                            prizeType = key;
                            prizeIndex = prizeIndex - prizeLength;
                            throw('catch');
                        } else {
                            prizeLength += state.prize[key].length;
                        }
                    });
                } catch (error) {
                    console.log(error);
                }

                this.commit("prize/prize_updateType", prizeType);
                this.commit("prize/prize_updateIndex", prizeIndex);
                break;
            case "goods":
                setType = "goods";
                let goodsIndex = errArr[1];
                this.commit("goods/goods_updateIndex", goodsIndex);
                break;
            case "advert":
                setType = "senior";
                activeName = "advert";
                let advertIndex = errArr[1];
                this.commit("advert/advert_updateIndex", advertIndex);
                break;
            default:
                isJump = true;
                break;
        }

        // 更新编辑项醒目配置
        this.commit("updateEditWrapper", { path: data, tab: setType });

        if (activeName) {
            this.commit("updateActiveNames", activeName);
        }

        // 错误处理扩展方法
        if (state.actSet.errorExt && isJump) {
            this.commit("handleErrorExt", data);
        }
    },
    /**
     * @description: 更新编辑区数据编辑状态
     * @param {type}
     */
    updateEditInfoStatus(state: any, status: any) {
        state.editInfoStatus = status;
    }
};

export default mutations;
