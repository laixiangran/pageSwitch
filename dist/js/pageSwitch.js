/**
 * Created by laixiangran on 2016/04/03
 * homepage：http://www.laixiangran.cn
 * 页面切换插件
 */

(function(window, undefined) {

    var com = window.COM;
    if (!com) {
        throw "没有引入commonJS！";
    }

    var defaultOptions = {
        "container" : "container", // 容器，默认为#container
        "pages" : "page", // 子容器，默认为.page
        "easing" : "ease", // 特效方式，ease-in,ease-out,linear
        "duration" : 1000, // 每次动画执行的时间
        "pagination" : true, // 是否显示分页
        "loop" : false, // 是否循环
        "keyboard" : true, // 是否支持键盘
        "direction" : "vertical", // 滑动的方向，horizontal,vertical，默认垂直切换
        "pageSwitchComplete" : function(pagenum) {} // 切换完成的回调函数
    };

    var pageSwitch = window.pageSwitch = function(options) {
        this.options = com.$O.extend(defaultOptions, options || {});
        this.pageIndex =0;
        this.container = null;
        this.pages = [];
        this.init();
    };

    pageSwitch.prototype = {
        "init": function() {
            var psThis = this;
            psThis.container = com.$D.byId(this.options.container);
            psThis.pages = com.$D.byClassName(this.options.pages, psThis.container);

            com.$E.addEvent(document, COM.$B.browser.firefox ? "DOMMouseScroll" : "mousewheel", function(event) {
                console.log(com.$E.getWheelDelta(event));
            });
        }
    };

}(window));