<template>
    <div>
        <!-- 商品名称 -->
        <div
            :class="{ 'edit-active': eleActive('goods.' + index + '.name')}"
            @mouseover="eleMouseover"
            v-if="eleFillter('goods.name', false)"
        >
            <el-row
                type="flex"
                class="edit-control_ele"
            >
                <el-col :span="6">
                    <p>商品名称：</p>
                </el-col>
                <el-col :span="18">
                    <el-input
                        placeholder="请输入内容"
                        size="medium"
                        maxlength="15"
                        show-word-limit
                        v-model="goods.name"
                    >
                    </el-input>
                </el-col>
            </el-row>
        </div>
        <!-- 商品类型 -->
        <div
            :class="{ 'edit-active': eleActive('goods.' + index + '.type')}"
            @mouseover="eleMouseover"
            v-if="eleFillter('goods.type', false)"
        >
            <el-row
                type="flex"
                class="edit-control_ele"
            >
                <el-col :span="6">
                    <p>
                        商品类型：
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
                        v-model="goods.type"
                        placeholder="请选择商品类型"
                        @change="goodsTypeChange"
                        :disabled="info.activity.status == 1 && goods.is_valid == 1"
                    >
                        <el-option
                            v-for="(type, key) in typeOptions"
                            :key="key"
                            :label="type.name"
                            :value="key"
                        >
                        </el-option>
                    </el-select>
                </el-col>
            </el-row>
        </div>
        <!-- 通用码 -->
        <el-row
            type="flex"
            class="edit-control_ele"
            v-if="goods.type == 'tyq'"
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
                    v-model="goods.generic_code"
                >
                </el-input>
            </el-col>
        </el-row>
        <!-- 商品库存 -->
        <el-row
            type="flex"
            class="edit-control_ele"
            v-if="eleFillter('goods.num', false)"
        >
            <el-col :span="6">
                <p>商品库存：</p>
            </el-col>
            <el-col :span="18">
                <!-- 电子券商品库存为导入电子券码库存 -->
                <template v-if="goods.is_dzq == 1">
                    <el-input-number
                        disabled
                        size="medium"
                        v-model="goods.code_num"
                        :max="99999999"
                        label="商品库存"
                    ></el-input-number>
                </template>
                <!-- 非电子券商品库存 -->
                <template v-else>
                    <el-input-number
                        v-if="info.activity.status == 1 && goods.is_valid == 1"
                        size="medium"
                        v-model="goods.input_num"
                        :min="Number(goods.minnum)"
                        :max="99999999"
                        :precision="0"
                        @blur="(e) => goods.input_num = filterElInputNumber(goods.input_num, Number(goods.minnum))"
                        label="商品库存"
                    ></el-input-number>
                    <el-input-number
                        v-else
                        size="medium"
                        v-model="goods.input_num"
                        :min="Number(0)"
                        :max="99999999"
                        :precision="0"
                        @blur="(e) => goods.input_num = filterElInputNumber(goods.input_num, 0)"
                        label="商品库存"
                    ></el-input-number>
                </template>
            </el-col>
        </el-row>
        <!-- 商品价格 -->
        <el-row
            type="flex"
            class="edit-control_ele"
            v-if="eleFillter('goods.price', false)"
        >
            <el-col :span="6">
                <p>商品价格：
                    <el-popover
                        placement="bottom"
                        trigger="hover"
                        :content="popover.warn"
                    >
                        <i
                            slot="reference"
                            class="el-icon-my-warn"
                        ></i>
                    </el-popover>
                </p>
            </el-col>
            <el-col :span="8">
                <el-input-number
                    :disabled="info.activity.status == 1 && goods.is_valid == 1"
                    size="medium"
                    v-model="goods.price"
                    @blur="(e) => goods.price = filterElInputNumber(goods.price, 0)"
                    name="decimal"
                    :precision="2"
                    :step="1"
                    :min="0"
                    :max="9999999"
                ></el-input-number>
            </el-col>
        </el-row>
        <!-- 消费地址 type=='typ' || 'xsxf' -->
        <el-row
            type="flex"
            class="edit-control_ele"
            v-if="goods.type == 'tyq' || goods.type == 'xsxf'"
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
                    v-model="goods.use_url"
                >
                </el-input>
            </el-col>
        </el-row>
        <!-- 商品图片 -->
        <el-row
            type="flex"
            class="edit-control_ele"
            v-if="eleFillter('goods.pic_url', false)"
        >
            <el-col :span="6">
                <p>商品图片：</p>
            </el-col>
            <el-col :span="18">
                <!-- 图片选择组件 -->
                <image-part
                    errTip="商品图片大小不能超过500K"
                    imgSize="500"
                    v-model="goods.pic_url"
                >
                    <template #tip>
                        <div class="edit-img_tip">建议尺寸 300*300，大小不能超过500K</div>
                    </template>
                </image-part>
            </el-col>
        </el-row>
        <!-- 扩展设置 -->
        <slot
            name="part-ext"
            :goods="goods"
        >
        </slot>
        <!-- 商品说明 -->
        <el-row
            type="flex"
            class="edit-control_ele"
        >
            <el-col :span="6">
                <p>商品说明：</p>
            </el-col>
            <el-col :span="18">
                <editor-part v-model="goods.content.detail" />
            </el-col>
        </el-row>
        <!-- 券码设置 -->
        <el-divider
            v-if="goods.is_dzq == 1"
            content-position="left"
        >
            券码设置
        </el-divider>
        <el-row
            type="flex"
            class="edit-control_ele"
            v-if="goods.is_dzq == 1"
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
        <slot
            name="limit-ext"
            :goods="goods"
        >
        </slot>
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
export default class GoodsPart extends Part {
    constructor() {
        super({ 'warn': '活动开启后不可更改' })
    }

    @Getter public activeEdit!: Dictionary<any>;

    @Prop(Object)
    goods!: Dictionary<any>         // 商品value

    @Prop(Object)
    typeOptions!: Dictionary<any>   // 商品类型集合

    @Prop(Number)
    index!: number                  // 商品位置信息

    /**
     * @description: 商品类型选择
     * @param {val: number}
     */
    public goodsTypeChange(val: number) {
        this.goods.is_dzq = this.typeOptions[val].is_dzq;
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
        formFile.append('goodsId', this.goods.id);

        this.$http.upLoadFile(this.apiList.importUrl, formFile).then((res: Dictionary<any>) => {
            if (res.status == 'success') {
                this.goods.code_num = this.goods.is_dzq == 1 ? res.data : this.goods.code_num;
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
