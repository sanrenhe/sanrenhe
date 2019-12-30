<template>
    <!-- 基础设置 -->
    <div>
        <!-- 基础设置 -->
        <el-collapse v-model="activeNames.active">
            <el-collapse-item
                title="基础设置"
                name="base"
            >
                <!-- 活动名称 -->
                <div
                    v-if="eleFillter('activity.title')"
                    :class="{ 'edit-active': eleActive('activity.title')}"
                    @mouseover="eleMouseover"
                >
                    <el-row
                        type="flex"
                        class="edit-control_ele"
                    >
                        <el-col :span="6">
                            <p>活动名称：</p>
                        </el-col>
                        <el-col :span="18">
                            <el-input
                                placeholder="请输入内容"
                                size="medium"
                                maxlength="20"
                                show-word-limit
                                v-model="info.activity.title"
                            >
                            </el-input>
                        </el-col>
                    </el-row>
                </div>
                <!-- 活动标题 -->
                <div
                    :class="{ 'edit-active': eleActive('activity.name')}"
                    @mouseover="eleMouseover"
                    v-if="eleFillter('activity.name')"
                >
                    <el-row
                        type="flex"
                        class="edit-control_ele"
                    >
                        <el-col :span="6">
                            <p>活动标题：</p>
                        </el-col>
                        <el-col :span="18">
                            <el-input
                                placeholder="请输入内容"
                                size="medium"
                                maxlength="10"
                                show-word-limit
                                v-model="info.activity.name"
                            >
                            </el-input>
                        </el-col>
                    </el-row>
                </div>
                <!-- 活动起始时间 -->
                <div
                    :class="{ 'edit-active': eleActive('activity.start_time') || eleActive('activity.end_time')}"
                    @mouseover="eleMouseover"
                    v-if="eleFillter('activity.start_time')"
                >
                    <el-row
                        type="flex"
                        class="edit-control_ele"
                    >
                        <el-col :span="6">
                            <p>活动起始时间：</p>
                        </el-col>
                        <el-col :span="18">
                            <el-date-picker
                                v-model="info.activity.start_time"
                                type="datetime"
                                placeholder="选择开始时间"
                                format="yyyy-MM-dd HH:mm:ss"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                :picker-options="pickerOptions0"
                            >
                            </el-date-picker>
                            &nbsp;至&nbsp;
                            <el-date-picker
                                v-model="info.activity.end_time"
                                type="datetime"
                                placeholder="选择结束时间"
                                format="yyyy-MM-dd HH:mm:ss"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                :picker-options="pickerOptions1"
                            >
                            </el-date-picker>
                        </el-col>
                    </el-row>
                </div>
                <!-- 扩展设置 -->
                <slot name="set-ext">
                </slot>
                <!-- 参与人数 -->
                <el-row
                    type="flex"
                    class="edit-control_ele"
                    v-if="eleFillter('activity.templet_set.person_is_show')"
                >
                    <el-col :span="6">
                        <p>
                            参与人数：
                            <el-popover
                                placement="bottom"
                                width="450"
                                trigger="hover"
                                :content="popover.person"
                            >
                                <i
                                    slot="reference"
                                    class="el-icon-question"
                                ></i>
                            </el-popover>
                        </p>
                    </el-col>
                    <el-col :span="18">
                        <el-switch
                            active-text="显示"
                            inactive-text="隐藏"
                            active-value="1"
                            inactive-value="2"
                            v-model="info.activity.templet_set.person_is_show"
                        >
                        </el-switch>
                    </el-col>
                </el-row>
                <!-- 参与人数底数 -->
                <el-row
                    type="flex"
                    class="edit-control_ele"
                    v-if="info.activity.templet_set.person_is_show == '1' && eleFillter('activity.templet_set.user_num_base')"
                >
                    <el-col :span="6">
                        <p>参与人数底数：</p>
                    </el-col>
                    <el-col :span="18">
                        <el-input-number
                            size="small"
                            controls-position="right"
                            :min="0"
                            :max="99999"
                            :precision="0"
                            v-model="info.activity.templet_set.user_num_base"
                            @blur="(e) => info.activity.templet_set.user_num_base = filterElInputNumber(info.activity.templet_set.user_num_base, 0)"
                        ></el-input-number>
                    </el-col>
                </el-row>
                <!-- 中奖跑马灯 -->
                <el-row
                    type="flex"
                    class="edit-control_ele"
                    v-if="eleFillter('activity.templet_set.is_lamp_on')"
                >
                    <el-col :span="6">
                        <p>
                            中奖跑马灯：
                        </p>
                    </el-col>
                    <el-col :span="18">
                        <el-switch
                            active-text="显示"
                            inactive-text="隐藏"
                            active-value="1"
                            inactive-value="2"
                            v-model="info.activity.templet_set.is_lamp_on"
                        >
                        </el-switch>
                    </el-col>
                </el-row>
                <!-- 中奖信息v1.8版本后抽奖活动应用 -->
                <el-row
                    type="flex"
                    class="edit-control_ele"
                    v-if="eleFillter('activity.templet_set.is_lamp_on_draw')"
                >
                    <el-col :span="6">
                        <p>
                            中奖信息：
                        </p>
                    </el-col>
                    <el-col :span="18">
                        <el-radio-group
                            :value="info.activity.templet_set.is_lamp_on.toString()"
                            @input="i => info.activity.templet_set.is_lamp_on = i.toString()"
                        >
                            <el-radio
                                v-for="item in winTypeList"
                                :key="item.value"
                                :label="item.value"
                            >{{item.name}}</el-radio>
                        </el-radio-group>
                    </el-col>
                </el-row>
                <!-- 跑马灯文案 -->
                <el-row
                    type="flex"
                    class="edit-control_ele"
                    v-if="info.activity.templet_set.is_lamp_on == '1' && eleFillter('activity.templet_set.custom_lamp_text')"
                >
                    <el-col :span="6">
                        <p>
                            跑马灯文案：
                            <el-popover
                                placement="bottom"
                                width="200"
                                trigger="hover"
                                content="配置跑马灯文案后，优先展示配置文案"
                            >
                                <i
                                    slot="reference"
                                    class="el-icon-my-warn"
                                ></i>
                            </el-popover>
                        </p>
                    </el-col>
                    <el-col :span="18">
                        <el-input
                            placeholder="请输入内容"
                            size="medium"
                            show-word-limit
                            v-model="info.activity.templet_set.custom_lamp_text"
                        >
                        </el-input>
                    </el-col>
                </el-row>
                <!-- 发布平台 -->
                <div
                    :class="{ 'edit-active': eleActive('activity.platforms')}"
                    @mouseover="eleMouseover"
                    v-if="eleFillter('activity.platforms')"
                >
                    <el-row
                        type="flex"
                        class="edit-control_ele"
                    >
                        <el-col :span="6">
                            <p>
                                发布平台：
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
                            </p>
                        </el-col>
                        <el-col :span="18">
                            <el-checkbox-group
                                v-model="info.activity.platforms"
                                size="small"
                                :min="1"
                            >
                                <el-checkbox
                                    v-for="platform in info.platformArr"
                                    :key="platform.label"
                                    :disabled="platform.disabled"
                                    :label="platform.label"
                                >{{platform.name}}</el-checkbox>
                            </el-checkbox-group>
                        </el-col>
                    </el-row>
                </div>
                <!-- 活动说明 -->
                <div
                    :class="{ 'edit-active': eleActive('activity.rules')}"
                    @mouseover="eleMouseover"
                    v-if="eleFillter('activity.rules')"
                >
                    <el-row
                        type="flex"
                        class="edit-control_ele"
                    >
                        <el-col :span="6">
                            <p>活动说明：</p>
                        </el-col>
                        <el-col :span="18">
                            <editor-part v-model="info.activity.rules" />
                        </el-col>
                    </el-row>
                </div>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Inject, Watch, Prop } from 'vue-property-decorator';
import Setting from './setting';

import EditorPart from '../parts/editor-part.vue';
import { Dictionary } from 'vuex';

@Component({
    components: {
        EditorPart
    }
})
export default class BaseSet extends Setting {
    constructor() {
        super({ 'person': '在活动首页显示已有多少人参与，且显示人数为实际人数与虚拟人数之和', 'warn': '活动开启后已选平台不可更改' })
    }

    @Prop({
        type: Array,
        default: () => {
            return [
                {
                    value: '2',
                    name: '隐藏'
                },
                {
                    value: '1',
                    name: '跑马灯'
                },
                {
                    value: '0',
                    name: '中奖列表'
                }
            ]
        }
    })
    winTypeList!: Dictionary<any>

    private pickerOptions0!: any
    private pickerOptions1!: any
    beforeCreate() {
        this.pickerOptions0 = {
            disabledDate: (time: Date) => {
                if (this.info.activity.end_time != "") {
                    return time.getTime() < Date.now() - 86400000 || time.getTime() > new Date(this.info.activity.end_time).getTime();
                } else {
                    return time.getTime() < Date.now() - 86400000;
                }
            }
        }
        this.pickerOptions1 = {
            disabledDate: (time: Date) => {
                return time.getTime() < new Date(this.info.activity.start_time).getTime() - 86400000 || time.getTime() < Date.now() - 86400000;
            }
        }
    }
}
</script>


<style>
</style>
