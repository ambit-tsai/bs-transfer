(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.BsTransfer = factory());
}(this, (function () { 'use strict';

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  var options = {
    tableOptions: {
      classes: 'table table-bordered table-condensed table-hover',
      escape: true,
      clickToSelect: true,
      search: true,
      showSearchButton: true
    },
    upperOptions: {},
    lowerOptions: {}
  };

  var template = "<div class=\"ID\">\r\n    <div class=\"ID__upper\">\r\n        <table></table>\r\n    </div>\r\n    <div class=\"ID__middle\">\r\n        <button class=\"btn btn-info btn-sm\" type=\"button\"><span class=\"glyphicon glyphicon-chevron-up\"></span></button>\r\n        <button class=\"btn btn-info btn-sm\" type=\"button\"><span class=\"glyphicon glyphicon-chevron-down\"></span></button>\r\n    </div>\r\n    <div class=\"ID__lower\">\r\n        <table></table>\r\n    </div>\r\n\r\n\r\n    <style type=\"text/css\">\r\n        div.ID {\r\n            display: flex;\r\n            flex-direction: column;\r\n            height: 100%;\r\n            border: 1px solid #ddd;\r\n        }\r\n        .ID__upper {\r\n            height: 0;\r\n            flex-grow: 1;\r\n            margin-left: 8px;\r\n            margin-right: 8px;\r\n        }\r\n        .ID__middle {\r\n            padding: 8px;\r\n            text-align: center;\r\n            border-top: 1px solid #ddd;\r\n            border-bottom: 1px solid #ddd;\r\n        }\r\n        .ID__middle > button + button {\r\n            margin-left: 8px;\r\n        }\r\n        .ID__lower {\r\n            height: 0;\r\n            flex-grow: 1;\r\n            margin-left: 8px;\r\n            margin-right: 8px;\r\n        }\r\n    </style>\r\n</div>";

  /**
   * 初始化选项
   * @param {BsTransfer} instance
   * @param {object} opts
   */

  function initOptions(instance, opts) {
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

  function initDOM(instance, id) {
    const html = template.replace(/ID/g, id);
    instance.$dom = $(html);
    instance.$upper = instance.$dom.find(`.${id}__upper`);
    instance.$lower = instance.$dom.find(`.${id}__lower`);
    instance.$upperTable = instance.$upper.children('table');
    instance.$lowerTable = instance.$lower.children('table'); // 初始化表格

    const opts = instance.options;
    instance.$upperTable.bootstrapTable(opts.upperOptions);
    instance.$lowerTable.bootstrapTable(opts.lowerOptions); // 监听按钮点击事件

    const $middle = instance.$dom.find(`.${id}__middle`);

    if (typeof opts.toUpper === 'function') {
      $middle.find('button:first').click(opts.toUpper);
    }

    if (typeof opts.toLower === 'function') {
      $middle.find('button:last').click(opts.toLower);
    } // 挂载


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
      token = 1; // 取得令牌

      const ctx = this;
      const args = arguments;
      requestAnimationFrame(function () {
        fn.apply(ctx, args);
        token = 0; // 释放令牌
      });
    };
  }
  /**
   * 调整高度
   * @param {BsTransfer} instance
   */


  function adjustHeight(instance) {
    const height = instance.$upper.height();
    instance.$upperTable.bootstrapTable('resetView', {
      height
    });
    instance.$lowerTable.bootstrapTable('resetView', {
      height
    });
  }

  class BsTransfer {
    constructor(options) {
      _defineProperty(this, "options", void 0);

      _defineProperty(this, "$dom", void 0);

      _defineProperty(this, "$upper", void 0);

      _defineProperty(this, "$lower", void 0);

      _defineProperty(this, "$upperTable", void 0);

      _defineProperty(this, "$lowerTable", void 0);

      initOptions(this, options);
      initDOM(this, BsTransfer.id);
    }
    /**
     * 调用上层表格的方法
     * @param  {...any} args 
     */


    upperTable(...args) {
      return this.$upperTable.bootstrapTable(args);
    }
    /**
     * 调用下层表格的方法
     * @param  {...any} args 
     */


    lowerTable(...args) {
      return this.$lowerTable.bootstrapTable(args);
    }

  }

  _defineProperty(BsTransfer, "id", 'BS_TRANSFER');

  _defineProperty(BsTransfer, "defaultOptions", options);

  return BsTransfer;

})));
