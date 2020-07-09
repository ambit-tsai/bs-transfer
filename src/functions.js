import $ from 'jquery';
import options from './options';
import template from './template.html';
import styles from './styles.css';


/**
 * 初始化选项
 * @param {BsTransfer} instance
 * @param {object} opts
 */
export function initOptions(instance, opts) {
    opts = $.extend(true, {}, options, opts);
    if (opts.mutexFields instanceof Array) {
        const [field0, field1] = opts.mutexFields;
        if (field0 && !field1) opts.mutexFields[1] = field0;
    }
    opts.upperOptions = $.extend(true, {}, opts.tableOptions, opts.upperOptions);
    opts.lowerOptions = $.extend(true, {}, opts.tableOptions, opts.lowerOptions);
    if (!opts.upperOptions.toolbar) {
        opts.upperOptions.toolbar = $('<b>可选</b>')[0];
    }
    if (!opts.lowerOptions.toolbar) {
        opts.lowerOptions.toolbar = $('<b>已选</b>')[0];
    }
    instance.options = opts;
}


/**
 * 初始化穿梭框
 * @param {BsTransfer} instance
 * @param {string} id
 */
export function initTransfer(instance, id) {
    const opts = instance.options;
    const html = template.replace(/ID/g, id);
    instance.$dom = $(html);
    instance.$upper = instance.$dom.find(`.${id}__upper`);
    instance.$lower = instance.$dom.find(`.${id}__lower`);
    instance.$upperTable = instance.$upper.children('table');
    instance.$lowerTable = instance.$lower.children('table');

    // 初始化表格
    let isInitialized = false;
    // if (opts.mutexFields instanceof Array) {
    //     isInitialized = initWithMutexFields(instance);
    // }
    if (!isInitialized) {
        instance.upperTable(opts.upperOptions);
        instance.lowerTable(opts.lowerOptions);
    }

    // 监听按钮点击事件
    const $middle = instance.$dom.find(`.${id}__middle`);
    if (typeof opts.toUpper === 'function') {
        $middle.find('button:first').click(opts.toUpper);
    }
    if (typeof opts.toLower === 'function') {
        $middle.find('button:last').click(opts.toLower);
    }

    // 挂载
    const $el = $(opts.mountPoint);
    instance.$dom.addClass($el.attr('class'));
    $el.replaceWith(instance.$dom);

    // 自适应高度
    $(window).resize(rafThrottle(_ => instance.adjustHeight()));
    waitForRender(_ => instance.adjustHeight());
}


/**
 * 利用`requestAnimationFrame`进行节流
 * @param {function} fn
 * @returns {function}
 */
function rafThrottle(fn) {
    let token = 0;
    return function () {
        if (token) return;
        token = 1;      // 取得令牌
        const ctx = this;
        const args = arguments;
        requestAnimationFrame(function () {
            fn.apply(ctx, args);
            token = 0;  // 释放令牌
        });
    };
}


/**
 * 等待渲染
 * @param {function} fn 
 */
export function waitForRender(fn) {
    if (Promise) {
        Promise.resolve().then(fn)
    } else {
        setTimeout(fn);
    }
}


/**
 * 增加样式
 * @param {string} id 
 */
export function appendStyles(id) {
    let html = `<style class="ID" type="text/css">${styles}</style>`;
    html = html.replace(/ID/g, id);
    $(document.body).append(html);
}


/**
 * 带互斥字段时的初始化
 * @param {BsTransfer} instance
 * @returns {boolean}
 */
function initWithMutexFields(instance) {
    const opts = instance.options;
    const upperColumns = opts.upperOptions.columns;
    let i = 0, len = upperColumns.length;
    for (; i < len; ++i) {
        if (upperColumns[i].checkbox) break;
    }
    if (i >= len) return false;             // no checkbox

    const ckColumn = upperColumns[i];
    if (ckColumn.formatter) return false;   // `formatter` already exists

    const [field0, field1] = opts.mutexFields;
    let hasInitUpperTable = 0;
    const afterLowerTableLoadSuccess = function () {
        const data = {};
        $.each(instance.lowerTable('getData'), function (_, item) {
            data[ item[field1] ] = 1;
        });
        ckColumn.formatter = function (_, row) {
            if (row[field0] in data) {
                return {
                    disabled: true,
                    checked: false,
                };
            }
        };
        if (hasInitUpperTable) {
            instance.upperTable('load', instance.upperTable('getData'));    // reload data
        } else {
            instance.upperTable(opts.upperOptions);                         // init upper table
            hasInitUpperTable = 1;
        }
    };

    if (typeof opts.lowerOptions.onLoadSuccess === 'function') {
        const onLoadSuccess = opts.lowerOptions.onLoadSuccess;
        opts.lowerOptions.onLoadSuccess = function () {
            onLoadSuccess.apply(opts.lowerOptions, arguments);
            afterLowerTableLoadSuccess();
        };
    } else {
        opts.lowerOptions.onLoadSuccess = afterLowerTableLoadSuccess;
    }
    instance.lowerTable(opts.lowerOptions);
    return true;
}
