var window_hight = document.documentElement.scrollHeight - 300;
var window_width = document.documentElement.scrollWidth - 300;
document.getElementById('code_area').style.height = window_hight + 'px';
document.getElementById('code_area').style.width = window_width + 'px';
document.getElementById('code-background').style.width = window_width + 'px';

/**
 关键字名与颜色相匹配
 * */
var colors = new Array(
    '#cc6d2d',//宏颜色 如`#include` `#define` `using` `namespace`, 操作符颜色,如`+ - * / =`
    '#ffc46a',//函数名颜色
    '#b4c973',//头文件颜色和数值颜色，如`<stdio.h>`,`'c'`,`6.6`
    '#a1617a',//数据类型颜色，如 `long long`,`int`
    '#c45737',//其它函数的颜色，如`printf`,`sqrt`等
    '#6d9cbe',//格式化符号颜色，如`%d`,`%lf`
    '#808080',//注释
    '#ffffff'//普通变量名
);

/**
 *
 * 标识符
 */
var identifiers = new Array(
    'auto', 'break', 'case', 'char', 'const', 'continue',
    'default', 'double', 'enum', 'extern', 'float',
    'goto', 'int', '__int64', 'long', 'register', 'short',
    'singed', 'static', 'struct', 'typedef', 'union',
    'unsigned', 'void', '\\n', 'class', 'bool', 'inline', 'template'
);

/**
 *
 * 运算符
 */

var operators = new Array(
    'for', 'do', 'EOF', 'else', 'if', 'switch', 'sizeof', 'while', 'return', '+', '-', '*', '/', '<', '<=', '>', '>=', '=', '==',
    '!=', '^', '\"', '&',
    '&&', '|', '||', '%', '~', '<<', '>>', '\\', '.', '\?', ':', '!', 'public', 'protected', 'private', 'using', 'namespace'
);
/**
 * 其它符号
 */

var others = new Array(
    '(', ')', '[', ']', ',', ';', '{', '}'
)
/**
 * 格式化符号
 */
var formatChar = new Array('c', 'd', 'e', 'f', 'o', 'x', 's');

/**
 *
 * DFA状态键值
 */
var states = new Array(false, false, false, false, false);
var keys = new Array(
    '0',//字符 ‘#’
    '1',//字母或下划线
    '2',//数字
    '3',//双引号 ‘"’
    '4'//注释开始符 ‘/’
);

/**
 *
 * 判断关键字标识符，若是，返回true
 */
function isKeyIdentifier(s) {
    return (identifiers.indexOf(s) !== -1)
}

/**
 *
 * 判断运算符，若是，返回true
 */

function isOperator(s) {
    return (operators.indexOf(s) !== -1)
}

/**
 *
 * 判断数字，若是返回true
 */
function isNumber(n) {
    return (n >= '0' && n <= '9')
}

/**
 * 判断其它字符
 */
function isOthers(c) {
    return (others.indexOf(c) !== -1)
}

/**
 *
 * 判断字母下划线,若是返回true
 */
function isLegalChar(c) {
    return (c >= 'a' && c <= 'z' || c >= 'A' && c <= 'Z' || c === '_')
}

/**
 *
 * 判断是否该为蓝色
 */
function isBlue(s) {
    return (s === 'true' || s === 'false' || s[0] === '%')
}

/**
 *
 * 安全化字符串
 */
function safeHtml(s) {
    s = s.replace(/\ /g, '&nbsp;');
    s = s.replace(/</g, '&lt;');
    s = s.replace(/>/g, '&gt;');
    return s;
}

/**
 *
 * 判断是否是不含'e'或'E'的数字
 */
function isAllNumber(s) {
    for (var p = 0; p < s.length; p++) {
        if (!(isNumber(s[p]) || s[p] !== '.')) return true;
    }
    return false;
}

document.getElementById('highlight_button').onclick = function (ev) {
    $('html,body').animate({scrollTop: $("#code-background").offset().top - 100}, 500);//滚动到顶部
    var origin = document.getElementById('code_area').value;//输入字符串
    var result = '';//结果字符串
    var nowToken = '';//记录当前非标识符词素
    var nowIdentifier = '';
    var nowNumber = '';
    var oneWord = false;
    for (var i = 0; i < origin.length; i++) {//处理html特殊符号显示
        if (origin[i] === '\n') {
            if (nowIdentifier === 'define' || nowIdentifier === 'include') {
                nowIdentifier = '';
            } else if (isKeyIdentifier(nowIdentifier)) {
                result += '<span style="color: #a1617a">' + nowIdentifier + '</span>';
            } else if (isOperator(nowIdentifier)) {
                result += '<span style="color: #cc6d2d">' + nowIdentifier + '</span>';
            } else if (nowIdentifier == 'main') {
                result += '<span style="color: #ffc46a">' + nowIdentifier + '</span>';
            }
            else {
                var j = i;
                for (; j < origin.length; j++) if (origin[j] !== ' ') break;
                if (origin[j] === '(')//设置函数颜色
                    result += '<span style="color: #ffc46a">' + nowIdentifier + '</span>';
                else
                    result += '<span style="color: #ffffff">' + nowIdentifier + '</span>';
            }
            if (isOthers(origin[i])) {
                result += '<span style="color: #ffffff">' + origin[i] + '</span>';
            }
            result += '<br>';
            nowToken = '';
            nowIdentifier = '';
            continue;
        }
        if (origin[i] === '/' && origin[i + 1] === '/') {//处理单行注释
            nowToken = '//';
            for (i += 2; i < origin.length; i++) {
                if (origin[i] === '\n') break;
                nowToken += origin[i];
            }
            result += '<span style="color: #808080">' + nowToken + '</span>';
            nowIdentifier = '';
            nowToken = '';
            nowNumber = '';
            i--;
            continue;
        }
        if (origin[i] === '/' && origin[i + 1] === '*') {//处理多行注释
            nowToken = '/*';
            for (i += 2; i < origin.length; i++) {
                if (i + 2 === origin.length) break;
                if (origin[i] === '*' && origin[i + 1] === '/') {
                    nowToken += '*/';
                    break;
                }
                if (origin[i] === '\n') nowToken += '<br>';
                else nowToken += origin[i];
            }
            nowToken = nowToken.replace(/\ /g, '&nbsp;');
            result += '<span style="color: #808080">' + nowToken + '</span>';
            nowIdentifier = '';
            nowToken = '';
            nowNumber = '';
            i++;
            continue;
        }
        if (origin[i] === '\'') {
            var temp = origin[i];
            for (i++; i < origin.length; i++) {
                temp += origin[i];
                if (origin[i] === '\'') break;
            }
            temp = safeHtml(temp);
            result += '<span style="color: #b4c973">' + temp + '</span>';
            continue;
        }
        nowToken += origin[i];
        if (origin[i] === '\"' && origin[i - 1] !== '\\') states[3] = !states[3];
        if ((isLegalChar(origin[i]) || (nowIdentifier.length >= 1 && isNumber(origin[i]))) && !(isAllNumber(nowNumber) && (origin[i] === 'e' || origin[i] === 'E'))) {
            nowIdentifier += origin[i];
            //oneWord = true;
            if ((nowIdentifier === 'e' || nowIdentifier === 'E') && nowNumber.length !== 0) {
                nowNumber += nowIdentifier;
                nowIdentifier = '';
            }
        } else {
            //oneWord = false;
            if (!states[3]) {//不在注释或双引号里
                if (nowIdentifier === 'define' || nowIdentifier === 'include') {
                    nowIdentifier = '';
                } else if (isKeyIdentifier(nowIdentifier)) {
                    result += '<span style="color: #a1617a">' + nowIdentifier + '</span>';
                } else if (isOperator(nowIdentifier)) {
                    result += '<span style="color: #cc6d2d">' + nowIdentifier + '</span>';
                } else if (nowIdentifier === 'main') {
                    result += '<span style="color: #ffc46a">' + nowIdentifier + '</span>';
                } else if (isBlue(nowIdentifier)) {
                    result += '<span style="color: #6d9cbe">' + nowIdentifier + '</span>';
                } else {
                    j = i;
                    for (; j < origin.length; j++) if (origin[j] !== ' ') break;
                    if (origin[j] === '(')//设置函数颜色
                        result += '<span style="color: #ffc46a">' + nowIdentifier + '</span>';
                    else {
                        if (origin[i - 2] === '\\')//转义字符
                            result += '<span style="color: #cc6d2d">' + nowIdentifier + '</span>';
                        else if (origin[i - 2] === '\\' || origin[i] === '\"')//刚刚结束双引号
                            result += '<span style="color: #b4c973">' + nowIdentifier + '</span>';
                        else
                            result += '<span style="color: #ffffff">' + nowIdentifier + '</span>';
                    }
                }
                if (isOthers(origin[i])) {
                    if (origin[i - 1] === '\\') {
                        result += '<span style="color: #cc6d2d">' + origin[i] + '</span>';
                    } else {
                        result += '<span style="color: #ffffff">' + origin[i] + '</span>';
                    }
                }
                nowIdentifier = '';
            } else {//在双引号里
                if (origin[i - 2] === '\\')
                    result += '<span style="color: #cc6d2d">' + nowIdentifier + '</span>';
                else
                    result += '<span style="color: #b4c973">' + nowIdentifier + '</span>';
            }
            if (isNumber(origin[i]) || (isNumber(origin[i - 1]) && (origin[i] === 'e' || origin[i] === 'E'))) {
                nowNumber += origin[i];
                for (i++; i < origin.length; i++) {
                    if (isNumber(origin[i]) || origin[i] === '.' || origin[i] === 'e' || origin[i] === 'E') {
                        nowNumber += origin[i];
                    } else {
                        break;
                    }
                }
                if (nowNumber === '0') {
                    if (origin[i] === 'x' || origin[i] === 'X') {//对十六进制数进行判断
                        nowNumber += origin[i];
                        for (i++; i < origin.length; i++) {
                            if (isNumber(origin[i]) || (origin[i] >= 'a' && origin[i] <= 'f' || origin[i] >= 'A' && origin[i] <= 'F')) {
                                nowNumber += origin[i];
                            } else {
                                break;
                            }
                        }
                    }
                }
                result += '<span style="color: #b4c973">' + nowNumber + '</span>';
                nowToken = '';
                nowNumber = '';
                i--;
            } else {
                if (isOperator(origin[i])) {
                    if (states[3] && origin[i] === '%') {
                        temp = '%';
                        for (i++; i < origin.length; i++) {
                            temp += origin[i];
                            if (formatChar.indexOf(origin[i].toLowerCase()) !== -1) break
                        }
                        result += '<span style="color: #6d9cbe">' + temp + '</span>';
                        continue;
                    } else if (states[3]) {
                        if (origin[i] === '\"' || origin[i] === '\\')
                            result += '<span style="color: #cc6d2d">' + origin[i] + '</span>';
                        else
                            result += '<span style="color: #b4c973">' + origin[i] + '</span>';
                    } else {
                        result += '<span style="color: #cc6d2d">' + origin[i] + '</span>';
                    }
                } else if (origin[i] === '\'') {
                    result += '<span style="color: #b4c973">' + origin[i] + '</span>';
                }
                nowIdentifier = '';
            }
        }


        if (origin[i] === '#' && !states[3]) {
            states[0] = true;
            //nowIdentifier += origin[i];
        }
        if (states[0]) {
            if (nowToken.indexOf('include') !== -1 || nowToken.indexOf('define') !== -1) {
                nowToken = nowToken.replace(/\ /g, '&nbsp;');
                result += '<span style="color: #cc6d2d">' + nowToken + '</span>';
                states[0] = false;
                if (nowToken.indexOf('include') !== -1) {
                    nowToken = '';
                    for (i++; i < origin.length; i++) {
                        if (origin[i] === '\n') break;
                        else nowToken += origin[i];
                    }
                    i--;
                    nowToken = safeHtml(nowToken);
                    result += '<span style="color: #b4c973">' + nowToken + '</span>';
                }
                nowToken = '';
                //nowIdentifier = '';
            }
            continue;
        }
        if (origin[i] === ' ') {
            result += '&nbsp;';
        }
    }
    document.getElementById('result').innerHTML = result;
};