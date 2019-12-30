import { PluginObject } from "vue";
import service from "./service";
import http from "./http";

const Plugin: PluginObject<any> = {
    install: vue => {
        vue.$axios = service;
        vue.$http = http;
    }
};
Plugin.install = Vue => {
    Vue.$axios = service;
    window.axios = service;
    Object.defineProperties(Vue.prototype, {
        $axios: {
            get() {
                return service;
            }
        },
        $http: {
            get() {
                return http;
            }
        }
    });
};

export default Plugin;
