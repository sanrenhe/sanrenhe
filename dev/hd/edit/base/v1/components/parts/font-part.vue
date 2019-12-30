<template>
    <div>
        <el-row
            type="flex"
            class="edit-control_ele"
        >
            <el-col :span="6">
                <p>常规文字：</p>
            </el-col>
            <el-col :span="18">
                <!-- 图片选择组件 -->
                <image-part
                    :errTip="item.title + '大小不能超过' + item.imgSize + 'K'"
                    :imgSize="item.imgSize"
                    v-model="info[item.path.split('.')[0]][item.path.split('.')[1]][item.path.split('.')[2]]"
                >
                    <template #tip>
                        <div class="edit-img_tip">{{item.title}}大小不能超过{{item.imgSize}}K</div>
                    </template>
                </image-part>
            </el-col>
        </el-row>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import Part from './part';

@Component
export default class FontPart extends Part {
    constructor() {
        super({ 'warn': '活动开启后不可更改' })
    }

    @Prop(Object)
    value!: Object
}

</script>


<style>
</style>
