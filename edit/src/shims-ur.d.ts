/// <reference types="vue/types/vue" />

import { VueConstructor } from "vue";
import { AxiosInstance } from "axios";
import { Dictionary } from 'vuex'
declare global {
    interface Window {
        axios: AxiosInstance;
        http: any;
    }
}
declare module "vue/types/vue" {
    interface Vue {
        $axios: AxiosInstance;
        $http: any;
        $gallery: any;
        editEleBlackList: string[];
        info: Dictionary<any>;
        activeEdit: Dictionary<any>;
        appData: Dictionary<any>;
        eleEditFillter: Function;
    }
    interface VueConstructor {
        $axios: AxiosInstance;
        $http: any;
    }
}

declare module 'vue/types/vue-async-manager';

declare module 'vue/types/clipboard';