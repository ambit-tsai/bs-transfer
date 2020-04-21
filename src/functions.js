import options from './options';
import template from './template.html';


/**
 * 初始化选项
 * @param {BsTransfer} instance
 * @param {object} opts
 */
export function initOptions(instance, opts) {
    opts = $.extend(true, {}, options, opts);
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
 * 初始化 DOM
 * @param {BsTransfer} instance
 * @param {string} id
 */
export function initDOM(instance, id) {
    const html = template.replace(/ID/g, id);
    instance.$dom = $(html);
    instance.$upper = instance.$dom.find(`.${id}__upper`);
    instance.$lower = instance.$dom.find(`.${id}__lower`);
    instance.$upperTable = instance.$upper.children('table');
    instance.$lowerTable = instance.$lower.children('table');

    // 初始化表格
    const opts = instance.options;
    instance.$upperTable.bootstrapTable(opts.upperOptions);
    instance.$lowerTable.bootstrapTable(opts.lowerOptions);

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

    adjustHeight(instance);
    $(window).resize(rafThrottle(_ => adjustHeight(instance)));
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
 * 调整高度
 * @param {BsTransfer} instance
 */
function adjustHeight(instance) {
    const height = instance.$upper.height();
    instance.$upperTable.bootstrapTable('resetView', {height});
    instance.$lowerTable.bootstrapTable('resetView', {height});
}