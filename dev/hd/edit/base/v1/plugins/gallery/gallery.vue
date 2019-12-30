<template>
    <div>
        <div
            class="gallery-box"
            v-if="gallery.show"
        >
            <div class="gallery-container">
                <div class="gallery-add">
                    <el-upload
                        :disabled="pageParams.source == 1 || gallery.myPicture.length == 0"
                        class="upload-demo"
                        action="123"
                        multiple
                        :before-upload="beforeUpload"
                        :http-request="upLoad"
                        accept="image/*"
                        :show-file-list="false"
                    >
                        <el-button
                            :disabled="pageParams.source == 1 || gallery.myPicture.length == 0"
                            size="small"
                            type="primary"
                        >点击上传</el-button>
                    </el-upload>
                    <img
                        @click="closeGallery"
                        class="gallery-close"
                        src="../../assets/img/gallery-close.png"
                    >
                </div>
                <div class="gallery-title">图片库</div>
                <el-row class="tac">
                    <el-col :span="6">
                        <el-menu
                            @select="chooseType"
                            :default-active="gallery.defaultActive"
                            style="height: 412px;overflow: hidden;overflow-y: auto;background: #F8F9FB;"
                            class="el-menu-vertical-demo gallery-menu"
                        >
                            <el-submenu index="0">
                                <template slot="title">
                                    <i style="width:25px;display:inline-block;"></i>
                                    <span>我的</span>
                                </template>
                                <el-menu-item-group>
                                    <el-menu-item
                                        v-for="(item, key) in gallery.myPicture"
                                        :data-index="'0-' + item.id"
                                        :index="'0-' + item.id"
                                        :key="key"
                                    >{{item.name}}</el-menu-item>
                                </el-menu-item-group>
                                <template slot="title">
                                    <i
                                        class="add-type"
                                        @click.stop="addTypeShow"
                                    >+</i>
                                </template>
                            </el-submenu>
                            <el-submenu index="1">
                                <template slot="title">
                                    <i style="width:25px;display:inline-block;"></i>
                                    <span>图片库</span>
                                </template>
                                <el-menu-item-group>
                                    <el-menu-item
                                        v-for="(item, key) in gallery.sysPicture"
                                        :data-index="'1-' + item.id"
                                        :index="'1-' + item.id"
                                        :key="key"
                                    >{{item.name}}</el-menu-item>
                                </el-menu-item-group>
                            </el-submenu>
                        </el-menu>
                    </el-col>
                    <el-col
                        :span="18"
                        style="padding: 30px 25px 25px 25px;"
                    >
                        <div class="gallery-wall">
                            <span
                                v-for="(picture, key) in gallery.picList"
                                :key="picture.pic_url"
                            >
                                <div
                                    v-if="key<5"
                                    class="el-upload-list el-upload-list--picture-card"
                                >
                                    <div class="el-upload-list__item is-success gallery-img">
                                        <el-tooltip
                                            class="item"
                                            effect="light"
                                            :content="picture.pic_name"
                                            placement="top-start"
                                            popper-class="gallery_img_tip"
                                        >
                                            <span class="gallery-img-box">
                                                <img
                                                    :alt="picture.pic_name"
                                                    @click="choosePic(picture.pic_url)"
                                                    :src="picture.pic_url"
                                                    class="flex-img__image"
                                                >
                                            </span>
                                        </el-tooltip>
                                        <p class="gallery-img-title">{{picture.pic_name}}</p>
                                    </div>
                                </div>
                                <div
                                    v-else
                                    class="el-upload-list el-upload-list--picture-card"
                                >
                                    <div class="el-upload-list__item is-success gallery-img">
                                        <el-tooltip
                                            class="item"
                                            effect="light"
                                            :content="picture.pic_name"
                                            placement="bottom-start"
                                            popper-class="gallery_img_tip"
                                        >
                                            <span class="gallery-img-box">
                                                <img
                                                    :alt="picture.pic_name"
                                                    @click="choosePic(picture.pic_url)"
                                                    :src="picture.pic_url"
                                                    class="flex-img__image"
                                                >
                                            </span>
                                        </el-tooltip>
                                        <p class="gallery-img-title">{{picture.pic_name}}</p>
                                    </div>
                                </div>
                            </span>
                        </div>
                        <div
                            class="gallery-page"
                            v-if="pageParams.page != 0"
                        >
                            <el-pagination
                                :current-page="pageParams.page"
                                @current-change="handleCurrentChange"
                                :total="pageParams.total"
                                small
                                background
                                layout="prev, pager, next"
                            >
                            </el-pagination>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </div>
        <div
            class="stock-alert"
            v-if="addType.show"
        >
            <div class="stock-alert-nr">
                <h4>新建分类</h4>
                <p>
                    <label>输入名称：</label>
                    <input
                        v-model="addType.name"
                        placeholder="请输入分类名称"
                        type="text"
                    >
                </p>
                <a
                    @click="addTypeClass"
                    href="javascript:;"
                    class="blue-but"
                >确定</a>
                <a
                    @click="closeAddType"
                    href="javascript:;"
                    class="reset-but"
                >取消</a>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import $ from 'jquery'
import { Component } from 'vue-property-decorator'
import { Dictionary } from 'vuex';

@Component
export default class Gallery extends Vue {
    // 自定义配置
    options = {
        typeUrl: '', // 图库分类接口
        listUrl: '', // 分类列表接口
        addTypeUrl: '', // 添加分类接口
        imgSize: 2000, // 图片上传大小限制
        uploadUrl: '', // 上传图片接口
        uploadErr: '', // 图片上传限制提示
        callback: (path: string) => { }
    }
    // 添加分类
    addType = {
        show: false,
        name: ''
    }
    // 图库
    gallery = {
        show: false,
        defaultActive: '',
        myPicture: [],
        sysPicture: [],
        picList: []
    }
    // 翻页
    pageParams = {
        source: 0,
        id: '',
        page: 1,
        total: 0
    }
    /**
     * getType
     */
    public getType(source: number) {
        this.$http.get(this.options.typeUrl, { source: source }).then((res: Dictionary<any>) => {
            let result = res.data;
            if (res.status == 'success') {
                if (source == 0) {
                    this.gallery.defaultActive = '0-' + result.data[0].id;
                    this.gallery.myPicture = result.data;
                    this.pageParams.source = source;
                    this.pageParams.id = result.data[0].id;

                    this.getList();
                } else {
                    this.gallery.sysPicture = result.data;
                }
            }
            if (source != 1) {
                this.getType(1);
            }
        })
    }
    /**
     * getList
     */
    public getList() {
        this.$http.get(this.options.listUrl, {
            source: this.pageParams.source,
            cat_id: this.pageParams.id,
            offset: 10,
            page: this.pageParams.page
        }).then((res: Dictionary<any>) => {
            if (res.status == 'success') {
                this.gallery.picList = res.data.data;
                this.pageParams.total = res.data.total;
            } else {
                this.pageParams.page = 0;
                this.pageParams.total = 0;
                this.gallery.picList = [];
            }
            this.gallery.show = true;
        })
    }
    /**
     * addTypeClass
     */
    public addTypeClass() {
        this.$http.get(this.options.addTypeUrl, {
            name: this.addType.name
        }).then((res: Dictionary<any>) => {
            if (res.status == 'success') {
                this.getType(0);
                this.addType.show = false;
            } else {
                this.$message({
                    showClose: true,
                    message: res.message,
                    type: 'error'
                })
            }
        })
    }
    /**
     * beforeUpload
     */
    public beforeUpload(file: Dictionary<any>) {
        let isLimit = file.size / 1024 <= this.options.imgSize;
        if (!isLimit) {
            this.$message({
                showClose: true,
                message: this.options.uploadErr,
                type: 'error'
            });
        }
        return isLimit;
    }
    /**
     * upLoad
     */
    public upLoad(file: Dictionary<any>) {
        let formFile = new FormData();
        formFile.append('pic', file.file);
        formFile.append('pic_name', file.file.name);
        formFile.append('cat_id', this.pageParams.id);

        this.$http.upLoadFile(this.options.uploadUrl, formFile).then((res: Dictionary<any>) => {
            if (res.status == 'success') {
                if (this.gallery.myPicture.length == 0) {
                    this.pageParams.source = 0;
                    this.getType(0);
                } else {
                    this.pageParams.page = 1;
                    this.getList();
                }
            } else {
                this.$message({
                    showClose: true,
                    message: res.message,
                    type: 'error'
                });
            }
        })
    }
    /**
     * handleCurrentChange
     */
    public handleCurrentChange(page: number) {
        this.pageParams.page = page;
        this.getList();
    }
    /**
     * addType
     */
    public addTypeShow() {
        this.addType.show = true;
    }
    /**
     * closeAddType
     */
    public closeAddType() {
        this.addType.show = false;
    }
    /**
     * closeGallery
     */
    public closeGallery() {
        this.gallery.show = false;
    }
    /**
     * choosePic
     */
    public choosePic(path: string) {
        let img = new Image();
        img.onload = () => {
            $.ajax({
                url: path + '?imageInfo',
                type: 'GET',
                success: (res: Dictionary<any>) => {
                    if (res.size) {
                        let img_size = res.size / 1024;
                        if (img_size > this.options.imgSize) {
                            this.$message.error(this.options.uploadErr);
                        } else {
                            this.options.callback(path);
                            this.gallery.show = false;
                        }
                    } else {
                        this.$message.error('网络错误');
                    }
                },
            })
        }
        img.src = path;
    }
    /**
     * chooseType
     */
    public chooseType(type: string) {
        let typeArr = type.split('-');
        this.pageParams = {
            source: parseInt(typeArr[0]),
            id: typeArr[1],
            page: 1,
            total: 0
        };
        this.getList();
    }
}
</script>

<style lang="scss" scoped>
.gallery-box {
    position: fixed;
    z-index: 3999;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);

    .gallery-container {
        width: 620px;
        height: 483px;
        margin: 8% auto 0px;
        background: #ffffff;
        box-shadow: 0 8px 25px 0 rgba(0, 0, 0, 0.2);
        border-radius: 4px;

        .gallery-add {
            width: 100%;
            height: 70px;

            button {
                width: 110px;
                height: 40px;
                font-size: 14px;
                border-radius: 5px;
                margin-top: 15px;
                margin-left: 20px;
            }

            .gallery-close {
                width: 9px;
                height: 9px;
                padding: 5px;
                border-radius: 100px;
                border: #b3b3b3 solid 1px;
                cursor: pointer;
                position: absolute;
                margin-left: 585px;
                margin-top: -30px;
            }
        }

        .gallery-title {
            width: 100%;
            text-align: center;
            height: 70px;
            line-height: 70px;
            font-size: 16px;
            color: #333333;
            border-bottom: 1px solid #f0f0f0;
            margin-top: -70px;
        }

        .gallery-menu {
            .add-type {
                display: inline-block;
                width: 25px;
                height: 25px;
                background: #6d96ff;
                text-align: center;
                line-height: 25px;
                color: #fff;
                border-radius: 2px;
                margin-left: 20px;
            }
        }

        .gallery-wall {
            width: 410px;
            height: 330px;
            margin: auto;

            .gallery-img {
                width: 74px;
                height: 130px;
                border: unset;
                border-radius: 0px;
                overflow: unset;

                .gallery-img-box {
                    width: 70px;
                    height: 110px;
                    display: inline-block;
                    border: 1px solid rgba(66, 68, 94, 0.15);
                    border-radius: 1px;
                    padding: 2px;
                    cursor: pointer;

                    img {
                        width: 100%;
                        height: 100%;
                        border-radius: 1px;
                    }
                }

                .gallery-img-tip {
                    height: 98px;
                    width: 70px;
                    border-radius: 1px;
                    margin: auto;
                    left: 3px;
                    top: 3px;
                }

                .gallery-img-title {
                    text-align: center;
                    font-size: 14px;
                    color: #333333;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    overflow: hidden;
                    display: block;
                    width: 80px;
                    margin-top: 0px;
                }
            }
        }

        .gallery-page {
            width: 100%;
            height: 50px;

            .el-pagination {
                float: right;
            }
        }
    }
}

.stock-alert {
    position: fixed;
    z-index: 9991;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);

    .stock-alert-nr {
        width: 500px;
        height: 220px;
        margin: 10% auto 0px;
        background: #ffffff;
        box-shadow: 0 8px 4px 0 rgba(0, 0, 0, 0.2);
        border-radius: 4px;
        text-align: center;
    }

    h4 {
        width: 100%;
        text-align: center;
        height: 40px;
        line-height: 40px;
        font-size: 16px;
        color: #333333;
        background: #f2f4f7;
        border-radius: 4px 4px 0 0;
    }

    p {
        height: 34px;
        line-height: 34px;
        padding-top: 15px;
        clear: both;
        padding-bottom: 30px;

        label {
            font-size: 14px;
            color: #333333;
        }

        input {
            width: 250px;
            height: 32px;
            color: #c8c8c8;
            padding-left: 10px;
            border: 1px solid #cccccc;
            border-radius: 3px;
        }
    }

    a {
        width: 110px;
        height: 40px;
        line-height: 40px;
        display: inline-block;
        margin-right: 20px;
        font-size: 14px;
    }

    .but {
        margin-left: 120px;
        margin-right: 40px;
    }

    .cancel-but {
        height: 28px;
    }
}
.blue-but {
    color: #ffffff;
    text-align: center;
    background: #6d96ff;
    border-radius: 5px;
}

.reset-but {
    border: 1px solid #6d96ff;
    border-radius: 5px;
    height: 38px !important;
    font-size: 14px;
    color: #6d96ff;
    text-align: center;
    background: rgba(109, 150, 255, 0.1);
}
</style>
