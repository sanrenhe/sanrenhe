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
                        :span="6"
                    >
                        <p>
                            <el-popover
                                placement="bottom"
                                width="50"
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
                    <el-col :span="5">
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
                <!-- 每天登录新增抽奖机会 -->
                <el-row
                    type="flex"
                    class="edit-control_ele"
                    v-if="eleFillter('draw.day_add_draw_num')"
                >
                    <el-col
                        class="edit-title_long"
                        :span="6"
                    >
                        <p>
                            <el-popover
                                placement="bottom"
                                width="50"
                                trigger="hover"
                                :content="popover.warn"
                            >
                                <i
                                    slot="reference"
                                    class="el-icon-my-warn"
                                ></i>
                            </el-popover>
                            每天登录新增抽奖机会：
                        </p>
                    </el-col>
                    <el-col :span="4">
                        <el-switch
                            active-text="增"
                            inactive-text="不增"
                            active-value="1"
                            inactive-value="2"
                            v-model="day_add_draw_num_switch"
                            @change="i => info.draw.day_add_draw_num = i == '2' ? 0 : 1"
                            :disabled="info.activity.status == 1"
                        >
                        </el-switch>
                    </el-col>
                    <template v-if="day_add_draw_num_switch == '1'">
                        <el-col
                            :span="4"
                            :push="1"
                        >
                            <p class="num_text">每日登录即可获得</p>
                        </el-col>
                        <el-col
                            :span="5"
                            :push="1"
                        >
                            <el-input-number
                                size="small"
                                controls-position="right"
                                :min="0"
                                :max="99"
                                :precision="0"
                                v-model="info.draw.day_add_draw_num"
                                @blur="(e) => info.draw.day_add_draw_num = filterElInputNumber(info.draw.day_add_draw_num, 1)"
                                @change="i => day_add_draw_num_switch = i == 0 ? '2' : '1'"
                                :disabled="info.activity.status == 1"
                            ></el-input-number>
                        </el-col>
                    </template>
                </el-row>
                <!-- 分享送抽奖机会 -->
                <el-row
                    type="flex"
                    class="edit-control_ele"
                    v-if="eleFillter('draw.day_add_draw_num')"
                >
                    <el-col
                        class="edit-title_long"
                        :span="6"
                    >
                        <p>
                            分享送抽奖机会：
                        </p>
                    </el-col>
                    <el-col :span="4">
                        <el-switch
                            active-text="增"
                            inactive-text="不增"
                            active-value="1"
                            inactive-value="2"
                            v-model="share_switch"
                            @change="i => {info.draw.forward_draw_count = i == '2' ? 0 : 1; info.draw.forward_draw_count_limit = i == '2' ? 0 : 1}"
                        >
                        </el-switch>
                    </el-col>
                    <template v-if="share_switch == '1'">
                        <el-col :span="7">
                            <p class="num_text">每分享1人送 <el-input-number
                                    size="mini"
                                    controls-position="right"
                                    :min="0"
                                    :max="9999"
                                    :precision="0"
                                    v-model="info.draw.forward_draw_count"
                                    @blur="(e) => info.draw.forward_draw_count = filterElInputNumber(info.draw.forward_draw_count, 1)"
                                    @change="i => share_switch = (i == 0 && info.draw.forward_draw_count_limit == 0) ? '2' : '1'"
                                    style="width: 100px;"
                                ></el-input-number> 次</p>
                        </el-col>
                        <el-col :span="7">
                            <p class="num_text">每天每人上限 <el-input-number
                                    size="mini"
                                    controls-position="right"
                                    :min="0"
                                    :max="9999"
                                    :precision="0"
                                    v-model="info.draw.forward_draw_count_limit"
                                    @blur="(e) => info.draw.forward_draw_count_limit = filterElInputNumber(info.draw.forward_draw_count_limit, 1)"
                                    @change="i => share_switch = (i == 0 && info.draw.forward_draw_count == 0) ? '2' : '1'"
                                    style="width: 100px;"
                                ></el-input-number> 次</p>

                        </el-col>
                    </template>
                </el-row>
                <!-- 扩展设置 -->
                <slot name="draw-ext">
                </slot>
            </el-collapse-item>
        </el-collapse>
        <!-- 中奖设置 -->
        <el-collapse v-model="activeNames.active">
            <el-collapse-item
                title="中奖设置"
                name="win"
            >
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
                        :span="6"
                    >
                        <p>活动期间每人最多可以中奖：</p>
                    </el-col>
                    <el-col :span="5">
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
                        :span="6"
                    >
                        <p>活动期间每天最多可以中奖：</p>
                    </el-col>
                    <el-col :span="5">
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
                <!-- 奖品每天放奖时间 -->
                <el-row
                    type="flex"
                    class="edit-control_ele"
                    v-if="eleFillter('draw.win_start_time')"
                >
                    <el-col
                        class="edit-title_long"
                        :span="6"
                    >
                        <p>
                            奖品每天放奖时间：
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
                <!-- 未中奖文案 -->
                <el-row
                    type="flex"
                    class="edit-control_ele"
                    v-if="eleFillter('draw.nowin_text')"
                >
                    <el-col
                        class="edit-title_long"
                        :span="6"
                    >
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
                <slot name="limit-ext">
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

    // 每天登录新增抽奖机会开关
    private day_add_draw_num_switch: string = '2';
    // 分享送抽奖机会开关
    private share_switch: string = '2';

    mounted() {
        this.share_switch = (this.info.draw.forward_draw_count == 0 && this.info.draw.forward_draw_count_limit == 0) ? '2' : '1';
        this.day_add_draw_num_switch = this.info.draw.day_add_draw_num == 0 ? '2' : '1';
    }

    @Watch('share_switch')
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


<style lang="scss" scoped>
.el-switch {
    height: 2.25rem;
}
.num_text {
    line-height: 2.25rem;
}
</style>
