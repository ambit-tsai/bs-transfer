# BS Transfer
穿梭框组件，基于 Bootstrap-Table


#### 安装
<a href="dist/bs-transfer.min.js" target="_blank">dist/bs-transfer.min.js</a>


#### 示例
```html
<link href="path/to/bootstrap-v3.css" rel="stylesheet">
<link href="path/to/bootstrap-table.css" rel="stylesheet">
<script src="path/to/jquery.js" type="text/javascript"></script>
<script src="path/to/bootstrap-v3.js" type="text/javascript"></script>
<script href="path/to/bootstrap-table.js" type="text/javascript"></script>
<script src="path/to/bs-transfer.min.js" type="text/javascript"></script>
<script type="text/javascript">
    var transfer = new BsTransfer({
        mountPoint: '#transferDiv',
        tableOptions: {
            columns: [
                {field: 'username', title: '账号'},
                {field: 'password', title: '密码'},
            ],
        },
        upperOptions: {
            url: '/upper-api',
        },
        lowerOptions: {
            url: '/lower-api',
        },
        toUpper: function () {},
        toLower: function () {},
    });
    transfer.upperTable('getSelections');   // 调用上层表格的方法
    transfer.lowerTable('getSelections');   // 调用下层表格的方法
</script>
```


#### 构造函数
|参数|类型|说明|
|-|-|-|
|options|object|配置项|


#### 配置项说明
|名称|类型|默认值|说明|
|-|-|-|-|
|mountPoint|string/Element/jQuery||挂载点，可以是 jQuery 选择器，或元素对象|
|tableOptions|object|{...}|公共的 Bootstrap Table 参数|
|upperOptions|object|{}|上层表格的参数|
|lowerOptions|object|{}|下层表格的参数|
|toUpper|function||向上按钮的点击事件|
|toLower|function||向下按钮的点击事件|


#### 静态属性
|属性|类型|说明|
|-|-|-|
|id|string|标识|
|defaultOptions|object|默认配置项|


#### 实例方法
|方法|参数|说明|
|-|-|-|
|upperTable|原 Bootstrap Table 参数|调用上层表格的方法|
|lowerTable|原 Bootstrap Table 参数|调用下层表格的方法|
|twoTables|原 Bootstrap Table 参数|同时调用两个表格的方法|
|adjustHeight||调整两个表格高度|
