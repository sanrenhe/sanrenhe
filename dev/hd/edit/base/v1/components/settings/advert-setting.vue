<template>
    <div>
        <!-- 广告设置 -->
        <el-collapse v-model="activeNames.active">
            <el-collapse-item
                title="广告设置"
                name="advert"
            >
                <el-tabs
                    @tab-click="tabClick"
                    v-model="tabValue"
                    type="card"
                    editable
                    @edit="tabsEdit"
                    class="edit-set_tab"
                >
                    <el-tab-pane
                        style="padding:0px 5px;"
                        v-for="(advert, index) in tabs"
                        :label="advert.tabTitle"
                        :name="advert.seq"
                        :key="advert.seq"
                        :data-set="index"
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
                                    v-model="advert.is_show"
                                >
                                </el-switch>
                            </el-col>
                        </el-row>
                        <template v-if="advert.is_show == '1'">
                            <!-- 广告位置 -->
                            <div
                                :class="{ 'edit-active': eleActive('advert.' + index + '.position')}"
                                @mouseover="eleMouseover"
                            >
                                <el-row
                                    type="flex"
                                    class="edit-control_ele"
                                >
                                    <el-col :span="6">
                                        <p>广告位置：</p>
                                    </el-col>
                                    <el-col :span="18">
                                        <el-select
                                            v-model="advert.position"
                                            placeholder="请选择"
                                        >
                                            <el-option
                                                v-for="item in adOptions"
                                                :disabled="item.disabled"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value"
                                            >
                                            </el-option>
                                        </el-select>
                                    </el-col>
                                </el-row>
                            </div>
                            <!-- 广告名称 -->
                            <el-row
                                type="flex"
                                class="edit-control_ele"
                            >
                                <el-col :span="6">
                                    <p>广告名称：</p>
                                </el-col>
                                <el-col :span="18">
                                    <el-input
                                        type="textarea"
                                        placeholder="请输入内容"
                                        v-model="advert.title"
                                    >
                                    </el-input>
                                </el-col>
                            </el-row>
                            <!-- 广告图片 -->
                            <div
                                :class="{ 'edit-active': eleActive('advert.' + index + '.img_url')}"
                                @mouseover="eleMouseover"
                            >
                                <el-row
                                    type="flex"
                                    class="edit-control_ele"
                                >
                                    <el-col :span="6">
                                        <p>广告图片：</p>
                                    </el-col>
                                    <el-col :span="18">
                                        <!-- 图片选择组件 -->
                                        <image-part
                                            errTip="广告图片大小不能超过500K"
                                            imgSize="500"
                                            styles="width: 200px; height: 100px;"
                                            v-model="advert.img_url"
                                        >
                                            <template #tip>
                                                <div class="edit-img_tip">大小不能超过500K</div>
                                            </template>
                                        </image-part>
                                    </el-col>
                                </el-row>
                            </div>
                            <!-- 图片链接 -->
                            <el-row
                                type="flex"
                                class="edit-control_ele"
                            >
                                <el-col :span="6">
                                    <p>图片链接：</p>
                                </el-col>
                                <el-col :span="18">
                                    <el-input
                                        placeholder="选填"
                                        size="medium"
                                        v-model="advert.img_link"
                                    >
                                    </el-input>
                                </el-col>
                            </el-row>
                            <!-- 图片说明 -->
                            <el-row
                                type="flex"
                                class="edit-control_ele"
                            >
                                <el-col :span="6">
                                    <p>图片说明：</p>
                                </el-col>
                                <el-col :span="18">
                                    <el-input
                                        placeholder="选填"
                                        size="medium"
                                        v-model="advert.img_title"
                                    >
                                    </el-input>
                                </el-col>
                            </el-row>
                        </template>
                    </el-tab-pane>
                </el-tabs>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Inject, Prop, Watch } from 'vue-property-decorator';
import { Dictionary } from "vuex";
import { State, Action, Mutation, namespace } from 'vuex-class'
import { listenMessage, MessageData, MessageType } from '../../message';
import Setting from './setting';

import ImagePart from '../parts/image-part.vue';

// 广告vuex模块
const advertModule = namespace('advert');

@Component({
    components: {
        ImagePart
    },
    watch: {
        'appData.advert.index': {
            handler: function () {
                this.tabValue = this.appData.advert.list[this.appData.advert.index].seq
            }
        }
    }
})
export default class AdvertSet extends Setting {
    constructor() {
        super({ 'warn': '活动开启后不可更改' })
    }
    @State('appData') appData!: Dictionary<any>
    @advertModule.Mutation('advert_updateIndex') advert_updateIndex!: Function
    @advertModule.Mutation('advert_handle') advert_handle!: Function
    @Action handleData!: Function
    @Mutation updateEditInfoStatus!: Function

    @Inject() onDataChange!: Function

    @Prop({
        type: Array,
        default: () => {
            return [{ value: 1, label: '首页顶部', disabled: false }]
        }
    })
    adOptions!: Dictionary<any>

    private tabs: Dictionary<any> = []
    private tabIndex!: number
    private tabValue: string = ''
    private tabNextIndex!: number

    private defaultAdData: Object = {
        id: 0, // 广告id
        is_show: '2', // 是否显示 1-显示  2-隐藏
        position: '', // 广告位置
        title: '', // 广告名称
        img_url: '', // 广告图片
        img_link: '', // 图片链接
        img_title: '', // 图片说明
    }

    mounted() {
        this.tabs = this.appData.advert.list
        this.tabIndex = this.appData.advert.index
        this.tabValue = this.appData.advert.list.length == 0 ? '' : this.appData.advert.list[this.appData.advert.index].seq
        this.tabNextIndex = this.appData.advert.list.length
        // 更新广告位禁选状态
        this.udateAdvertStatus();
        this.$watch('tabs', () => { return this.updateAdvert() }, { deep: true });
    }

    public udateAdvertStatus() {
        for (var z = 0, zlen = this.adOptions.length; z < zlen; z++) {
            this.adOptions[z].disabled = false;
        }
        for (var i = 0, len = this.adOptions.length; i < len; i++) {
            for (var j = 0, jlen = this.tabs.length; j < jlen; j++) {
                if (this.adOptions[i].value == this.tabs[j].position) {
                    this.adOptions[i].disabled = true;
                }
            }
        }
    }

    public updateAdvert() {
        this.advert_handle(this.appData);
        // 传递消息
        this.onDataChange(MessageType.update);
        // 更改编辑数据状态
        this.updateEditInfoStatus(1);
        // 更新广告位禁选状态
        this.udateAdvertStatus();
    }

    public tabClick(tab: Dictionary<any>) {
        this.tabIndex = tab.$attrs['data-set'];
        this.advert_updateIndex(this.tabIndex);
    }

    public tabsEdit(targetName: string, action: string) {
        if (action == 'add') {
            let nextIndex = this.tabs.length + 1;
            let nextTabName = (++this.tabNextIndex).toString();

            this.$http.post(this.apiList.createAdUrl).then((res: Dictionary<any>) => {
                if (res.status == 'success') {
                    let obj = $.extend({}, this.defaultAdData, res.data);
                    obj.id = res.data;
                    obj.tabTitle = '广告' + nextIndex;
                    obj.seq = nextTabName;
                    this.tabs.push(obj);
                    this.tabValue = nextTabName;

                    this.tabs.length == 0 ? this.advert_updateIndex(0) : this.advert_updateIndex(this.tabs.length - 1);
                } else {
                    this.$message({
                        message: res.message,
                        type: 'warning'
                    })
                }
            })
        }
        if (action == 'remove') {
            let advertId = '';
            this.tabs.forEach((tab: Dictionary<any>, index: number) => {
                if (this.tabs[index].seq == targetName) {
                    advertId = this.tabs[index].id;
                }
            })
            this.$http.post(this.apiList.deleteAdUrl, { id: advertId }).then((res: Dictionary<any>) => {
                if (res.status == 'success') {
                    this.$message(res.message);

                    if (this.tabValue == targetName) {
                        this.tabs.forEach((tab: Dictionary<any>, index: number) => {
                            if (tab.seq == targetName) {
                                let nextTab = this.tabs[index + 1] || this.tabs[index - 1];
                                if (nextTab) {
                                    this.tabValue = nextTab;
                                }
                            }
                        })
                    }
                }

                this.tabs.forEach((tab: Dictionary<any>, index: number) => {
                    if (tab.seq == targetName) {
                        this.tabs.splice(index, 1)
                    }
                })

                this.tabs.forEach((tab: Dictionary<any>, index: number) => {
                    tab.tabTitle = '广告' + (index + 1);
                })
                this.tabs.length == 0 ? this.advert_updateIndex(0) : this.advert_updateIndex(this.tabs.length - 1);
            })
        }
    }
}
</script>


<style>
</style>
