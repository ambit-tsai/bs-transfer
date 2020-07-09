(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('jquery')) :
  typeof define === 'function' && define.amd ? define(['jquery'], factory) :
  (global = global || self, global.BsTransfer = factory(global.jQuery));
}(this, (function ($) { 'use strict';

  $ = $ && Object.prototype.hasOwnProperty.call($, 'default') ? $['default'] : $;

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
      showSearchButton: true,
      sidePagination: 'server'
    },
    upperOptions: {},
    lowerOptions: {}
  };

  var template = "<div class=\"ID\">\r\n    <div class=\"ID__upper\">\r\n        <table></table>\r\n    </div>\r\n    <div class=\"ID__middle\">\r\n        <button class=\"btn btn-info btn-sm\" type=\"button\"><span class=\"glyphicon glyphicon-chevron-up\"></span></button>\r\n        <button class=\"btn btn-info btn-sm\" type=\"button\"><span class=\"glyphicon glyphicon-chevron-down\"></span></button>\r\n    </div>\r\n    <div class=\"ID__lower\">\r\n        <table></table>\r\n    </div>\r\n</div>";

  var styles = "\r\ndiv.ID {\r\n    display: flex;\r\n    flex-direction: column;\r\n    height: 100%;\r\n    border: 1px solid #ddd;\r\n}\r\n.ID__upper {\r\n    height: 0;\r\n    flex-grow: 1;\r\n    margin-left: 8px;\r\n    margin-right: 8px;\r\n    overflow: hidden;\r\n}\r\n.ID__middle {\r\n    padding: 8px;\r\n    text-align: center;\r\n    border-top: 1px solid #ddd;\r\n    border-bottom: 1px solid #ddd;\r\n}\r\n.ID__middle > button + button {\r\n    margin-left: 8px;\r\n}\r\n.ID__lower {\r\n    height: 0;\r\n    flex-grow: 1;\r\n    margin-left: 8px;\r\n    margin-right: 8px;\r\n    overflow: hidden;\r\n}";

  /**
   * 初始化选项
   * @param {BsTransfer} instance
   * @param {object} opts
   */

  function initOptions(instance, opts) {
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

  function initTransfer(instance, id) {
    const opts = instance.options;
    const html = template.replace(/ID/g, id);
    instance.$dom = $(html);
    instance.$upper = instance.$dom.find(`.${id}__upper`);
    instance.$lower = instance.$dom.find(`.${id}__lower`);
    instance.$upperTable = instance.$upper.children('table');
    instance.$lowerTable = instance.$lower.children('table'); // 初始化表格
    //     isInitialized = initWithMutexFields(instance);
    // }

    {
      instance.upperTable(opts.upperOptions);
      instance.lowerTable(opts.lowerOptions);
    } // 监听按钮点击事件


    const $middle = instance.$dom.find(`.${id}__middle`);

    if (typeof opts.toUpper === 'function') {
      $middle.find('button:first').click(opts.toUpper);
    }

    if (typeof opts.toLower === 'function') {
      $middle.find('button:last').click(opts.toLower);
    } // 挂载


    const $el = $(opts.mountPoint);
    instance.$dom.addClass($el.attr('class'));
    $el.replaceWith(instance.$dom); // 自适应高度

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
   * 等待渲染
   * @param {function} fn 
   */


  function waitForRender(fn) {
    if (Promise) {
      Promise.resolve().then(fn);
    } else {
      setTimeout(fn);
    }
  }
  /**
   * 增加样式
   * @param {string} id 
   */

  function appendStyles(id) {
    let html = `<style class="ID" type="text/css">${styles}</style>`;
    html = html.replace(/ID/g, id);
    $(document.body).append(html);
  }

  class BsTransfer {
    constructor(opts) {
      _defineProperty(this, "options", void 0);

      _defineProperty(this, "$dom", void 0);

      _defineProperty(this, "$upper", void 0);

      _defineProperty(this, "$lower", void 0);

      _defineProperty(this, "$upperTable", void 0);

      _defineProperty(this, "$lowerTable", void 0);

      if (!$(`style.${BsTransfer.id}`).length) {
        appendStyles(BsTransfer.id); // 添加样式
      }

      initOptions(this, opts);
      initTransfer(this, BsTransfer.id);

      if (typeof opts.afterRender === 'function') {
        waitForRender(opts.afterRender);
      }
    }
    /**
     * 调用上层表格的方法
     * @param  {...any} args 
     */


    upperTable(...args) {
      return this.$upperTable.bootstrapTable(...args);
    }
    /**
     * 调用下层表格的方法
     * @param  {...any} args 
     */


    lowerTable(...args) {
      return this.$lowerTable.bootstrapTable(...args);
    }
    /**
     * 同时调用两个表格的方法
     * @param  {...any} args 
     */


    twoTables(...args) {
      this.$upperTable.bootstrapTable(...args);
      this.$lowerTable.bootstrapTable(...args);
    }
    /**
     * 调整两个表格高度
     */


    adjustHeight() {
      const height = this.$upper.height();
      this.twoTables('resetView', {
        height
      });
    }

  }

  _defineProperty(BsTransfer, "id", 'BS_TRANSFER');

  _defineProperty(BsTransfer, "defaultOptions", options);

  return BsTransfer;

})));
