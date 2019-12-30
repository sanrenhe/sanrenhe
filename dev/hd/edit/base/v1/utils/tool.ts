import { Dictionary } from "vuex";

/**
 * JSON 克隆
 */
export function objClone(jsonObj: any) {
    let buf: any;
    if (jsonObj instanceof Array) {
        buf = [];
        let i = jsonObj.length;
        while (i--) {
            buf[i] = objClone(jsonObj[i]);
        }
        return buf;
    } else if (jsonObj instanceof Object) {
        buf = {};
        for (let k in jsonObj) {
            buf[k] = objClone(jsonObj[k]);
        }
        return buf;
    } else {
        return jsonObj;
    }
}

// 判断空对象
export function isEmpty(obj: Array<any> | Dictionary<any>) {
    if (!obj) return false;
    for (let k in obj) {
        return false;
    }
    return true;
}

// 判断字段是否存在
export function isExistKey(target: Dictionary<any>, path: string) {
    let arr = path.split(/[\.\[\]]/).filter(a => a);
    let o = target;
    for (let k of arr) {
        o = o[k];
        if (o === undefined) {
            return false;
        }
    }
    return true;
}