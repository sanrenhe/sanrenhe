<template>
    <div>
        <!-- 助力设置 -->
        <el-collapse v-model="activeNames.active">
            <el-collapse-item
                title="助力设置"
                name="help"
            >
                <!-- 发起助力限制 -->
                <el-divider
                    content-position="left"
                    v-if="eleFillter('help.setting.everyone_max_launch_num') || eleFillter('help.setting.everyone_day_max_launch_num')"
                >
                    发起助力限制
                </el-divider>
                <!-- 每人总发起助力机会 -->
                <el-row
                    type="flex"
                    class="edit-control_ele"
                    v-if="eleFillter('help.setting.everyone_max_launch_num')"
                >
                    <el-col
                        class="edit-title_long"
                        :span="10"
                    >
                        <p>
                            每人总发起助力机会：
                        </p>
                    </el-col>
                    <el-col :span="4">
                        <el-switch
                            active-text="限制"
                            inactive-text="不限"
                            active-value="1"
                            inactive-value="2"
                            v-model="everyone_max_launch_switch"
                            @change="i => info.help.setting.everyone_max_launch_num = i == '2' ? 0 : 1"
                            :disabled="info.activity.status == 1"
                        >
                        </el-switch>
                    </el-col>
                    <template v-if="everyone_max_launch_switch == '1'">
                        <el-col
                            :span="4"
                            :push="1"
                        >
                            <p class="num_text">每人最多有</p>
                        </el-col>
                        <el-col :span="5" :push="1">
                            <el-input-number
                                size="small"
                                controls-position="right"
                                :min="0"
                                :max="99"
                                :precision="0"
                                v-model="info.help.setting.everyone_max_launch_num"
                                @blur="(e) => info.help.setting.everyone_max_launch_num = filterElInputNumber(info.help.setting.everyone_max_launch_num, 1)"
                                @change="i => everyone_max_launch_switch = i == 0 ? '2' : '1'"
                                :disabled="info.activity.status == 1"
                            ></el-input-number>
                            <span>&nbsp;&nbsp;次</span>
                        </el-col>
                    </template>
                </el-row>
                <!-- 每人每日发起助力机会 -->
                <el-row
                    type="flex"
                    class="edit-control_ele"
                    v-if="eleFillter('help.setting.everyone_day_max_launch_num')"
                >
                    <el-col
                        class="edit-title_long"
                        :span="10"
                    >
                        <p>
                            每人每日发起助力机会：
                        </p>
                    </el-col>
                    <el-col :span="4">
                        <el-switch
                            active-text="限制"
                            inactive-text="不限"
                            active-value="1"
                            inactive-value="2"
                            v-model="everyone_day_max_launch_switch"
                            @change="i => info.help.setting.everyone_day_max_launch_num = i == '2' ? 0 : 1"
                            :disabled="info.activity.status == 1"
                        >
                        </el-switch>
                    </el-col>
                    <template v-if="everyone_day_max_launch_switch == '1'">
                        <el-col
                            :span="4"
                            :push="1"
                        >
                            <p class="num_text">每人每日可参与</p>
                        </el-col>
                        <el-col :span="5" :push="1">
                            <el-input-number
                                size="small"
                                controls-position="right"
                                :min="0"
                                :max="99"
                                :precision="0"
                                v-model="info.help.setting.everyone_day_max_launch_num"
                                @blur="(e) => info.help.setting.everyone_day_max_launch_num = filterElInputNumber(info.help.setting.everyone_day_max_launch_num, 1)"
                                @change="i => everyone_day_max_launch_switch = i == 0 ? '2' : '1'"
                                :disabled="info.activity.status == 1"
                            ></el-input-number>
                            <span>&nbsp;&nbsp;次</span>
                        </el-col>
                    </template>
                </el-row>
                <!-- 助力限制 -->
                <el-divider
                    content-position="left"
                    v-if="eleFillter('help.setting.everyone_join_max_num') || eleFillter('help.setting.everyone_day_join_max_num')"
                >
                    助力限制
                </el-divider>
                <!-- 每人助力好友机会 -->
                <el-row
                    type="flex"
                    class="edit-control_ele"
                    v-if="eleFillter('help.setting.everyone_join_max_num')"
                >
                    <el-col
                        class="edit-title_long"
                        :span="10"
                    >
                        <p>
                            每人助力好友机会：
                        </p>
                    </el-col>
                    <el-col :span="4">
                        <el-switch
                            active-text="限制"
                            inactive-text="不限"
                            active-value="1"
                            inactive-value="2"
                            v-model="everyone_join_max_switch"
                            @change="i => info.help.setting.everyone_join_max_num = i == '2' ? 0 : 1"
                        >
                        </el-switch>
                    </el-col>
                    <template v-if="everyone_join_max_switch == '1'">
                        <el-col
                            :span="4"
                            :push="1"
                        >
                            <p class="num_text">每人最多有</p>
                        </el-col>
                        <el-col :span="5" :push="1">
                            <el-input-number
                                size="small"
                                controls-position="right"
                                :min="0"
                                :max="99"
                                :precision="0"
                                v-model="info.help.setting.everyone_join_max_num"
                                @blur="(e) => info.help.setting.everyone_join_max_num = filterElInputNumber(info.help.setting.everyone_join_max_num, 1)"
                                @change="i => everyone_join_max_switch = i == 0 ? '2' : '1'"
                            ></el-input-number>
                            <span>&nbsp;&nbsp;次</span>
                        </el-col>
                    </template>
                </el-row>
                <!-- 每人每天助力好友机会 -->
                <el-row
                    type="flex"
                    class="edit-control_ele"
                    v-if="eleFillter('help.setting.everyone_day_join_max_num')"
                >
                    <el-col
                        class="edit-title_long"
                        :span="10"
                    >
                        <p>
                            每人每天助力好友机会：
                        </p>
                    </el-col>
                    <el-col :span="4">
                        <el-switch
                            active-text="限制"
                            inactive-text="不限"
                            active-value="1"
                            inactive-value="2"
                            v-model="everyone_day_join_max_switch"
                            @change="i => info.help.setting.everyone_day_join_max_num = i == '2' ? 0 : 1"
                        >
                        </el-switch>
                    </el-col>
                    <template v-if="everyone_day_join_max_switch == '1'">
                        <el-col
                            :span="4"
                            :push="1"
                        >
                            <p class="num_text">每日助力好友机会</p>
                        </el-col>
                        <el-col :span="5"  :push="1">
                            <el-input-number
                                size="small"
                                controls-position="right"
                                :min="0"
                                :max="99"
                                :precision="0"
                                v-model="info.help.setting.everyone_day_join_max_num"
                                @blur="(e) => info.help.setting.everyone_day_join_max_num = filterElInputNumber(info.help.setting.everyone_day_join_max_num, 1)"
                                @change="i => everyone_day_join_max_switch = i == 0 ? '2' : '1'"
                            ></el-input-number>
                            <span>&nbsp;&nbsp;次</span>
                        </el-col>
                    </template>
                </el-row>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Inject, Prop, Watch } from 'vue-property-decorator';
import { State } from 'vuex-class'
import Setting from './setting';
import { Dictionary } from 'vuex';

@Component
export default class helpSet extends Setting {
    constructor() {
        super({ 'warn': '活动开启后不可更改' })
    }

    private everyone_max_launch_switch: string = '1';
    private everyone_day_max_launch_switch: string = '1';
    private everyone_join_max_switch: string = '1';
    private everyone_day_join_max_switch: string = '1';

    created() {
        this.everyone_max_launch_switch = this.info.help.setting.everyone_max_launch_num == 0 ? '2' : '1';
        this.everyone_day_max_launch_switch = this.info.help.setting.everyone_day_max_launch_num == 0 ? '2' : '1';
        this.everyone_join_max_switch = this.info.help.setting.everyone_join_max_num == 0 ? '2' : '1';
        this.everyone_day_join_max_switch = this.info.help.setting.everyone_day_join_max_num == 0 ? '2' : '1';
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
