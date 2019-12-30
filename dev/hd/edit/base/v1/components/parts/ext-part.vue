<template>
    <div>
        <div
            v-for="ext in info.ext"
            :key="ext.key"
        >
            <el-row
                type="flex"
                class="edit-control_ele"
                v-if="editEleBlackList.indexOf(ext.key) == -1 && ext.type != 1 && ext.belong.split('.')[0] == editType"
            >
                <el-col
                    :class="{'edit-title_long': ext.name.length > 8}"
                    :span="10"
                >
                    <p>{{ext.name}}：
                        <el-popover
                            placement="bottom"
                            trigger="hover"
                            v-if="customPopover"
                            :content="customPopover.tips"
                        >
                            <i
                                slot="reference"
                                :class="'el-icon-' + customPopover.type"
                            ></i>
                        </el-popover>
                    </p>
                </el-col>
                <el-col :span="14">
                    <!-- switch开关 -->
                    <template v-if="ext.type == 'switch'">
                        <el-switch
                            active-text="是"
                            inactive-text="否"
                            active-value="1"
                            inactive-value="2"
                            v-model="extInfo[ext.belong.split('.')[1]][ext.key]"
                            :disabled="editStatus"
                        >
                        </el-switch>
                    </template>
                    <!-- 日期时间选择器_range -->
                    <template v-if="ext.type == 'datetimepicker_range'">
                        <el-date-picker
                            :value="[formatDate(extInfo[ext.belong.split('.')[1]][ext.key.split(',')[0]], 'time'), formatDate(extInfo[ext.belong.split('.')[1]][ext.key.split(',')[1]], 'time')]"
                            type="datetimerange"
                            align="right"
                            :editable="false"
                            start-placeholder="开始时间"
                            end-placeholder="结束时间"
                            format="yyyy-MM-dd HH:mm"
                            value-format="timestamp"
                            :disabled="editStatus"
                            @input="arr => {extInfo[ext.belong.split('.')[1]][ext.key.split(',')[0]] = formatDate(arr[0]); extInfo[ext.belong.split('.')[1]][ext.key.split(',')[1]] = formatDate(arr[1])}"
                        >
                        </el-date-picker>
                    </template>
                    <!-- 图片 -->
                    <template v-if="ext.type == 'image'">
                        <!-- 图片选择组件 -->
                        <image-part
                            :errTip="'图片大小不能超过' + imgSize + 'KB'"
                            imgSize="2000"
                            v-model="extInfo[ext.belong.split('.')[1]][ext.key]"
                        >
                            <template #tip>
                                <div class="edit-img_tip">大小不能超过2000K</div>
                            </template>
                        </image-part>
                    </template>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import Part from './part';
import ImagePart from './image-part.vue';
import { Dictionary } from 'vuex';

@Component({
    components: {
        ImagePart
    }
})
export default class ExtPart extends Part {
    constructor() {
        super({ 'warn': '活动开启后不可更改' })
    }

    @Prop(String)
    editType!: string
    @Prop(Object)
    editInfo!: Dictionary<any>
    @Prop(Boolean)
    editStatus!: boolean
    @Prop(Object)
    customPopover!: Dictionary<any>

    private extInfo!: Dictionary<any>

    created() {
        if (!this.editInfo) {
            this.extInfo = this.info[this.editType];
        } else {
            this.extInfo = this.editInfo;
        }
    }
}
</script>


<style>
</style>
