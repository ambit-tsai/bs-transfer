import options from './options';
import {initOptions, initDOM} from './functions';


export default class BsTransfer {
    static id = 'BS_TRANSFER';
    static defaultOptions = options;


    options;
    $dom;
    $upper;
    $lower;
    $upperTable;
    $lowerTable;


    constructor(options) {
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
