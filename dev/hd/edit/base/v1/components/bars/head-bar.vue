<template>
    <div>
        <el-row
            type="flex"
            justify="space-between"
        >
            <el-col :span="18">
                <!-- 菜单栏 -->
                <!-- 扩展设置 -->
                <slot name="menu-ext">
                </slot>
                <!-- end -->
            </el-col>
            <el-col
                class="edit-control_btn"
                :span="4"
            >
                <!-- 操作按钮 -->
                <div>
                    <el-button
                        @click="previewAct"
                        type="primary"
                    >预览</el-button>
                    <el-button
                        @click="saveInfo"
                        type="primary"
                        :disabled="infoStatus == 0"
                    >保存</el-button>
                    <!-- 按钮扩展 -->
                    <slot name="btn-ext">
                    </slot>
                </div>
                <!-- end -->
                <!-- 预览弹窗 -->
                <div
                    class="preview-alert"
                    v-if="previewShow"
                >
                    <div class="preview-alert-nr">
                        <div class="preview-alert_title">预览</div>
                        <el-row class="tac">
                            <el-col :span="7">
                                <!-- 平台列表 -->
                                <el-menu
                                    @select="handleSelectPlatform"
                                    style="height: 390px;overflow: hidden;overflow-y: auto;"
                                    :default-active="platforms[0].id"
                                    class="el-menu-vertical-demo"
                                >
                                    <el-menu-item
                                        v-for="(platform, key) in platforms"
                                        :index="platform.id"
                                        :key="key"
                                    >
                                        <i class="el-icon-menu"></i>
                                        <span slot="title">{{platform.name}}</span>
                                    </el-menu-item>
                                </el-menu>
                                <!-- end -->
                            </el-col>
                            <el-col :span="15">
                                <div class="preview-alert_edit">
                                    <!-- 活动预览图 -->
                                    <div class="preview-alert-left">
                                        <div class="preview-img-box">
                                            <img
                                                :src="showPlatform.pic"
                                                alt=""
                                            >
                                        </div>
                                    </div>
                                    <!-- end -->
                                    <div class="preview-alert-right">
                                        <!-- 活动二维码 -->
                                        <div class="preview-code-box">
                                            <img
                                                :src="showPlatform.qrcode"
                                                alt="扫码查看活动"
                                            >
                                            <p>扫码查看活动</p>
                                        </div>
                                        <!-- end -->
                                        <!-- 活动地址-复制 -->
                                        <div class="preview-href-box">
                                            <p>{{showPlatform.url}}</p>
                                            <div
                                                @click="copyUrl(showPlatform.url)"
                                                class="preview-href-copy"
                                            >复制</div>
                                        </div>
                                        <!-- end -->
                                        <div class="preview-alert_tip">您可以将活动链接复制到您的公众号菜单或发布平台中</div>
                                        <!-- 预览弹窗操作按钮：离开、继续编辑 -->
                                        <div class="preview-alert-btn">
                                            <el-button
                                                @click="exit"
                                                style="width:110px;margin-top:20px;margin-left:30px;"
                                                type="primary"
                                            >离开</el-button>
                                            <el-button
                                                @click="() => {this.previewShow = false}"
                                                style="width:110px;margin-top:20px;color:#6D96FF;background:rgba(109, 150, 255, 0.1);"
                                                type="primary"
                                            >继续编辑</el-button>
                                        </div>
                                        <!-- end -->
                                    </div>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                </div>
                <!-- end -->
                <!-- 保存成功弹窗 -->
                <div
                    class="code-alert"
                    v-show="saveShow"
                >
                    <div class="code-alert-nr">
                        <h4>提示</h4>
                        <p>保存成功</p>
                        <div class="code-alert_edit">
                            <el-button
                                @click="exit"
                                style="width:110px;margin-top:-20px;margin-left:110px;"
                                type="primary"
                            >离开</el-button>
                            <el-button
                                @click="() => {this.saveShow = false}"
                                style="width:110px;margin-top:-20px;margin-left:40px;color:#6D96FF;background:rgba(109, 150, 255, 0.1);"
                                type="primary"
                            >继续编辑</el-button>
                        </div>
                    </div>
                </div>
                <!-- end -->
            </el-col>
        </el-row>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Action, Getter } from 'vuex-class'
import { Dictionary } from 'vuex';
// 粘贴功能
import Clipboard from 'clipboard';
import Bar from './bar';

@Component
export default class HeadBar extends Bar {
    constructor() {
        super({ 'warn': '活动开启后不可更改' })
    }

    @Action save!: Function                 // 保存操作
    @Action preview!: Function              // 预览操作
    @Getter public infoStatus!: any         // 数据编辑状态 0-未编辑 1-已修改

    private previewShow: boolean = false    // 预览弹窗显示/隐藏
    private saveShow: boolean = false       // 保存成功弹窗显示/隐藏
    private platforms!: any                 // 预览弹窗-发布平台列表
    private showPlatformIndex!: number      // 预览弹窗-当前选择平台序列号
    private showPlatform: any = null        // 预览弹窗-当前展示平台

    /**
     * @description: 保存操作
     * @param {type}
     */
    public saveInfo() {
        this.save().then(() => {
            this.saveShow = true
        })
    }

    /**
     * @description: 预览操作-先行保存、后预览
     * @param {type}
     */
    public previewAct() {
        if (this.infoStatus == 0) {
            this.preview().then((res: Dictionary<any>) => {
                this.platforms = res.data;
                this.filterPlatform(this.platforms[0].id);
            })
        } else {
            this.save().then(() => {
                this.preview().then((res: Dictionary<any>) => {
                    this.platforms = res.data;
                    this.filterPlatform(this.platforms[0].id);
                })
            })
        }
    }

    /**
     * @description: 预览弹窗-选择平台
     * @param {id: string}
     */
    public handleSelectPlatform(id: string) {
        this.filterPlatform(id);
    }

    /**
     * @description: 预览弹窗-过滤当前平台信息
     * @param {id: string}
     */
    public filterPlatform(id: string) {
        for (var i = 0, len = this.platforms.length; i < len; i++) {
            if (this.platforms[i].id == id) {
                this.showPlatformIndex = i;
            }
        }
        this.showPlatform = this.platforms[this.showPlatformIndex];
        this.previewShow = true;
    }

    /**
     * @description: 预览、保存成功弹窗-离开操作
     * @param {type}
     */
    public exit() {
        (<any>this).destroyedBeforeunloadHandler();
        window.top.location.href = this.apiList.listUrl;
    }

    /**
     * @description: 预览弹窗-复制活动链接
     * @param {url: string}
     */
    public copyUrl(url: string) {
        let clipboard = new Clipboard('.preview-href-copy', {
            text: function () {
                return url;
            }
        });
        clipboard.on('success', (e: Dictionary<any>) => {
            this.$message({
                showClose: true,
                message: '文字已复制到剪贴板中',
                type: 'success'
            });
            // 释放内存
            clipboard.destroy()
        })
        clipboard.on('error', (e: Dictionary<any>) => {
            // 不支持复制
            this.$message({
                showClose: true,
                message: "异常错误： " + JSON.stringify(e.message),
                type: 'warning'
            });
            // 释放内存
            clipboard.destroy()
        })
    }
}
</script>

<style lang="scss" scoped>
/*预览弹窗*/
.preview-alert {
    position: fixed;
    z-index: 2000;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);

    .preview-alert-nr {
        width: 800px;
        // width: 600px;
        height: 430px;
        margin: 8% auto 0px;
        background: #ffffff;
        box-shadow: 0 8px 25px 0 rgba(0, 0, 0, 0.2);
        border-radius: 4px;

        .preview-alert_title {
            width: 100%;
            text-align: center;
            height: 40px;
            line-height: 40px;
            font-size: 16px;
            color: #333333;
            background: #f2f4f7;
            border-radius: 4px;
        }

        .preview-alert_edit {
            width: 360px;
            margin: auto;
            margin-top: 30px;
            display: flex;
            display: -webkit-flex;
            justify-content: space-around;

            .preview-alert-left {
                width: 230px;

                .preview-img-box {
                    width: 230px;
                    height: 388px;
                    background: url("../../assets/img/preview-phone.png")
                        no-repeat;
                    background-size: 100% 100%;
                    margin-top: -20px;

                    img {
                        width: 133px;
                        height: 238px;
                        display: inline-block;
                        margin-top: 45px;
                        margin-left: 49px;
                        border-radius: 5px;
                    }
                }
            }

            .preview-alert-right {
                width: 330px;

                .preview-code-box {
                    width: 114px;
                    height: 114px;
                    border: 2px solid #c9d1e0;
                    border-radius: 2px;
                    padding: 7px;
                    margin: auto;
                    margin-bottom: 40px;

                    img {
                        width: 116px;
                        height: 116px;
                        display: inline-block;
                    }

                    p {
                        text-align: center;
                        font-size: 14px;
                        color: #333333;
                        line-height: 35px;
                    }
                }

                .preview-href-box {
                    width: 294px;
                    height: 34px;
                    padding: 5px 8px;
                    background-color: rgba(109, 150, 255, 0.1);
                    border-radius: 2px;
                    line-height: 1.2rem;

                    p {
                        width: 199px;
                        height: 34px;
                        font-size: 12px;
                        color: #333333;
                        display: inline-block;
                    }

                    .preview-href-copy {
                        cursor: pointer;
                        width: 40px;
                        height: 26px;
                        background: #6d96ff;
                        border-radius: 2px;
                        text-align: center;
                        font-size: 12px;
                        color: #ffffff;
                        line-height: 26px;
                        float: right;
                        margin-top: 5px;
                    }
                }
            }

            .preview-alert_tip {
                margin-top: 10px;
                opacity: 0.4;
                font-size: 12px;
                color: #42445e;
            }
        }

        .preview-alert_btn {
            width: 110px;
            height: 40px;
            text-align: center;
            font-size: 14px;
            color: #ffffff;
            line-height: 40px;
            background: #6d96ff;
            border-radius: 5px;
            margin: auto;
            margin-top: 30px;
        }
    }
}
// 保存成功弹窗
.code-alert {
    position: fixed;
    z-index: 9999;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);
    overflow: auto;
    padding-bottom: 20px;

    .code-alert-nr {
        width: 500px;
        height: 220px;
        font-size: 16px;
        margin: 10% auto 0px;
        background: #ffffff;
        box-shadow: 0 8px 4px 0 rgba(0, 0, 0, 0.2);
        border-radius: 4px;

        h4 {
            height: 40px;
            line-height: 40px;
            display: block;
            background: #f2f4f7;
            text-align: center;
            border-radius: 4px 4px 0 0;
        }

        p {
            color: #333333;
            text-align: center;
            padding: 35px 0px 60px;
        }

        .open-title {
            padding: 0px;
        }

        .open-tips {
            color: #898989;
            font-size: 14px;
        }

        a {
            width: 110px;
            display: block;
            float: left;
            height: 30px;
            line-height: 30px;
            margin-left: 30px;
        }

        .but {
            margin-left: 130px;
        }
    }
}
</style>
