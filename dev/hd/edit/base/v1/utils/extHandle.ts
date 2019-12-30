export function filterExt(data: any, value?: any) {
    var val = null;
    switch (data.type) {
        case "input":
            val = renderInput();
            break;
        case "switch":
            val = renderSwitch(value);
            break;
        case "datetimepicker_range":
            val = renderTime(value);
            break;
        default:
            val = "";
            break;
    }
    return val;
}

function renderInput() {
    return "";
}

function renderSwitch(value?: any) {
    if (!value) {
        return "2";
    } else {
        return value;
    }
}

function renderTime(value?: any) {
    if (!value) {
        return parseInt((new Date().getTime() / 1000).toString());
    } else {
        return value;
    }
}
