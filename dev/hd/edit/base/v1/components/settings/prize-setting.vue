<template>
    <div>
        <el-tabs
            :stretch="true"
            v-model="appData.prize.type"
            @tab-click="prizeTypeChange"
        >
            <!-- 普通奖品 -->
            <el-tab-pane
                v-for="(general, index) in appData.prize.prizeSetCustom"
                :key="index"
                :label="general.name"
                :name="'general_' + general.jackpot"
                :data-set="'general_' + general.jackpot"
            >
                <!-- 顶部设置区 -->
                <el-row
                    type="flex"
                    class="edit-control_ele"
                >
                    <!-- 中奖概率设置 -->
                    <template v-if="general.probability_set">
                        <!-- 当前概率显示 -->
                        <el-col
                            :span="6"
                            class="edit-title_long"
                        >
                            <p>当前中奖总概率：<em
                                    :class="{ 'over': getGeneral(general.jackpot).percent_total > getGeneral(general.jackpot).percent_max_set}"
                                    class="edit-control_ele_percent"
                                >{{getGeneral(general.jackpot).percent_total}}</em><em class="edit-control_ele_percent_icon">{{getGeneral(general.jackpot).percent_icon}}</em></p>
                        </el-col>
                        <!-- 概率选择 -->
                        <el-col :span="8">
                            <el-select
                                @change="choosePercent"
                                style="width: 200px;margin-left: 20px;"
                                v-model="info.draw.many_probability_set[general.jackpot]"
                                placeholder="请选择"
                                v-if="info.draw.many_probability_set"
                            >
                                <el-option
                                    v-for="general in percentSet.options"
                                    :key="general.value"
                                    :label="general.label"
                                    :value="general.value"
                                >
                                </el-option>
                            </el-select>
                            <el-select
                                v-else
                                @change="choosePercent"
                                style="width: 200px;margin-left: 20px;"
                                v-model="info.draw.probability"
                                placeholder="请选择"
                            >
                                <el-option
                                    v-for="general in percentSet.options"
                                    :key="general.value"
                                    :label="general.label"
                                    :value="general.value"
                                >
                                </el-option>
                            </el-select>
                        </el-col>
                    </template>
                    <!-- 兼容右侧钱包余额样式 -->
                    <template v-else>
                        <el-col :span="6"></el-col>
                        <el-col :span="8"></el-col>
                    </template>
                    <!-- 钱包余额/金额显示 -->
                    <el-col
                        :span="10"
                        class="edit-wallet_info"
                        v-if="walletShow"
                        v-loading="updateWallet"
                    >
                        <el-row type="flex">
                            <el-col
                                style="max-width: unset"
                                :span="12"
                            >
                                <div class="edit-wallet_info_box edit-wallet_info_text"><em>本次使用金额</em><span>/</span><em>活动可用余额</em></div>
                                <div class="edit-wallet_info_box edit-wallet_info_money"><em>{{walletInfo.activityCurrentMoney}}</em><span>/</span><em>{{walletInfo.activityRemainMoney}}</em></div>
                            </el-col>
                            <el-col :span="12">
                                <div class="edit-wallet_info_box edit-wallet_info_text"><em>本次使用金额</em><span>/</span><em>钱包余额</em></div>
                                <div class="edit-wallet_info_box edit-wallet_info_money"><em>{{walletInfo.subjectCurrentMoney}}</em><span>/</span><em>{{walletInfo.subjectRemainMoney}}</em></div>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
                <!-- 奖品详情 -->
                <el-tabs
                    @tab-click="prizeTabChange"
                    v-model="getGeneral(general.jackpot).tab_value"
                    type="card"
                    editable
                    @edit="handleAwardTabsEdit"
                    class="tabs-sort edit-set_tab"
                >
                    <el-tab-pane
                        style="padding:0px 5px;"
                        v-for="(item, index) in getGeneral(general.jackpot).tabs"
                        :key="item.id"
                        :label="item.name || '奖品'"
                        :name="item.seq"
                        :closable="item.close"
                        :data-set="index"
                    >
                        <span
                            v-if="item.status != 1"
                            class="edit-control_prizeStatus"
                            slot="label"
                        >{{item.name}}
                            <el-tooltip
                                :hide-after="1000"
                                class="item"
                                effect="light"
                                content="奖品已关闭"
                                placement="top-start"
                            >
                                <em><a class="edit-control_statusIcon"><i class="el-icon-prize-close"></i></a></em>
                            </el-tooltip>
                        </span>
                        <prize-part
                            :prize="item"
                            :index="index"
                            :typeOptions="info.prizesType"
                            :type="'general_' + general.jackpot"
                        >
                            <template v-slot:part-ext="slotProps">
                                <!-- 中奖概率 -->
                                <el-row
                                    type="flex"
                                    class="edit-control_ele"
                                    v-if="eleFillter('prize.probability_num', false) && general.probability_set"
                                >
                                    <el-col :span="6">
                                        <p>中奖概率：</p>
                                    </el-col>
                                    <el-col :span="18">
                                        <el-input-number
                                            @change="(val, oldVal) => { return countPercent(val, oldVal, slotProps.prize) }"
                                            size="medium"
                                            v-model="slotProps.prize.probability_num"
                                            :min="0"
                                            :max="slotProps.prize.maxPercentSet"
                                            :precision="0"
                                            label="中奖概率"
                                            @blur="percentBlur"
                                        ></el-input-number>
                                        <em> {{getGeneral(general.jackpot).percent_icon}}</em>
                                    </el-col>
                                </el-row>
                                <!-- 扩展设置 -->
                                <slot
                                    name="prizepart-ext"
                                    :prize="slotProps.prize"
                                >
                                </slot>
                            </template>
                            <template v-slot:limit-ext="slotProps">
                                <slot
                                    name="prizelimit-ext"
                                    :prize="slotProps.prize"
                                >
                                </slot>
                            </template>
                        </prize-part>
                    </el-tab-pane>
                </el-tabs>
                <!-- 无奖品引导层 -->
                <div
                    class="edit-control_handleTip"
                    v-if="appData.prize['general_' + general.jackpot].length == 0"
                >
                    <img
                        class="edit-control_handleLine"
                        src="https://activityres.jhm2012.com/gallery174/201910/1655455439.png"
                        alt=""
                    >
                    <div class="edit-control_handleGift">
                        <p class="edit-control_handleText">点击“+”以添加奖品</p>
                        <img
                            src="https://activityres.jhm2012.com/gallery174/201910/1655468367.png"
                            alt=""
                        >
                    </div>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Inject, Prop, Watch } from 'vue-property-decorator';
import { Dictionary } from "vuex";
import { State, Getter, Action, Mutation, namespace } from 'vuex-class'
import { listenMessage, MessageData, MessageType } from '../../message';
import Setting from './setting';
import Sortable from 'sortablejs';      // tab签拖动变换位置插件

// 奖品编辑模块
import prizePart from '../parts/prize-part.vue';
// 奖品vuex模块
const prizeModule = namespace('prize');

@Component({
    components: {
        prizePart
    },
    watch: {
        'appData.prize.index': {
            handler: function () {
                this[this.appData.prize.type].tab_value = this[this.appData.prize.type].tabs[this.appData.prize.index].seq || '';
                this[this.appData.prize.type].index = this.appData.prize.index;
            }
        }
    }
})
export default class PrizeSet extends Setting {
    constructor() {
        super({ 'warn': '活动开启后不可更改' })
    }
    @State('appData') appData!: Dictionary<any>
    @prizeModule.Mutation('prize_updateIndex') prize_updateIndex!: Function
    @prizeModule.Mutation('prize_updateType') prize_updateType!: Function
    @prizeModule.Mutation('prize_handle') prize_handle!: Function
    @Action('getWallet') getWallet!: Function
    @Getter public walletInfo!: Dictionary<any>
    @Mutation updateEditInfoStatus!: Function

    @Inject() debounce!: Function
    @Inject() onDataChange!: Function

    @Prop({
        type: Boolean,
        default: false
    })
    menuSwitch!: boolean

    private defaultPrizeData = {
        id: 0, // 奖品id
        jackpot: '1', // '1-默认奖池 2-安慰奖奖池(1)',
        is_valid: 2, // '是否有效 1-有效 2-无效 (系统添加置2-无效 用户主动保存后置1-有效禁止删除 )',
        short_name: '', // '奖品简称',
        name: '', // '奖品名称',
        type: '', // '奖品类型
        generic_code: '', // '通用码',
        num: 0, // '奖品数量(只能增加不能少于上次保存值)(100)',
        minnum: 0, // 默认最少奖品数量
        money: '0.00', // '奖品价值(9.99)',
        probability_num: 0, // '中奖概率(整数根据当前概率模式变限制)',
        pic_url: '', // 'type=file',
        desc: '', // '奖品说明(样例)',
        maxPercentSet: 0, // 可设置最大中奖概率
        use_url: '', // 线上消费地址
        prize_max_win_num: 0, // 奖品每天最大中奖次数
        prize_person_max_win_num: 1, // 每人最大中奖次数
        prize_person_day_max_win_num: 1, // 每人每天中奖次数
        status: 1, // 奖品开启状态 1-开启 2-关闭 关闭的奖品不计算奖品概率,转盘、活动介绍、我的奖品不显示
        is_dzq: '2', // 是否导入电子券 1-导，2-不导
        code_num: 0, // 券码数量
        input_num: 0, // 非券码数量
        other_temp_set: {}, // 其他配置
    }

    private percentSet = {
        options: [
            {
                value: 1,
                label: '百分率'
            },
            {
                value: 2,
                label: '千分率'
            },
            {
                value: 3,
                label: '万分率'
            }
        ],
        link: {
            1: 100,
            2: 1000,
            3: 10000
        },
        icon: {
            1: '%',
            2: '‰',
            3: '‱'
        }
    }

    // 奖池初始化数据 - 最多支持9个奖池
    general_1: Dictionary<any> = {};
    general_2: Dictionary<any> = {};
    general_3: Dictionary<any> = {};
    general_4: Dictionary<any> = {};
    general_5: Dictionary<any> = {};
    general_6: Dictionary<any> = {};
    general_7: Dictionary<any> = {};
    general_8: Dictionary<any> = {};
    general_9: Dictionary<any> = {};

    // 菜单选择
    private menuSelect!: Function;
    // 钱包显示
    private walletShow: boolean = false;

    // 第一次加载
    private isFirst: boolean = false;
    // 更新钱包信息
    private updateWallet: boolean = false;

    private sortEl!: any;
    private sortable!: any;

    mounted() {
        this.appData.prize.prizeSetCustom.forEach((item: Dictionary<any>) => {
            let key = 'general_' + item.jackpot;
            (<any>this)[key] = {
                tabs: this.appData.prize[key],
                tabs_pre: this.appData.prize[key],
                tab_value: this.appData.prize[key].length == 0 ? '' : this.appData.prize[key][this.appData.prize.index].seq, // 当前普通奖品编辑tab值
                index: 0,
                index_next: this.appData.prize[key].length,
                percent_max_set: 0,
                percent_total: 0,
                percent_icon: '',
                prize_title: item.title,
                probability_set: item.probability_set,
            };
            if (this.info.draw && item.probability_set) {
                if (this.info.draw.many_probability_set && this.info.draw.many_probability_set.length > 0) {
                    (<any>this)[key].percent_max_set = (<any>this).percentSet.link[this.info.draw.many_probability_set[item.jackpot]];
                    (<any>this)[key].percent_icon = (<any>this).percentSet.icon[this.info.draw.many_probability_set[item.jackpot]];
                } else {
                    (<any>this)[key].percent_max_set = (<any>this).percentSet.link[this.info.draw.probability];
                    (<any>this)[key].percent_icon = (<any>this).percentSet.icon[this.info.draw.probability];
                }
            }
        });
        this.$nextTick(() => {
            // 计算每个奖池总中奖概率
            this.appData.prize.prizeSetCustom.forEach((item: Dictionary<any>) => {
                let key = 'general_' + item.jackpot;
                if (item.probability_set) {
                    (<any>this)[key].tabs.forEach((prize: Dictionary<any>, index: number) => {
                        if (prize.status == 1) {
                            (<any>this)[key].percent_total += prize.probability_num;
                        }
                    });
                }
            });

            // 初始化每个奖品还可设置最大中奖概率值
            this.appData.prize.prizeSetCustom.forEach((item: Dictionary<any>) => {
                let key = 'general_' + item.jackpot;
                if (item.probability_set) {
                    (<any>this)[key].tabs.forEach((prize: Dictionary<any>, index: number) => {
                        prize.maxPercentSet = prize.probability_num + (<any>this)[key].percent_max_set - (<any>this)[key].percent_total;
                    });
                }
                this.updatePrizeTabs((<any>this)[key].tabs, key);
                this.$watch(key + '.tabs', (tab, type) => { return this.watchPrizeTabs((<any>this)[key].tabs, key) }, { deep: true });
            });
        })
    }

    public getGeneral(a: any) {
        return (<any>this)['general_' + a];
    }

    public updatePrizeTabs(tabs: Dictionary<any>, type: string) {
        window.setTimeout(() => {
            let isWallet = false;
            let isCount = false;
            tabs.forEach((prize: Dictionary<any>, index: number) => {
                // 判断该奖品是否可删除
                if (!prize.close) {
                    $('#pane-' + type).find('#tab-' + prize.tabIndex).find('span.el-icon-close').eq(0).hide();
                }

                if (prize.type == 'money') {
                    this.walletShow = true;
                    isWallet = true;
                    let tabs = (<any>this)[type].tabs_pre;
                    if (prize.input_num != tabs[index].input_num || prize.money != tabs[index].money || prize.type != tabs[index].type || prize.minnum != tabs[index].minnum) {
                        isCount = true;
                    }
                }
                if (index == tabs.length - 1 && !isWallet) {
                    this.walletShow = false;
                }
            })
            this.prize_handle(this.appData);
            this.storePreData(tabs, type);
            if (isCount || !this.isFirst) {
                this.countMoney();
            }
            this.isFirst = true;
        }, 500)
    }

    public watchPrizeTabs(tabs: Dictionary<any>, type: string) {
        this.updatePrizeTabs(tabs, type);
        // 传递消息
        this.onDataChange(MessageType.update);
        // 更改编辑数据状态
        this.updateEditInfoStatus(1);
    }

    countMoney = this.debounce(function () {
        if (!this.walletShow) return false;

        let prizeMoney = 0;

        let prizeTabs: Dictionary<any> = [];

        this.appData.prize.prizeSetCustom.forEach((item: Dictionary<any>) => {
            let key = 'general_' + item.jackpot;
            prizeTabs = prizeTabs.concat((<any>this)[key].tabs);
        });

        prizeTabs.forEach((prize: Dictionary<any>) => {
            if (prize.type == 'money' && prize.status == 1) { // 开启的红包奖品
                prizeMoney += prize.input_num * prize.money;
            }
        })
        this.updateWallet = true;
        this.getWallet(prizeMoney).then(() => {
            this.updateWallet = false;
        })
    }, 1000)

    public storePreData(tabs: any, type: string) {
        (<any>this)[type].tabs_pre = [];
        tabs.forEach((tab: Dictionary<any>, index: number) => {
            (<any>this)[type].tabs_pre.push({ id: tab.id, input_num: tab.input_num, money: tab.money, type: tab.type, minnum: tab.minnum });
        });
    }

    // 计算总中奖概率
    public countPercent(val: number, oldVal: number, prize: Dictionary<any>) {
        if (prize.status == 1) {
            val = val == undefined ? 0 : val;
            oldVal = oldVal == undefined ? 0 : oldVal;
            val = val > prize.maxPercentSet ? prize.maxPercentSet : val;
            prize.probability_num = val;

            (<any>this)[this.appData.prize.type].percent_total = (<any>this)[this.appData.prize.type].percent_total + val - oldVal;
            (<any>this)[this.appData.prize.type].tabs.forEach((prize: Dictionary<any>) => {
                prize.maxPercentSet = prize.probability_num + (<any>this)[this.appData.prize.type].percent_max_set - (<any>this)[this.appData.prize.type].percent_total;
            });
        }
    }

    // 奖品切换
    public prizeTabChange(tab: Dictionary<any>) {
        let prizeIndex = tab.$attrs['data-set'];
        (<any>this)[this.appData.prize.type].index = prizeIndex;
        this.prize_updateIndex(prizeIndex);
        if (this.menuSwitch) {
            this.menuSelect('/e/actId/detail/prizeId');
        }
    }

    // 奖池切换
    public prizeTypeChange(tab: Dictionary<any>) {
        let prizeType = tab.$attrs['data-set'];
        this.appData.prize.type = prizeType;
        this.prize_updateIndex((<any>this)[prizeType].index);

        setTimeout(() => {
            this.sortEl = $('#pane-' + prizeType).find('.tabs-sort').find('.el-tabs__nav')[0];
            this.sortable = Sortable.create(this.sortEl as HTMLElement, {
                onEnd: (evt: Dictionary<any>) => {
                    const tempIndex = (<any>this)[prizeType].tabs.splice(evt.oldIndex, 1)[0];
                    (<any>this)[prizeType].tabs.splice(evt.newIndex, 0, tempIndex);
                }
            });
        }, 500)
    }

    // 选择中奖概率
    public choosePercent(val: number) {
        (<any>this)[this.appData.prize.type].percent_max_set = (<any>this).percentSet.link[val];
        (<any>this)[this.appData.prize.type].percent_icon = (<any>this).percentSet.icon[val];

        (<any>this)[this.appData.prize.type].tabs.forEach((prize: Dictionary<any>) => {
            prize.maxPercentSet = prize.probability_num + (<any>this)[this.appData.prize.type].percent_max_set - (<any>this)[this.appData.prize.type].percent_total;
        });
    }

    // 奖品操作
    public handleAwardTabsEdit(targetName: string, action: string) {
        let jackpot = this.appData.prize.type.split('_')[1];
        let tabs = (<any>this)[this.appData.prize.type].tabs;
        let tabValue = (<any>this)[this.appData.prize.type].tab_value;

        if (action === 'add') {
            let nextIndex = tabs.length + 1;
            let nextTabName = (++(<any>this)[this.appData.prize.type].index_next).toString();

            this.$http.post(this.apiList.addPrizeUrl, { jackpot: jackpot }).then((res: Dictionary<any>) => {
                if (res.status == 'success') {
                    let obj = $.extend({}, this.defaultPrizeData, res.data);
                    obj.title = (<any>this)[this.appData.prize.type].prize_title;
                    obj.name = (<any>this)[this.appData.prize.type].prize_title;
                    obj.tabIndex = nextIndex;
                    obj.seq = nextTabName;
                    obj.close = true;
                    obj.changeIndex = 0;

                    tabs.push(obj);
                    (<any>this)[this.appData.prize.type].tab_value = nextTabName;

                    if ((<any>this)[this.appData.prize.type].probability_set) {
                        tabs.forEach((prize: Dictionary<any>) => {
                            prize.maxPercentSet = prize.probability_num + (<any>this)[this.appData.prize.type].percent_max_set - (<any>this)[this.appData.prize.type].percent_total;
                        });
                    }

                    this.resetTabIndex(tabs);
                } else {
                    this.$message({
                        message: res.message,
                        type: 'warning'
                    })
                }
            })
        }
        if (action === 'remove') {
            let prizeId = '';
            tabs.forEach((tab: Dictionary<any>) => {
                if (tab.seq == targetName) {
                    prizeId = tab.id;
                }
            })

            this.$http.post(this.apiList.delPrizeUrl, { prizeId: prizeId }).then((res: Dictionary<any>) => {
                if (res.status == 'success') {
                    this.$message(res.message);
                    if (tabValue == targetName) {
                        tabs.forEach((tab: Dictionary<any>, index: number) => {
                            if (tab.seq == targetName) {
                                let nextTab = tabs[index + 1] || tabs[index - 1]
                                if (nextTab) {
                                    (<any>this)[this.appData.prize.type].tab_value = nextTab.seq;
                                }
                            }
                        })
                    }

                    tabs.forEach((prize: Dictionary<any>, index: number) => {
                        if (prize.seq == targetName) {
                            tabs.splice(index, 1)
                        }
                    });

                    // 计算每个奖池总中奖概率
                    this.appData.prize.prizeSetCustom.forEach((item: Dictionary<any>) => {
                        let key = 'general_' + item.jackpot;
                        if (item.probability_set) {
                            (<any>this)[key].percent_total = 0;
                            (<any>this)[key].tabs.forEach((prize: Dictionary<any>, index: number) => {
                                if (prize.status == 1) {
                                    (<any>this)[key].percent_total += prize.probability_num;
                                }
                            });
                        }
                    });

                    // 初始化每个奖品还可设置最大中奖概率值
                    this.appData.prize.prizeSetCustom.forEach((item: Dictionary<any>) => {
                        let key = 'general_' + item.jackpot;
                        if (item.probability_set) {
                            (<any>this)[key].tabs.forEach((prize: Dictionary<any>, index: number) => {
                                prize.maxPercentSet = prize.probability_num + (<any>this)[key].percent_max_set - (<any>this)[key].percent_total;
                            });
                        }
                        this.updatePrizeTabs((<any>this)[key].tabs, key);
                    });

                    if ((<any>this)[this.appData.prize.type].probability_set) {
                        // 计算每个奖池总中奖概率
                        (<any>this)[this.appData.prize.type].percent_total = 0;
                        tabs.forEach((prize: Dictionary<any>) => {
                            if (prize.status == 1) {
                                (<any>this)[this.appData.prize.type].percent_total += prize.probability_num;
                            }
                            prize.maxPercentSet = prize.probability_num + (<any>this)[this.appData.prize.type].percent_max_set - (<any>this)[this.appData.prize.type].percent_total;
                        });

                        // 更新每个奖品还可设置最大中奖概率值
                        tabs.forEach((prize: Dictionary<any>) => {
                            if (prize.status == 1) {
                                prize.maxPercentSet = prize.probability_num + (<any>this)[this.appData.prize.type].percent_max_set - (<any>this)[this.appData.prize.type].percent_total;
                            }
                        });
                    }

                    this.resetTabIndex(tabs);
                } else {
                    this.$message({
                        message: res.message,
                        type: 'warning'
                    });
                }
            })
        }
    }

    public resetTabIndex(tabs: Dictionary<any>) {
        tabs.forEach((tab: Dictionary<any>, index: number) => {
            if (!tab.close) {
                $('#pane-' + this.appData.prize.type).find('#tab-' + (index + 1)).find('span.el-icon-close').eq(0).hide();
            }
        })

        let prizeIndex = tabs.length - 1 < 0 ? 0 : tabs.length - 1;
        (<any>this)[this.appData.prize.type].index = prizeIndex;
        this.prize_updateIndex(prizeIndex);
    }

    public percentBlur(e: any) {
        let el = e.target;
        if ($(el).val() == '') {
            $(el).val(0)
        }
    }
}
</script>


<style lang="scss" scoped>
.over {
    color: red !important;
}

.edit-control_ele_percent_icon {
    font-size: 16px;
    padding-left: 10px;
}

.edit-wallet_info {
    text-align: center;
    margin-top: -14px;

    .edit-wallet_info_text {
        font-weight: bold;
        display: flex;
        justify-content: space-around;
        background: #f5f5f5;
        border-right: 1px solid #ddd;

        em {
            display: block;
            width: 47%;
        }

        em:first-child {
            text-align: right;
        }

        em:last-child {
            text-align: left;
        }

        span {
            display: block;
            width: 3%;
        }
    }

    .edit-wallet_info_money {
        em:first-child {
            color: #ff4e1f;
            font-size: 26px;
        }

        em:last-child {
            text-align: left;
            font-size: 16px;
        }
    }
}
</style>
