/**
 * 后台编辑接口
 */
const HOST = process.env.VUE_APP_HDCRM_HOST;
export const api = {
    getApiList: HOST + '/activitys/getEditApiList', // 获取接口地址接口
}