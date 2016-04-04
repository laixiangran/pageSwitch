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
            if (this.pageIndex != 0) {
                this.offset -= rect.top;
            } else {
                this.offset = 0;
            }
            this.initEffects(this.offset, this.pageIndex);
        },
        "initEffects": function(offset, pageIndex) {
            var psThis = this;
            psThis.canScroll = false;
            var opts = psThis.options;
            var container = psThis.container;
            var traslate = "";
            if (opts.direction == "horizontal") {
                // traslate = "-" + rect.left + "px, 0px, 0px";
            } else {
                traslate = "0px, " + offset + "px, 0px";
            }
            com.$D.setStyle(container, {
                "transition": "all " + opts.duration + "ms " + opts.easing,
                "transform": "translate3d(" + traslate + ")"
            });

            com.$A.forEach(psThis.pages, function(page, index) {
                if (pageIndex == index) {
                    com.$D.addClass(page, "active");
                } else {
                    com.$D.removeClass(page, "active");
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