<template>
    <!-- 奖品部件 -->
    <div>
        <!-- 奖品简称 -->
        <el-row
            type="flex"
            class="edit-control_ele"
            v-if="eleFillter('prize.short_name', false)"
        >
            <el-col :span="6">
                <p>奖品简称：</p>
            </el-col>
            <el-col :span="18">
                <el-input
                    placeholder="请输入内容"
                    size="medium"
                    maxlength="8"
                    show-word-limit
                    v-model="prize.short_name"
                >
                </el-input>
            </el-col>
        </el-row>
        <!-- 奖品名称 -->
        <div
            :class="{ 'edit-active': eleActive('prize.' + index + '.name')}"
            @mouseover="eleMouseover"
            v-if="eleFillter('prize.name', false)"
        >
            <el-row
                type="flex"
                class="edit-control_ele"
            >
                <el-col :span="6">
                    <p>奖品名称：</p>
                </el-col>
                <el-col :span="18">
                    <el-input
                        placeholder="请输入内容"
                        size="medium"
                        maxlength="15"
                        show-word-limit
                        v-model="prize.name"
                    >
                    </el-input>
                </el-col>
            </el-row>
        </div>
        <!-- 奖品类型 -->
        <div
            :class="{ 'edit-active': eleActive('prize.' + index + '.type')}"
            @mouseover="eleMouseover"
            v-if="eleFillter('prize.type', false)"
        >
            <el-row
                type="flex"
                class="edit-control_ele"
            >
                <el-col :span="6">
                    <p>
                        奖品类型：
                        <el-popover
                            placement="bottom"
                            width="150"
                            trigger="hover"
                            content="活动开启后不可更改"
                        >
                            <i
                                slot="reference"
                                class="el-icon-my-warn"
                            ></i>
                        </el-popover>
                    </p>
                </el-col>
                <el-col :span="18">
                    <el-select
                        v-model="prize.type"
                        placeholder="请选择奖品类型"
                        @change="prizeTypeChange"
                        :disabled="info.activity.status == 1 && prize.is_valid == 1"
                    >
                        <el-option
                            v-for="(prize, key) in typeOptions"
                            :key="key"
                            :label="prize.name"
                            :value="key"
                        >
                        </el-option>
                    </el-select>
                </el-col>
            </el-row>
        </div>
        <!-- 通用码 type=='tyq' -->
        <el-row
            type="flex"
            class="edit-control_ele"
            v-if="prize.type == 'tyq'"
        >
            <el-col :span="6">
                <p>通用码：</p>
            </el-col>
            <el-col :span="18">
                <el-input
                    placeholder="请输入内容"
                    size="medium"
                    maxlength="30"
                    show-word-limit
                    v-model="prize.generic_code"
                >
                </el-input>
            </el-col>
        </el-row>
        <!-- 奖品数量 -->
        <el-row
            type="flex"
            class="edit-control_ele"
            v-if="eleFillter('prize.num', false)"
        >
            <el-col :span="6">
                <p>奖品数量：</p>
            </el-col>
            <el-col :span="18">
                <!-- 电子券奖品数量为导入电子券码数量 -->
                <template v-if="prize.is_dzq == 1">
                    <el-input-number
                        disabled
                        size="medium"
                        v-model="prize.code_num"
                        :max="99999999"
                        label="奖品数量"
                    ></el-input-number>
                </template>
                <!-- 非电子券奖品数量 -->
                <template v-else>
                    <el-input-number
                        v-if="info.activity.status == 1 && prize.is_valid == 1"
                        size="medium"
                        v-model="prize.input_num"
                        @blur="(e) => prize.input_num = filterElInputNumber(prize.input_num, prize.minnum)"
                        :min="prize.minnum"
                        :max="99999999"
                        :precision="0"
                        label="奖品数量"
                    ></el-input-number>
                    <el-input-number
                        v-else
                        size="medium"
                        v-model="prize.input_num"
                        @blur="(e) => prize.input_num = filterElInputNumber(prize.input_num, 0)"
                        :min="0"
                        :max="99999999"
                        :precision="0"
                        label="奖品数量"
                    ></el-input-number>
                </template>
            </el-col>
        </el-row>
        <!-- 奖品价值 -->
        <el-row
            type="flex"
            class="edit-control_ele"
            v-if="eleFillter('prize.money', false)"
        >
            <el-col :span="6">
                <p>
                    奖品价值：
                    <el-popover
                        placement="bottom"
                        width="150"
                        trigger="hover"
                        content="活动开启后不可更改"
                    >
                        <i
                            slot="reference"
                            class="el-icon-my-warn"
                        ></i>
                    </el-popover>
                </p>
            </el-col>
            <el-col :span="18">
                <el-input-number
                    :disabled="info.activity.status == 1 && prize.is_valid == 1"
                    size="medium"
                    v-model="prize.money"
                    @blur="(e) => prize.money = filterElInputNumber(prize.money, 0.00)"
                    :precision="2"
                    :step="1"
                    :min="0"
                    :max="9999999"
                ></el-input-number>
            </el-col>
        </el-row>
        <!-- 扩展设置 -->
        <slot name="part-ext" :prize="prize">
        </slot>
        <!-- 消费地址 type=='typ' || 'xsxf' -->
        <el-row
            type="flex"
            class="edit-control_ele"
            v-if="prize.type == 'tyq' || prize.type == 'xsxf'"
        >
            <el-col :span="6">
                <p>消费地址：</p>
            </el-col>
            <el-col :span="18">
                <el-input
                    placeholder="请填写线上消费地址"
                    size="medium"
                    maxlength="200"
                    show-word-limit
                    type="textarea"
                    v-model="prize.use_url"
                >
                </el-input>
            </el-col>
        </el-row>
        <!-- 奖品图片 -->
        <div
            :class="{ 'edit-active': eleActive('prize.' + index + '.pic_url')}"
            @mouseover="eleMouseover"
            v-if="eleFillter('prize.pic_url', false)"
        >
            <el-row
                type="flex"
                class="edit-control_ele"
            >
                <el-col :span="6">
                    <p>奖品图片：</p>
                </el-col>
                <el-col :span="18">
                    <!-- 图片选择组件 -->
                    <image-part
                        errTip="奖品图片大小不能超过500K"
                        imgSize="500"
                        v-model="prize.pic_url"
                    >
                        <template #tip>
                            <div class="edit-img_tip">大小不能超过500K</div>
                        </template>
                    </image-part>
                </el-col>
            </el-row>
        </div>
        <!-- 奖品说明 -->
        <el-row
            type="flex"
            class="edit-control_ele"
            v-if="eleFillter('prize.desc', false)"
        >
            <el-col :span="6">
                <p>奖品说明：</p>
            </el-col>
            <el-col :span="18">
                <editor-part v-model="prize.desc" />
            </el-col>
        </el-row>
        <!-- 券码设置 -->
        <el-divider
            v-if="prize.is_dzq == 1"
            content-position="left"
        >
            券码设置
        </el-divider>
        <el-row
            type="flex"
            class="edit-control_ele"
            v-if="prize.is_dzq == 1"
        >
            <el-col :span="6">
                <p>导入券码：</p>
            </el-col>
            <el-col :span="18">
                <div class="el-upload__tip"><a
                        href="javascript:;"
                        style="font-size: 14px;color: #6D96FF;cursor: pointer;"
                        @mousedown="destroyedBeforeunloadHandler(apiList.sampleDownloadUrl)"
                        @mouseleave="createBeforeunloadHandler"
                    >点击下载模版文件</a></div>
                <el-upload
                    :show-file-list="true"
                    :http-request="upLoadFile"
                    :before-upload="beforeFileUpload"
                    action="123"
                    list-type="picture"
                    class="upload-demo"
                    drag
                    multiple
                    accept="application/vnd.ms-excel, text/csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                >
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                </el-upload>
                <div class="edit-control_settingTip">支持上传 xls / xlsx / csv 格式文件</div>
            </el-col>
        </el-row>
        <!-- 限制设置 -->
        <slot name="limit-ext" :prize="prize">
        </slot>
        <!-- 安慰奖品高级设置 -->
        <template v-if="type == 'comfort'">
            <el-divider
                content-position="left"
                v-if="eleFillter('prize.prize_person_max_win_num_comfort', false)"
            >
                高级设置<em class="edit-divider_tip">（0代表不限制）</em>
            </el-divider>
            <!-- 每人最大中奖次数 -->
            <el-row
                type="flex"
                class="edit-control_ele"
                v-if="eleFillter('prize.prize_person_max_win_num_comfort', false)"
            >
                <el-col
                    class="edit-title_long"
                    :span="10"
                >
                    <p>每人最大中奖次数：</p>
                </el-col>
                <el-col :span="10">
                    <el-input-number
                        v-model="prize.prize_person_max_win_num"
                        @blur="(e) => prize.prize_person_max_win_num = filterElInputNumber(prize.prize_person_max_win_num, 1)"
                        controls-position="right"
                        size="medium"
                        :min="0"
                        :max="99999999"
                        :precision="0"
                        label="每人最大中奖次数"
                    ></el-input-number>
                    <span>&nbsp;&nbsp;次</span>
                </el-col>
            </el-row>
        </template>
        <!-- 普通奖品高级设置 -->
        <template v-if="type == 'general'">
            <el-divider
                content-position="left"
                v-if="eleFillter('prize.prize_max_win_num', false) || eleFillter('prize.prize_person_max_win_num', false) || eleFillter('prize.prize_person_day_max_win_num', false)"
            >
                高级设置<em class="edit-divider_tip">（0代表不限制）</em>
            </el-divider>
            <!-- 奖品每天最大中奖次数 -->
            <el-row
                type="flex"
                class="edit-control_ele"
                v-if="eleFillter('prize.prize_max_win_num', false)"
            >
                <el-col
                    class="edit-title_long"
                    :span="10"
                >
                    <p>奖品每天最大中奖次数：</p>
                </el-col>
                <el-col :span="10">
                    <el-input-number
                        v-model="prize.prize_max_win_num"
                        @blur="(e) => prize.prize_max_win_num = filterElInputNumber(prize.prize_max_win_num, 0)"
                        controls-position="right"
                        size="medium"
                        :min="0"
                        :max="99999999"
                        :precision="0"
                        label="奖品每天最大中奖次数"
                    ></el-input-number>
                    <span>&nbsp;&nbsp;次</span>
                </el-col>
            </el-row>
            <!-- 每人最大中奖次数 -->
            <el-row
                type="flex"
                class="edit-control_ele"
                v-if="eleFillter('prize.prize_person_max_win_num', false)"
            >
                <el-col
                    class="edit-title_long"
                    :span="10"
                >
                    <p>每人最大中奖次数：</p>
                </el-col>
                <el-col :span="10">
                    <el-input-number
                        v-model="prize.prize_person_max_win_num"
                        @blur="(e) => prize.prize_person_max_win_num = filterElInputNumber(prize.prize_person_max_win_num, 1)"
                        controls-position="right"
                        size="medium"
                        :min="0"
                        :max="99999999"
                        :precision="0"
                        label="每人最大中奖次数"
                    ></el-input-number>
                    <span>&nbsp;&nbsp;次</span>
                </el-col>
            </el-row>
            <!-- 每人最大中奖次数 -->
            <el-row
                type="flex"
                class="edit-control_ele"
                v-if="eleFillter('prize.prize_person_day_max_win_num', false)"
            >
                <el-col
                    class="edit-title_long"
                    :span="10"
                >
                    <p>每人每天中奖次数：</p>
                </el-col>
                <el-col :span="10">
                    <el-input-number
                        v-model="prize.prize_person_day_max_win_num"
                        @blur="(e) => prize.prize_person_day_max_win_num = filterElInputNumber(prize.prize_person_day_max_win_num, 1)"
                        controls-position="right"
                        size="medium"
                        :min="0"
                        :max="99999999"
                        :precision="0"
                        label="每人每天中奖次数"
                    ></el-input-number>
                    <span>&nbsp;&nbsp;次</span>
                </el-col>
            </el-row>
        </template>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator';
import { Dictionary } from 'vuex';
import { State, Getter, Action, Mutation, namespace } from 'vuex-class'
import Part from './part';

import ImagePart from '../parts/image-part.vue';
import EditorPart from '../parts/editor-part.vue';

@Component({
    components: {
        ImagePart,
        EditorPart
    }
})
export default class PrizePart extends Part {
    constructor() {
        super({ 'warn': '活动开启后不可更改' })
    }
    @Getter public activeEdit!: Dictionary<any>;

    @Prop(Object)
    prize!: Dictionary<any>         // 奖品value

    @Prop(Object)
    typeOptions!: Dictionary<any>   // 奖品类型集合

    @Prop(String)
    type!: string                   // 奖品种类-普通奖品 general|安慰奖 comfort

    @Prop(Number)
    index!: number                  // 奖品位置信息

    /**
     * @description: 奖品类型选择
     * @param {val: number}
     */
    public prizeTypeChange(val: number) {
        this.prize.is_dzq = this.typeOptions[val].is_dzq;
    }

    /**
     * @description: 上传文件验证
     * @param {file: Dictionary<any>}
     */
    public beforeFileUpload(file: Dictionary<any>) {
        return true
    }

    /**
     * @description: 上传文件
     * @param {file: Dictionary<any>}
     */
    public upLoadFile(file: Dictionary<any>) {
        let formFile = new FormData();

        formFile.append('codeFile', file.file);
        formFile.append('prizeId', this.prize.id);

        this.$http.upLoadFile(this.apiList.importUrl, formFile).then((res: Dictionary<any>) => {
            if (res.status == 'success') {
                this.prize.code_num = this.prize.is_dzq == 1 ? res.data : this.prize.code_num;
                this.$message({
                    showClose: true,
                    message: res.message,
                    type: 'success',
                    duration: 0
                })
            } else {
                this.$message({
                    showClose: true,
                    message: res.message,
                    type: 'error',
                    duration: 0
                });
            }
        })
    }
}
</script>

<style>
</style>
