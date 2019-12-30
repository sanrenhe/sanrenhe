/**
 * 素材库
 *    挂载在vue原型上，通过 this.elementGallery 访问组件实例
 *    params :
 *     uploadUrl: "", // 图片上传URL
 *     listUrl: "", // 图片列表数据URL
 *     imgClassListUrl: "", // 素材分类URL
 *     addClassUrl: "", // 添加分类URL
 *     multiple: true, // 是否支持选取多个图片
 *     limit: 10, // 一批次最多可上传图片数
 *     onSelect: null, // 选择后回调函数
 *     enableUpload: true, // 是否启用图片上传
 *     maxSize: 2 // 最大尺寸（M）
 */

import gallery from './gallery.vue';
import Vue from 'vue';
import { VueConstructor } from 'vue';

const galleryPlugin = {
    install(vue:VueConstructor) {
        // 插件实例（共享）
        let imgbox:any

        vue.prototype.$gallery = function (options:object) {
            imgbox || (imgbox = new gallery());

            Object.assign(imgbox.options, options);

            if (!imgbox.$el) {
                let vm = imgbox.$mount();
                (document.querySelector('body') as Element).appendChild(vm.$el);
                imgbox.getType(0);
            } else {
                imgbox.gallery.show = true;
            }

            return imgbox;
        };
    }
};

Vue.use(galleryPlugin);