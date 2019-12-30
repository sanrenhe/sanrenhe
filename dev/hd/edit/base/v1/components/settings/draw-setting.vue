<template>
    <div>
        <!-- 抽奖设置 -->
        <el-collapse v-model="activeNames.active">
            <el-collapse-item
                title="抽奖设置"
                name="draw"
            >
                <!-- 抽奖机会设置 -->
                <el-divider
                    content-position="left"
                    v-if="eleFillter('draw.default_draw_num') || eleFillter('draw.day_add_draw_num')"
                >
                    抽奖机会设置
                    <el-popover
                        placement="bottom"
                        width="460"
                        trigger="hover"
                        :content="popover.drawTip"
                    >
                        <i
                            slot="reference"
                            class="el-icon-question"
                        ></i>
                    </el-popover>
                </el-divider>
                <!-- 首次进入活动抽奖机会 -->
                <el-row
                    type="flex"
                    class="edit-control_ele"
                    v-if="eleFillter('draw.default_draw_num')"
                >
                    <el-col
                        class="edit-title_long"
                        :span="10"
                    >
                        <p>
                            <el-popover
                                placement="bottom"
                                width="200"
                                trigger="hover"
                                :content="popover.warn"
                            >
                                <i
                                    slot="reference"
                                    class="el-icon-my-warn"
                                ></i>
                            </el-popover>
                            首次进入活动抽奖机会：
                        </p>
                    </el-col>
                    <el-col :span="10">
                        <el-input-number
                            size="small"
                            controls-position="right"
                            :min="0"
                            :max="99"
                            :precision="0"
                            v-model="info.draw.default_draw_num"
                            @blur="(e) => info.draw.default_draw_num = filterElInputNumber(info.draw.default_draw_num, 1)"
                            :disabled="info.activity.status == 1"
                        ></el-input-number>
                    </el-col>
                </el-row>
                <!-- 每天新增抽奖机会 -->
                <el-row
                    type="flex"
                    class="edit-control_ele"
                    v-if="eleFillter('draw.day_add_draw_num')"
                >
                    <el-col
                        class="edit-title_long"
                        :span="10"
                    >
                        <p>
                            <el-popover
                                placement="bottom"
                                width="200"
                                trigger="hover"
                                :content="popover.warn"
                            >
                                <i
                                    slot="reference"
                                    class="el-icon-my-warn"
                                ></i>
                            </el-popover>
                            每天新增抽奖机会：
                        </p>
                    </el-col>
                    <el-col :span="10">
                        <el-input-number
                            size="small"
                            controls-position="right"
                            :min="0"
                            :max="99"
                            :precision="0"
                            v-model="info.draw.day_add_draw_num"
                            @blur="(e) => info.draw.day_add_draw_num = filterElInputNumber(info.draw.day_add_draw_num, 1)"
                            :disabled="info.activity.status == 1"
                        ></el-input-number>
                    </el-col>
                </el-row>
                <!-- 中奖限制设置 -->
                <el-divider
                    content-position="left"
                    v-if="eleFillter('draw.person_max_win_num') || eleFillter('draw.day_max_win_num')"
                >
                    中奖限制<em class="edit-divider_tip">（0代表不限制）</em>
                    <el-popover
                        placement="bottom"
                        width="660"
                        trigger="hover"
                        :content="popover.drawPerson"
                    >
                        <i
                            slot="reference"
                            class="el-icon-question"
                        ></i>
                    </el-popover>
                </el-divider>
                <!-- 活动期间每人最多可以中奖 -->
                <el-row
                    type="flex"
                    class="edit-control_ele"
                    v-if="eleFillter('draw.person_max_win_num')"
                >
                    <el-col
                        class="edit-title_long"
                        :span="10"
                    >
                        <p>活动期间每人最多可以中奖：</p>
                    </el-col>
                    <el-col :span="10">
                        <el-input-number
                            controls-position="right"
                            :min="0"
                            :max="99999999"
                            :precision="0"
                            v-model="info.draw.person_max_win_num"
                            @blur="(e) => info.draw.person_max_win_num = filterElInputNumber(info.draw.person_max_win_num, 1)"
                        ></el-input-number>
                    </el-col>
                </el-row>
                <!-- 活动期间每天最多可以中奖 -->
                <el-row
                    type="flex"
                    class="edit-control_ele"
                    v-if="eleFillter('draw.day_max_win_num')"
                >
                    <el-col
                        class="edit-title_long"
                        :span="10"
                    >
                        <p>活动期间每天最多可以中奖：</p>
                    </el-col>
                    <el-col :span="10">
                        <el-input-number
                            controls-position="right"
                            :min="0"
                            :max="99999999"
                            :precision="0"
                            v-model="info.draw.day_max_win_num"
                            @blur="(e) => info.draw.day_max_win_num = filterElInputNumber(info.draw.day_max_win_num, 1)"
                        ></el-input-number>
                    </el-col>
                </el-row>
                <!-- 其他设置 -->
                <el-divider
                    content-position="left"
                    v-if="eleFillter('draw.win_start_time') || eleFillter('draw.nowin_text')"
                >
                    其他设置
                </el-divider>
                <!-- 奖品放奖时间 -->
                <el-row
                    type="flex"
                    class="edit-control_ele"
                    v-if="eleFillter('draw.win_start_time')"
                >
                    <el-col :span="6">
                        <p>
                            奖品放奖时间：
                            <el-popover
                                placement="bottom"
                                width="300"
                                trigger="hover"
                                :content="popover.drawTime"
                            >
                                <i
                                    slot="reference"
                                    class="el-icon-question"
                                ></i>
                            </el-popover>
                        </p>
                    </el-col>
                    <el-col :span="18">
                        <el-input-number
                            size="small"
                            controls-position="right"
                            :min="0"
                            :max="23"
                            :precision="0"
                            v-model="info.draw.win_start_time"
                            @blur="(e) => info.draw.win_start_time = filterElInputNumber(info.draw.win_start_time, 0)"
                        ></el-input-number>
                        时 至
                        <el-input-number
                            size="small"
                            controls-position="right"
                            :min="info.draw.win_start_time + 1"
                            :max="24"
                            :precision="0"
                            v-model="info.draw.win_end_time"
                            @blur="(e) => info.draw.win_end_time = filterElInputNumber(info.draw.win_end_time, 24)"
                        ></el-input-number>
                        时
                    </el-col>
                </el-row>
                <!-- 分享机制 -->
                <el-row
                    type="flex"
                    class="edit-control_ele"
                    v-if="eleFillter('draw.forward_draw_count')"
                >
                    <el-col :span="6">
                        <p>分享机制：</p>
                    </el-col>
                    <el-col :span="18">
                        <el-select
                            v-model="forwardType"
                            placeholder="请选择分享机制"
                        >
                            <el-option
                                v-for="item in forwardOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            >
                            </el-option>
                        </el-select>
                    </el-col>
                </el-row>
                <!-- 分享规则 -->
                <el-row
                    type="flex"
                    class="edit-control_ele"
                    v-if="forwardType == 1 && eleFillter('draw.forward_draw_count')"
                >
                    <el-col :span="6">
                        <p>
                            分享规则：
                            <el-popover
                                placement="bottom"
                                width="580"
                                trigger="hover"
                                :content="popover.shareRule"
                            >
                                <i
                                    slot="reference"
                                    class="el-icon-question"
                                ></i>
                            </el-popover>
                        </p>
                    </el-col>
                    <el-col :span="18">
                        每分享1人访问送
                        <el-input-number
                            size="small"
                            controls-position="right"
                            :min="0"
                            :max="9999"
                            :precision="0"
                            v-model="info.draw.forward_draw_count"
                            @blur="(e) => info.draw.forward_draw_count = filterElInputNumber(info.draw.forward_draw_count, 0)"
                        ></el-input-number> 次抽奖机会，
                        每天上限
                        <el-input-number
                            size="small"
                            controls-position="right"
                            :min="0"
                            :max="9999"
                            :precision="0"
                            v-model="info.draw.forward_draw_count_limit"
                            @blur="(e) => info.draw.forward_draw_count_limit = filterElInputNumber(info.draw.forward_draw_count_limit, 0)"
                        ></el-input-number> 次
                    </el-col>
                </el-row>
                <!-- 未中奖文案 -->
                <el-row
                    type="flex"
                    class="edit-control_ele"
                    v-if="eleFillter('draw.nowin_text')"
                >
                    <el-col :span="6">
                        <p>未中奖文案：</p>
                    </el-col>
                    <el-col :span="18">
                        <el-input
                            type="textarea"
                            placeholder="请输入内容"
                            maxlength="20"
                            show-word-limit
                            v-model="info.draw.nowin_text"
                        >
                        </el-input>
                    </el-col>
                </el-row>
                <!-- 扩展设置 -->
                <slot name="set-ext">
                </slot>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Inject, Prop, Watch } from 'vue-property-decorator';
import { State } from 'vuex-class'
import Setting from './setting';
import { Dictionary } from 'vuex';

@Component({
    watch: {
        'info.draw.forward_draw_count': {
            handler: function (val: number, oldVal: number) {
                if (val > oldVal && this.info.draw.forward_draw_count_limit <= oldVal) {
                    this.info.draw.forward_draw_count_limit = val;
                }
            }
        },
        'info.draw.win_start_time': {
            handler: function (val: number, oldVal: number) {
                if (val > oldVal && this.info.draw.win_end_time <= oldVal + 1) {
                    this.info.draw.win_end_time = val + 1;
                }
            }
        }
    }
})
export default class drawSet extends Setting {
    constructor() {
        super({
            'warn': '活动开启后不可更改', 'draw': '【首次进入活动抽奖机会】活动发布后，用户参与活动，获得N次抽奖机会【每天新增抽奖机会】活动发布后，用户每天首次登录活动，即可获得N次抽奖机会，当天抽奖机会未用完可累计',
            'drawTip': '【首次进入活动抽奖机会】活动发布后，用户参与活动，获得N次抽奖机会【每天新增抽奖机会】活动发布后，用户每天首次登录活动，即可获得N次抽奖机会，当天抽奖机会未用完可累计',
            'drawPerson': '【活动期间每人最多可以中奖次数】指在整个活动期间，每人最多可以中普通奖品的次数（安慰奖不含）【活动期间每天最多可以中奖次数】指在整个活动期间，每天最多可以中普通奖品的次数（安慰奖不含）',
            'drawTime': '奖品每天可被抽中时间段，若全天请选0-24点，时间段外用户可以抽奖，但无法中奖',
            'shareRule': '【每分享1人访问送N次抽奖机会】每分享1个好友，好友参与活动，即可获赠相应的抽奖机会【上限N次】用户每天分享所得抽奖机会不得超过上限次数'
        })
    }

    @Prop({
        type: Array,
        default: () => {
            return [{
                value: '1',
                label: '分享送抽奖次数'
            },
            {
                value: '2',
                label: '分享不送抽奖次数'
            }
            ]
        }
    })
    forwardOptions!: Dictionary<any>

    private forwardType: string = ''

    mounted() {
        this.forwardType = (this.info.draw.forward_draw_count == 0 && this.info.draw.forward_draw_count_limit == 0) ? '2' : '1'
    }

    @Watch('forwardType')
    onTypeChange(type: string) {
        if (type == '2') {
            this.info.draw.forward_person_num = 0;
            this.info.draw.forward_draw_count = 0;
            this.info.draw.forward_draw_count_limit = 0;
        } else {
            this.info.draw.forward_person_num = 1;
        }
    }
}
</script>


<style>
</style>
