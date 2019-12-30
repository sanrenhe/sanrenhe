<template>
    <div>
        <!-- 白名单设置 -->
        <el-collapse v-model="activeNames.active">
            <el-collapse-item
                title="白名单设置"
                name="white"
            >
                <!-- 是否启用 -->
                <el-row
                    type="flex"
                    class="edit-control_ele"
                >
                    <el-col :span="6">
                        <p>是否启用：</p>
                    </el-col>
                    <el-col :span="18">
                        <el-switch
                            active-text="显示"
                            inactive-text="隐藏"
                            active-value="1"
                            inactive-value="2"
                            v-model="info.activity.is_white_on"
                        >
                        </el-switch>
                        <div
                            v-show="info.activity.is_white_on == 1"
                            class="el-upload__tip"
                        ><a
                                href="javascript:;"
                                style="font-size: 14px;color: #6D96FF;cursor: pointer;"
                                @mousedown="destroyedBeforeunloadHandler(apiList.sampleWhiteDownloadUrl)"
                                @mouseleave="createBeforeunloadHandler"
                            >点击下载模版文件</a></div>
                    </el-col>
                </el-row>
                <!-- 非白名单提示文案 -->
                <el-row
                    type="flex"
                    class="edit-control_ele"
                    v-if="info.activity.is_white_on == '1' && checkedPlatforms"
                >
                    <el-col :span="6">
                        <p>非白名单提示文案：</p>
                    </el-col>
                    <el-col :span="18">
                        <el-input
                            placeholder="请输入内容"
                            size="medium"
                            maxlength="50"
                            show-word-limit
                            type="textarea"
                            v-model="info.activity.templet_set.no_white_text"
                        >
                        </el-input>
                    </el-col>
                </el-row>
                <!-- 上传白名单 -->
                <template v-if="info.activity.is_white_on == '1'">
                    <el-row
                        type="flex"
                        class="edit-control_ele"
                        v-for="platform in checkedPlatforms"
                        :key="platform.id"
                    >
                        <el-col :span="6">
                            <p>{{platform.platform_name}}：</p>
                        </el-col>
                        <el-col :span="18">
                            <el-upload
                                :show-file-list="false"
                                :http-request="(res)=>{ return upLoadWhiteFile(res, platform.platform_id, platform)}"
                                :before-upload="beforeFileUpload"
                                action="123"
                                list-type="text"
                                class="edit-upload-whiteList"
                                multiple
                                accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                            >
                                <el-button
                                    v-if="platform.count == 0"
                                    class="edit-upload-btn"
                                    size="small"
                                    type="primary"
                                >点击导入</el-button>
                                <el-button
                                    v-else
                                    class="edit-upload-btn"
                                    size="small"
                                    type="primary"
                                >继续导入</el-button>
                            </el-upload>
                            <div
                                v-if="platform.count == 0"
                                class="edit-whiteTip"
                            >*此白名单权限应用于{{platform.platform_name}}平台，活动仅白名单用户可见</div>
                            <div
                                v-else
                                class="edit-whiteTip"
                            >*已导入 {{platform.count}} 条数据</div>
                            <div
                                v-if="platform.count != 0"
                                class="edit-whiteDelete"
                                @click="deletePlatformWhite(platform.platform_id, platform)"
                            ><i class="edit-whiteDeleteIcon"></i>删除</div>
                        </el-col>
                    </el-row>
                </template>
            </el-collapse-item>
        </el-collapse>
        <el-dialog
            title="提示"
            :visible.sync="centerDialogVisible"
            width="400px"
            center
        >
            <span>是否删除已导入的白名单数据</span>
            <span
                slot="footer"
                class="dialog-footer"
            >
                <el-button @click="centerDialogVisible = false">取 消</el-button>
                <el-button
                    type="primary"
                    @click="confirmDelete"
                >确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Inject } from 'vue-property-decorator';
import { Getter } from "vuex-class";
import { Dictionary } from "vuex";
import Setting from './setting';

@Component({
    watch: {
        'info.activity.platforms': {
            handler: function () {
                this.renderPlatform();
            }
        }
    }
})
export default class WhiteSet extends Setting {
    @Getter private whiteSet!: Dictionary<any>

    private checkedPlatforms: any = []
    private centerDialogVisible: boolean = false
    private deletePlatformId!: string
    private deletePlatform!: Dictionary<any>

    constructor() {
        super({ 'warn': '活动开启后已选平台不可更改' })
    }

    created() {
        this.renderPlatform();
    }

    public renderPlatform() {
        this.checkedPlatforms = [];
        // 处理已选择的发布平台白名单数据
        for (let i = 0, len = this.info.activity.platforms.length; i < len; i++) {
            for (let j = 0, jlen = this.whiteSet.list.length; j < jlen; j++) {
                if (this.info.activity.platforms[i] == this.whiteSet.list[j].platform_id) {
                    this.checkedPlatforms.push(this.whiteSet.list[j]);
                }
            }
        }
    }

    // 上传白名单验证
    public beforeFileUpload() {
        return true;
    }

    // 上传白名单
    public upLoadWhiteFile(file: Dictionary<any>, platformId: string, platform: Dictionary<any>) {
        let formFile = new FormData();
        formFile.append('whiteListFile', file.file);
        formFile.append('platform_id', platformId);

        this.$http.upLoadFile(this.apiList.whiteUrl, formFile).then((res: Dictionary<any>) => {
            if (res.status == 'success') {
                platform.count += res.data;
                this.$message({
                    showClose: true,
                    message: res.message,
                    type: 'success',
                });
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

    // 删除白名单
    public deletePlatformWhite(platform_id: string, platform: Dictionary<any>) {
        this.centerDialogVisible = true;
        this.deletePlatformId = platform_id;
        this.deletePlatform = platform;
    }

    // 确认删除
    public confirmDelete() {
        this.$http.post(this.apiList.nullifyWhiteUrl, { platform_id: this.deletePlatformId }).then((res: Dictionary<any>) => {
            if (res.status == 'success') {
                this.$message(res.message);
                this.deletePlatform.count = 0;
                this.centerDialogVisible = false;
            } else {
                this.$message({
                    message: res.message,
                    type: 'warning'
                });
            }
        })
    }
}
</script>


<style>
</style>
