import service from "./service";
import { AxiosRequestConfig } from "axios";

const http = {
    get(url: string, data?: any) {
        return service.get(url, {
            params: data
        });
    },
    post(url: string, data?: any) {
        return service.post(url, data);
    },
    upLoadFile(url: string, data?: any) {
        return service({
            url: url,
            method: "post",
            data: data,
            contentType: false,
            processData: false,
            dataType: "json"
        } as AxiosRequestConfig);
    }
};

export default http;
