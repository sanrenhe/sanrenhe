/**
 * @name 规则验证
 */

/**
 * 邮箱
 * @param {*} s
 */
export function isEmail(s) {
  return /^([a-zA-Z0-9._-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(s)
}

/**
 * 手机号码
 * @param {*} s
 */
export function isMobile(s) {
  return /^1[0-9]{10}$/.test(s)
}

/**
 * 电话号码
 * @param {*} s
 */
export function isPhone(s) {
  return /^([0-9]{3,4}-)?[0-9]{7,8}$/.test(s)
}

/**
 * URL地址
 * @param {*} s
 */
export function isURL(s) {
  return /^http[s]?:\/\/.*/.test(s)
}

/**
 * 身份证号
 * @param {*} s
 */
export function isCardId(s) {
  return /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(s)
}

/**
 * 判断密码强度
 *   至少包括一个大写字母，一个小写字母，一个数字，一个特殊字符
 * @param {*} s
 */
export function isPassGrade(s) {
  return /^.*(?=.{6,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*? ]).*$/.test(s)
}

/**
 * 十六进制颜色
 * @param {*} s
 */
export function isColor(s) {
  return /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/.test(s)
}

/**
 * 是否包含中文
 * @param {*} s
 */
export function isChinese(s) {
  return /[\u4E00-\u9FA5]/.test(s)
}
