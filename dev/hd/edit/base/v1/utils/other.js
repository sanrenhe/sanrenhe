/**
 * 函数去抖
 * 只执行一次
 *
 * @export
 * @param {function} 函数
 * @param {number} 时间
 * @returns {function}
 */
export function debounce(action, idle) {
    var last;
    return function () {
        var ctx = this,
            args = arguments;
        clearTimeout(last);
        last = setTimeout(function () {
            action.apply(ctx, args);
        }, idle);
    };
}