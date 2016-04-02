#页面切换插件 pageSwitch v1.0.0

##简介

基于jquery的页面切换插件，可水平/垂直切换滑动（正在使用纯javascript实现...）

###模式

两种滑动模式 -- `horizontal（水平）`、`vertical（垂直）`

###默认属性

```javascript
options = {
            "container": "#container", // 页面容器
            "sections": ".section", // 子页面容器
            "easing": "ease", // 切换动画，ease-in,ease-out,linear
            "duration": 1000, // 每次动画执行的时间
            "pagination": true, // 是否显示分页
            "loop": false, // 是否循环
            "keyboard": true, // 是否支持键盘
            "direction": "vertical", // 滑动的方向 horizontal,vertical
            "pageSwitchComplete" : function(pagenum) {} // 切换完成的回调函数
        };
```

##使用

###引入

```html
<script src="../dist/jquery-1.11.2.min.js"></script>
<script src="../dist/js/pageSwitch.min.js"></script>
```
    
###添加容器

```html
<div id="container">
    <div class="section" id="section0">
        <p>This is page1</p>
    </div>
    <div class="section" id="section1">
         <p>This is page2</p>
    </div>
    <div class="section" id="section2">
         <p>This is page3</p>
    </div>
    <div class="section" id="section3">
         <p>This is page4</p>
    </div>
</div>
```

###初始化

```javascript
$("#container").switchPage(options);
```
