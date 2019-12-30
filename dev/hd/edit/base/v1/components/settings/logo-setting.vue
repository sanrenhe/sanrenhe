<template>
    <div>
        <!-- logo设置 -->
        <el-collapse
            v-model="activeNames.active"
            v-if="editEleBlackList.indexOf('logo') == -1"
        >
            <el-collapse-item
                title="LOGO设置"
                name="logo"
            >
                <!-- 是否显示 -->
                <el-row
                    type="flex"
                    class="edit-control_ele"
                >
                    <el-col :span="6">
                        <p>是否显示：</p>
                    </el-col>
                    <el-col :span="18">
                        <el-switch
                            active-text="显示"
                            inactive-text="隐藏"
                            active-value="1"
                            inactive-value="2"
                            v-model="info.activity.templet_set.logo_is_show"
                            v-if="editEleBlackList.indexOf('logo_is_show') == -1"
                        >
                        </el-switch>
                    </el-col>
                </el-row>
                <!-- LOGO图片 -->
                <el-row
                    type="flex"
                    class="edit-control_ele"
                    v-if="info.activity.templet_set.logo_is_show == '1' && editEleBlackList.indexOf('logo_is_show') == -1"
                >
                    <el-col :span="6">
                        <p>LOGO图片：</p>
                    </el-col>
                    <el-col :span="18">
                        <!-- 图片选择组件 -->
                        <image-part
                            errTip="LOGO图片大小不能超过500K"
                            imgSize="500"
                            styles="width: 150px; height: 50px;"
                            v-model="info.activity.templet_set.logo_url"
                        >
                            <template #tip>
                                <div class="edit-img_tip">大小不能超过500K</div>
                            </template>
                        </image-part>
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
import { Component, Vue, Inject } from 'vue-property-decorator';
import Setting from './setting';

import ImagePart from '../parts/image-part.vue';

@Component({
    components: {
        ImagePart
    }
})
export default class LogoSet extends Setting {
    constructor() {
        super({ 'warn': '活动开启后已选平台不可更改' })
    }
}
</script>


<style>
</style>
