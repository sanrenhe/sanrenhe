<template>
    <!-- tinymce 富文本编辑器 -->
    <div class="tinymce-editor">
        <editor
            v-model="myValue"
            :init="init"
            :disabled="disabled"
        >
        </editor>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import tinymce from 'tinymce/tinymce'
import Editor from '@tinymce/tinymce-vue'
import 'tinymce/themes/silver'
// 编辑器插件plugins
import 'tinymce/plugins/autolink'       // 自动链接 www. || http:// || https:// || ftp: || mailto:
import 'tinymce/plugins/colorpicker'    // 颜色选择器
import 'tinymce/plugins/fullscreen'     // 全屏
import 'tinymce/plugins/link'           // 超链接
import 'tinymce/plugins/hr'             // 水平分割线
import 'tinymce/plugins/searchreplace'  // 查找替换
import 'tinymce/plugins/image'          // 插入上传图片插件
import 'tinymce/plugins/table'          // 插入表格插件
import 'tinymce/plugins/lists'          // 列表插件
import 'tinymce/plugins/charmap'        // 特殊字符
import 'tinymce/plugins/textcolor'      // 文字颜色
export default {
    components: {
        Editor
    },
    props: {
        value: {
            type: String,
            default: ''
        },
        disabled: {
            type: Boolean,
            default: false
        },
        plugins: {
            type: [String, Array],
            default: 'autolink colorpicker fullscreen hr image link searchreplace textcolor charmap'
        },
        toolbar: {
            type: [String, Array],
            default: 'fontsizeselect | cut copy paste | forecolor backcolor bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image chooseImage charmap hr | subscript superscript | removeformat fullscreen searchreplace | undo redo'
        }
    },
    computed: mapGetters(["apiList"]),
    data() {
        return {
            init: {
                language_url: process.env.BASE_URL + 'js/langs/zh_CN.js',   // 汉化脚本
                language: 'zh_CN',                                          // 语言设置
                skin_url: process.env.BASE_URL + "js/skins/ui/oxide",       // 皮肤脚本
                height: 300,                // 高度
                plugins: this.plugins,      // 插件
                toolbar: this.toolbar,      // 工具栏
                branding: false,            //
                menubar: false,             // 是否显示菜单栏
                image_advtab: true,         // 图片高级设置
                image_description: false,   // 图片描述关闭
                setup: (editor) => {
                    // 自定义按钮
                    // 打开图库选择、上传图片按钮
                    editor.ui.registry.addButton('chooseImage', {
                        tooltip: '上传图片',
                        icon: 'upload',
                        onAction: () => {
                            this.$gallery({
                                typeUrl: this.apiList.picListUrl,
                                listUrl: this.apiList.pictureListUrl,
                                addTypeUrl: this.apiList.addPictureTypeUrl,
                                uploadUrl: this.apiList.picuploadUrl,
                                callback: (path) => {
                                    editor.execCommand('mceInsertContent', false, `<img src=${path}>`)
                                    editor.focus();
                                }
                            })
                        }
                    })
                }
            },
            myValue: this.value
        }
    },
    mounted() {
        tinymce.init({})
    },
    methods: {
        // 添加相关的事件，可用的事件参照文档=> https://github.com/tinymce/tinymce-vue => All available events

    },
    watch: {
        value(newValue) {
            this.myValue = newValue
        },
        myValue(newValue) {
            this.$emit('input', newValue)
        }
    }
}

</script>


<style scoped>
.tinymce-container {
    position: relative;
    line-height: normal;
}
.tinymce-container >>> .mce-fullscreen {
    z-index: 10000;
}
.tinymce-textarea {
    visibility: hidden;
    z-index: -1;
}
.editor-custom-btn-container {
    position: absolute;
    right: 4px;
    top: 4px;
    /*z-index: 2005;*/
}
.fullscreen .editor-custom-btn-container {
    z-index: 10000;
    position: fixed;
}
.editor-upload-btn {
    display: inline-block;
}
</style>