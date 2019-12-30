<template>
<!-- 图片部件-展示、大图预览、打开图库替换图片 -->
    <div>
        <!-- 图片展示 -->
        <div
            v-if="value"
            class="el-upload-list el-upload-list--picture-card"
        >
            <div
                class="el-upload-list__item is-success"
            >
                <img
                    class="flex-img__image"
                    :src="value"
                >
                <label class="el-upload-list__item-status-label">
                    <i class="el-icon-upload-success el-icon-check"></i>
                </label>
                <span class="el-upload-list__item-actions">
                    <span class="el-upload-list__item-preview">
                        <i
                            class="el-icon-zoom-in"
                            @click.stop="handlePreview('background_pic')"
                        ></i>
                    </span>
                    <span class="el-upload-list__item-delete">
                        <i
                            class="el-icon-my-exchangeImage"
                            @click.stop="choosePic"
                        ></i>
                    </span>
                </span>
            </div>
        </div>
        <!-- 上传图片按钮 -->
        <el-button
            v-else
            @click="choosePic"
            type="primary"
        >添加图片</el-button>
        <!-- 图片大小限制文案 -->
        <slot name="tip"></slot>
        <!-- 图片预览弹窗 -->
        <el-dialog
            width="375px"
            :visible.sync="previewShow"
            append-to-body
        >
            <img
                width="100%"
                :src="value"
                alt
            >
        </el-dialog>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import Part from './part';

@Component
export default class ImagePart extends Part {
    constructor() {
        super({ 'warn': '活动开启后不可更改' })
    }
    @Prop(String)
    value!: string              // 图片url
    @Prop([String, Number])
    imgSize!: string | number   // 图片限制大小（单位：K）
    @Prop(String)
    errTip!: string             // 图片错误提示文案

    private previewShow: boolean = false    // 图片预览弹窗 显示/隐藏

    /**
     * @description: 图片预览操作
     * @param {type}
     */
    public handlePreview() {
        this.previewShow = true;
    }
    /**
     * @description: 选择图片操作-打开图库、选择|上传图片
     * @param {type}
     */
    public choosePic() {
        this.$gallery({
            typeUrl: this.apiList.picListUrl,
            listUrl: this.apiList.pictureListUrl,
            addTypeUrl: this.apiList.addPictureTypeUrl,
            imgSize: this.imgSize,
            uploadUrl: this.apiList.picuploadUrl,
            uploadErr: this.errTip,
            callback: (path: string) => {
                this.$emit('input', path);
            }
        })
    }
}
</script>

<style lang="scss" scoped>
.flex-img__image {
    width: 100%;
    height: 100%;
    vertical-align: -10px;
    object-fit: contain;
}
</style>
