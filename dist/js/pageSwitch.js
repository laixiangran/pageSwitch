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
        "loop" : true, // 是否循环
        "keyboard" : false, // 是否支持键盘
        "direction" : "vertical", // 滑动的方向，horizontal,vertical，默认垂直切换
        "pageSwitchComplete" : function(pageIndex) {} // 切换完成的回调函数
    };

    var pageSwitch = window.pageSwitch = function(options) {
        this.options = com.$O.extend(defaultOptions, options || {});
        this.pageIndex = 0;
        this.container = null;
        this.pages = [];
        this.canScroll = true;
        this.offset = 0;
        this.init();
    };

    pageSwitch.prototype = {
        "init": function() {
            var psThis = this;
            psThis.container = com.$D.byId(psThis.options.container);
            psThis.pages = com.$D.byClassName(psThis.options.pages, psThis.container);

            // 初始化布局
            com.$D.addClass(psThis.container, "ps-container");
            com.$D.addClass(psThis.pages[0], "ps-active");
            if (psThis.options.direction == "horizontal") {
                com.$D.addClass(psThis.container, "ps-h-container");
                com.$D.addClass(psThis.container, "ps-left");
                com.$A.forEach(psThis.pages, function(page, index, pages) {
                    com.$D.addClass(page, "ps-page");
                    com.$D.addClass(page, "ps-h-page");
                    com.$D.addClass(page, "ps-left");
                });
            } else {
                com.$A.forEach(psThis.pages, function(page, index, pages) {
                    com.$D.addClass(page, "ps-page");
                    com.$D.addClass(page, "ps-v-page");
                });
            }

            // 监听滚动事件
            var mousewheel = com.$B.browser.firefox ? "DOMMouseScroll" : "mousewheel";
            com.$E.addEvent(document, mousewheel, function(event) {
                com.$E.preventDefault(event);
                if (psThis.canScroll) {
                    var delta = com.$E.getWheelDelta(event);
                    if (delta < 0) {
                        psThis.movePageDown();
                    } else {
                        psThis.movePageUp();
                    }
                }
            });
        },
        "movePageUp": function() {
            var opts = this.options;
            var pages = this.pages;
            var flag = (this.pageIndex <= 0 || opts.loop);
            if (this.pageIndex) {
                this.pageIndex--;
            } else if(opts.loop) {
                this.pageIndex = pages.length - 1;
            }
            flag ? com.$O.noop() : this.scrollPage(pages[this.pageIndex]);
        },
        "movePageDown": function() {
            var opts = this.options;
            var pages = this.pages;
            var flag = (this.pageIndex >= pages.length - 1 || opts.loop);
            if (this.pageIndex < pages.length - 1) {
                this.pageIndex++;
            } else if(opts.loop) {
                this.pageIndex = 0;
            }
            flag ? com.$O.noop() : this.scrollPage(pages[this.pageIndex]);
        },
        "scrollPage": function(page) {
            var rect = com.$D.getRect(page);
            if (!rect) {
                return;
            }
            this.initEffects(rect, this.pageIndex);
        },
        "initEffects": function(rect, pageIndex) {
            var psThis = this;
            psThis.canScroll = false;
            var opts = psThis.options;
            var container = psThis.container;
            var traslate = "";
            if (opts.direction == "horizontal") {
                if (psThis.pageIndex != 0) {
                    psThis.offset -= rect.left;
                } else {
                    psThis.offset = 0;
                }
                traslate = psThis.offset + "px, 0px, 0px";
            } else {
                if (psThis.pageIndex != 0) {
                    psThis.offset -= rect.top;
                } else {
                    psThis.offset = 0;
                }
                traslate = "0px, " + psThis.offset + "px, 0px";
            }
            com.$D.setStyle(container, {
                "transition": "all " + opts.duration + "ms " + opts.easing,
                "transform": "translate3d(" + traslate + ")"
            });

            com.$A.forEach(psThis.pages, function(page, index) {
                if (pageIndex == index) {
                    com.$D.addClass(page, "ps-active");
                } else {
                    com.$D.removeClass(page, "ps-active");
                }
            });

            com.$E.addEvent(container, "transitionend", function() {
                psThis.canScroll = true;
                opts.pageSwitchComplete(psThis.pageIndex);
            });

            // 是否显示分页
            if (opts.pagination) {
                //TODO
            }
        }
    };

}(window));