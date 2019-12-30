<template>
    <div>
        <el-tabs
            @tab-click="goodsTabChange"
            v-model="goodsTabValue"
            type="card"
            editable
            @edit="handleGoodsTabsEdit"
            class="edit-set_tab"
        >
            <!-- 商品 -->
            <el-tab-pane
                style="padding:0px 5px;"
                :key="goods.id"
                v-for="(goods, index) in goodsTabs"
                :data-set="index"
                :label="goods.name"
                :name="goods.seq"
                :closable="goods.close"
            >
                <span
                    v-if="goods.status != 1"
                    class="edit-control_prizeStatus"
                    slot="label"
                >{{goods.name}}
                    <el-tooltip
                        :hide-after="1000"
                        class="item"
                        effect="light"
                        content="商品已关闭"
                        placement="top-start"
                    >
                        <em><a class="edit-control_statusIcon"><i class="el-icon-prize-close"></i></a></em>
                    </el-tooltip>
                </span>
                <goods-part
                    :goods="goods"
                    :index="index"
                    :typeOptions="info.goodsType"
                >
                    <template v-slot:part-ext="slotProps">
                        <slot
                            name="goodspart-ext"
                            :goods="slotProps.goods"
                        >
                        </slot>
                    </template>
                    <template v-slot:limit-ext="slotProps">
                        <slot
                            name="goodslimit-ext"
                            :goods="slotProps.goods"
                        >
                        </slot>
                    </template>
                </goods-part>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Inject, Prop, Watch } from 'vue-property-decorator';
import { Dictionary } from "vuex";
import { State, Mutation, namespace } from 'vuex-class'
import Setting from './setting';
import { filterExt } from '../../utils/extHandle';
import { listenMessage, MessageData, MessageType } from '../../message';

// 商品编辑模块
import goodsPart from '../parts/goods-part.vue';
// 商品vuex模块
const goodsModule = namespace('goods');
@Component({
    components: {
        goodsPart
    },
    watch: {
        'appData.goods.index': {
            handler: function () {
                this.goodsTabValue = this.appData.goods.list[this.appData.goods.index].seq;
            }
        }
    }
})
export default class GoodsSet extends Setting {
    constructor() {
        super({ 'warn': '活动开启后不可更改' })
    }

    @State('appData') appData!: Dictionary<any>
    @goodsModule.Mutation('goods_updateIndex') goods_updateIndex!: Function
    @goodsModule.Mutation('goods_handle') goods_handle!: Function
    @Mutation updateEditInfoStatus!: Function

    @Inject() onDataChange!: Function

    private defaultGoodsData = {
        "id": 1, //商品ID
        "name": "", //商品名称
        "short_name": "",//商品简称
        "pic_url": "",//商品图片
        "type": "",//商品类型 swyj实物-邮寄 pmlq实物-凭码领取 xsxf电子券线上消费 xxxf电子券线下消费 tyq通用券
        "is_dzq": 0,//是否关联电子券 1-是 2-否
        "generic_code": "",//通用码
        "use_url": "",//使用地址
        "order": 0,//排序
        "is_valid": 2,//是否有效 1-有效 2-无效
        "status": 1,//1-开启 2-关闭
        "price": "0.00",//现价
        "cost_price": "0.00",//原价
        "num": 0,//库存
        "code_num": 0, // 券码数量
        "input_num": 0, // 非券码数量
        "minnum": 0, // 默认最少奖品数量
        "other_temp_set": {}, // 扩展设置
        "content": {}
    }

    private goodsTabs: Dictionary<any> = []
    private goodsIndex: number = 0
    private goodsTabValue: string = ''
    private goodsNextIndex!: number
    private menuSelect!: Function

    mounted() {
        this.goodsTabs = this.appData.goods.list;
        this.goodsTabValue = this.appData.goods.list.length == 0 ? '' : this.appData.goods.list[this.appData.goods.index].seq;
        this.goodsNextIndex = this.appData.goods.list.length;

        // 更新商品列表
        this.updateGoods();

        this.$nextTick(() => {
            // 监听商品数据
            this.$watch('goodsTabs', () => { return this.watchGoodsTabs() }, { deep: true });
        });
    }

    public updateGoods() {
        window.setTimeout(() => {
            this.goodsTabs.forEach((tab: Dictionary<any>, index: number) => {
                if (!tab.close) {
                    $('#pane-goods').find('#tab-' + (index + 1)).find('span.el-icon-close').eq(0).hide();
                }
            })
            this.goods_handle(this.appData);
        }, 500)
    }

    public watchGoodsTabs() {
        this.updateGoods();
        // 传递消息
        this.onDataChange(MessageType.update);
        // 更改编辑数据状态
        this.updateEditInfoStatus(1);
    }

    // 商品切换
    public goodsTabChange(tab: Dictionary<any>) {
        this.goodsIndex = tab.$attrs['data-set'];
        this.goods_updateIndex(tab.$attrs['data-set']);
        this.menuSelect('/e/actId/detail/goodsId');
    }

    // 商品操作
    public handleGoodsTabsEdit(targetName: string, action: string) {
        let tabs = this.goodsTabs;
        let tabValue = this.goodsTabValue;
        if (action === 'add') {
            let nextIndex = tabs.length + 1;
            let nextTabName = (++this.goodsNextIndex).toString();

            this.$http.post(this.apiList.addGoodsUrl).then((res: Dictionary<any>) => {
                if (res.status == 'success') {
                    let obj = $.extend({}, this.defaultGoodsData, res.data);
                    obj.title = '商品' + nextIndex;
                    obj.name = '商品' + nextIndex + '号';
                    obj.seq = nextTabName;
                    obj.close = true;
                    obj.content = {
                        "detail": "",
                        "notice": ""
                    }

                    this.info.ext.forEach((ext: Dictionary<any>) => {
                        if (ext.type != 1 && ext.belong.split('.')[0] == 'goods') {
                            let extEditKeys = ext.key.split(",");
                            extEditKeys.forEach((key: any) => {
                                obj[ext.belong.split('.')[1]][key] = filterExt(ext, obj[ext.belong.split('.')[1]][key]);
                            });
                        }
                    })

                    tabs.push(obj);
                    this.goodsTabValue = nextTabName;

                    this.resetTabIndex();
                } else {
                    this.$message({
                        message: res.message,
                        type: 'warning'
                    })
                }
            })
        }
        if (action === 'remove') {
            var goodsId = '';
            tabs.forEach((tab: Dictionary<any>, index: number) => {
                if (tab.seq == targetName) {
                    goodsId = tab.id;
                }
            });

            this.$http.post(this.apiList.delGoodsUrl, { goodsId: goodsId }).then((res: Dictionary<any>) => {
                if (res.status == 'success') {
                    this.$message(res.message);
                    if (tabValue === targetName) {
                        tabs.forEach((tab: Dictionary<any>, index: number) => {
                            if (tab.seq === targetName) {
                                var nextTab = tabs[index + 1] || tabs[index - 1];
                                if (nextTab) {
                                    tabValue = nextTab.seq;
                                }
                            }
                        });
                    }

                    tabs.forEach((goods: Dictionary<any>, index: number) => {
                        if (goods.seq == targetName) {
                            tabs.splice(index, 1);
                        }
                    });

                    tabs.forEach((goods: Dictionary<any>, index: number) => {
                        goods.title = '商品' + (index + 1);
                    });

                    this.resetTabIndex();
                } else {
                    this.$message({
                        message: res.message,
                        type: 'warning'
                    });
                }
            })
        }
    }

    public resetTabIndex() {
        this.goodsTabs.forEach((tab: Dictionary<any>, index: number) => {
            if (!tab.close) {
                $('#pane-goods').find('#tab-' + (index + 1)).find('span.el-icon-close').eq(0).hide();
            }
        })
        this.goodsIndex = this.goodsTabs.length - 1 < 0 ? 0 : this.goodsTabs.length - 1;
        this.goods_updateIndex(this.goodsIndex);
    }
}

</script>

<style lang="scss" scoped>
</style>
