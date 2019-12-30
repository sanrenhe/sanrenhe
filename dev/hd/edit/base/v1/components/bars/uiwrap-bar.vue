<template>
    <div>
        <!-- 编辑虚线框+替换图片+定位右侧编辑区 -->
        <div
            class="uiwrapper-btn"
            :style="styleFillter('btn')"
        >
            <template v-if="activeEdit.ele.image != undefined">
                <el-tooltip
                    class="item"
                    effect="dark"
                    content="编辑"
                    placement="top"
                >
                    <i
                        class="el-icon-edit-outline"
                        @click="editImage"
                    ></i>
                </el-tooltip>
            </template>
            <template v-if="activeEdit.ele.text != undefined">
                <!-- 替换图片 -->
                <el-tooltip
                    class="item"
                    effect="dark"
                    content="样式"
                    placement="top"
                    v-if="activeEdit.ele.text.boxShow"
                >
                    <i
                        class="el-icon-edit"
                        @click="editText"
                    ></i>
                </el-tooltip>
                <!-- 定位右侧编辑区 -->
                <i
                    class="el-icon-edit"
                    @click="editText"
                    v-else
                ></i>
            </template>
        </div>
        <!-- 编辑虚线框 -->
        <!-- 上 -->
        <div
            class="uiwrapper uirwapper-top"
            :class="{ 'black': activeEdit.ele.type == 'black'}"
            :style="styleFillter('top')"
        ></div>
        <!-- 下 -->
        <div
            class="uiwrapper uirwapper-bottom"
            :class="{ 'black': activeEdit.ele.type == 'black'}"
            :style="styleFillter('bottom')"
        ></div>
        <!-- 左 -->
        <div
            class="uiwrapper uirwapper-left"
            :class="{ 'black': activeEdit.ele.type == 'black'}"
            :style="styleFillter('left')"
        ></div>
        <!-- 右 -->
        <div
            class="uiwrapper uirwapper-right"
            :class="{ 'black': activeEdit.ele.type == 'black'}"
            :style="styleFillter('right')"
        ></div>

        <!-- 编辑图片弹窗 -->
        <el-dialog
            title="编辑图片"
            :visible.sync="imageBoxShow"
            width="400px"
        >
            <el-row
                type="flex"
                class="edit-control_ele"
                v-for="item in activeEdit.ele.image"
                :key="item.path"
            >
                <el-col :span="8">
                    <p>{{item.title}}：</p>
                </el-col>
                <el-col :span="14">
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
        </el-dialog>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Dictionary } from 'vuex';
import { Getter, Mutation } from 'vuex-class'
import Bar from './bar';

import imagePart from '../parts/image-part.vue';

@Component({
    components: {
        imagePart
    }
})
export default class UiwrapBar extends Bar {
    constructor() {
        super({ 'warn': '活动开启后不可更改' })
    }

    @Mutation('updateEditWrapper') updateEditWrapper!: Function     // 更新编辑区对应显示信息
    @Mutation('updateActiveNames') updateActiveNames!: Function     // 更新设置区对应显示信息

    private imageBoxShow: boolean = false;      // 替换图片弹窗 显示/隐藏
    private textBoxShow: boolean = false;       // 文字样式弹窗 显示/隐藏

    /**
     * @description: 编辑图片
     * @param {type}
     */
    public editImage() {
        if (this.activeEdit.ele.image) {
            this.imageBoxShow = true;
        } else {
            this.updateEditWrapper()
        }
    }

    /**
     * @description: 编辑文案-样式/定位右侧编辑区
     * @param {type}
     */
    public editText() {
        if (this.activeEdit.ele.text.boxShow) {
            this.textBoxShow = true;
        } else {
            this.handle();
        }
    }

    /**
     * @description: 定位右侧编辑区
     * @param {type}
     */
    public handle() {
        this.updateEditWrapper(
            {
                tab: this.activeEdit.ele.text.tab,
                path: this.activeEdit.ele.text.path,
            }
        );
        this.updateActiveNames(this.activeEdit.ele.text.set);

        window.setTimeout(function () {
            $('.el-tab-pane').animate({
                scrollTop: $('.edit-active')[0].offsetTop - 100
            }, 200)
        }, 100)
    }

    /**
     * @description: 渲染虚线框、编辑按钮位置
     * @param {type}
     */
    public styleFillter(type: string) {
        let styles: Dictionary<any> = {
            width: this.activeEdit.offset.w,
            height: this.activeEdit.offset.h,
            left: this.activeEdit.offset.x - this.activeEdit.scroll.x,
            top: this.activeEdit.offset.y - this.activeEdit.scroll.y
        }

        if (type == 'top' || type == 'bottom') {
            styles.height = 0;
            if (type == 'bottom') {
                styles.top = (this.activeEdit.offset.h + styles.top - 0.5);
            }
        } else if (type == 'left' || type == 'right') {
            styles.width = 0;
            if (type == 'right') {
                styles.left = (this.activeEdit.offset.w + styles.left - 0.5);
            }
        } else if (type == 'btn') {
            styles.top = styles.height > 34 ? (styles.top + 1) : (styles.top - 34);
            styles.left = styles.left + 1;
            styles.width = 'auto';
            styles.height = 'auto';
        }

        for (let key in styles) {
            styles[key] = styles[key] + 'px';
        }

        return styles;
    }
}

</script>

<style lang="scss" scoped>
.uiwrapper {
    border: 0.5px dashed #ffffff;
    position: absolute;
    border-radius: 100px;
}
.uiwrapper-btn {
    position: absolute;
    font-size: 24px;
    text-align: center;
    cursor: pointer;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 1;

    i {
        width: 34px;
        color: rgba(255, 255, 255, 0.7);
    }

    i:hover {
        color: #ffffff;
    }
}
.black {
    border: 0.5px dashed #000000 !important;
}
</style>