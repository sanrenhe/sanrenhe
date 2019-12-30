import state from './state';
import mutations from './mutations';
import actions from './actions';
import { Dictionary } from 'vuex';

/**
 * @description: 处理stores文件下的vuex模版数据
 * @param {type}
 */
let module_ext:Dictionary<any> = {}
const storeConText = require.context('./stores', true, /\.ts$/);
storeConText.keys().forEach(item => {
    const storeModule = storeConText(item).default || storeConText(item);
    const storeName = item.split("/")[1].split(".")[0];
    module_ext[storeName] = storeModule;
});

const appData = {
    state: state,
    mutations: mutations,
    actions: actions,
    modules: module_ext
}

export default appData;