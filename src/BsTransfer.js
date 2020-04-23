import $ from 'jquery';
import options from './options';
import {appendStyles, initOptions, initDOM, waitForRender} from './functions';


export default class BsTransfer {
    static id = 'BS_TRANSFER';
    static defaultOptions = options;


    options;
    $dom;
    $upper;
    $lower;
    $upperTable;
    $lowerTable;


    constructor(opts) {
        if (!$(`style.${BsTransfer.id}`).length) {
            appendStyles(BsTransfer.id);         // 添加样式
        }
        initOptions(this, opts);
        initDOM(this, BsTransfer.id);
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
        this.twoTables('resetView', {height});
    }
}
