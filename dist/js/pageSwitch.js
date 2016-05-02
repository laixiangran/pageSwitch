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
        "pagination" : false, // 是否显示分页
        "loop" : false, // 是否循环
        "keyboard" : false, // 是否支持键盘
        "direction" : "vertical", // 滑动的方向，horizontal,vertical，默认垂直切换
        "pageSwitchComplete" : function(pageIndex) {} // 切换完成的回调函数
    };

    var pageSwitch = window.pageSwitch = function(options) {
        this.options = com.$O.extend(defaultOptions, options || {});
        this.infos = {
            name: "pageSwitch",
            version: "1.0",
            author: "laixiangran@163.com"
        };
        this.pageIndex = 0;
        this.container = null;
        this.pages = [];
        this.paging = null;
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
            com.$D.addClass(psThis.pages[psThis.pageIndex], "ps-active");

            // 添加分页
            if (psThis.options.pagination) {
                var insertNode = '<ul class="ps-paging">';
                com.$A.forEach(psThis.pages, function(page, index) {
                    insertNode += '<li></li>';
                });
                insertNode += '</ul>';
                psThis.paging = com.$D.append(document.body, insertNode);
                com.$D.addClass(psThis.paging.childNodes[psThis.pageIndex], "paging-active");

                // 给分页注册点击事件
                com.$A.forEach(psThis.paging.childNodes, function(paging, index) {
                    com.$E.addEvent(paging, "click", function(event) {
                        psThis.pageIndex = index;
                        psThis.scrollPage();
                    });
                });
            }

            if (psThis.options.direction == "horizontal") {
                psThis.paging ? com.$D.addClass(psThis.paging, "ps-paging-h") : com.$O.noop();
                com.$D.addClass(psThis.container, ["ps-h-container"]);
                com.$D.setStyle(psThis.container, {
                    "width": (psThis.pages.length * 100) + "%",
                    "float": "left"
                });
                com.$A.forEach(psThis.pages, function(page) {
                    com.$D.addClass(page, ["ps-page", "ps-h-page"]);
                    com.$D.setStyle(page, {
                        "width": (100 / psThis.pages.length) + "%",
                        "float": "left"
                    });
                });
            } else {
                psThis.paging ? com.$D.addClass(psThis.paging, "ps-paging-v") : com.$O.noop();
                com.$A.forEach(psThis.pages, function(page) {
                    com.$D.addClass(page, ["ps-page", "ps-v-page"]);
                });
            }

            // 绑定滚动事件
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

            //绑定键盘事件
            if(psThis.options.keyboard) {
                com.$E.addEvent(document, "keydown", function(event) {
                    var keyCode = event.keyCode;
                    if(keyCode == 37 || keyCode == 38) {
                        psThis.movePageUp();
                    }else if(keyCode == 39 || keyCode == 40) {
                        psThis.movePageDown();
                    }
                });
            }

            // 绑定窗口变动事件
            com.$E.addEvent(window, "resize", function() {
                psThis.scrollPage();
            });
        },
        "movePageUp": function() {
            var opts = this.options,
                pages = this.pages,
                flag = (this.pageIndex > 0 || opts.loop);

            if (this.pageIndex) {
                this.pageIndex--;
            } else if(opts.loop) {
                this.pageIndex = pages.length - 1;
            }

            // 是否循环
            flag ? this.scrollPage() : com.$O.noop();
        },
        "movePageDown": function() {
            var opts = this.options,
                pages = this.pages,
                flag = (this.pageIndex < pages.length - 1 || opts.loop);

            if (this.pageIndex < pages.length - 1) {
                this.pageIndex++;
            } else if(opts.loop) {
                this.pageIndex = 0;
            }

            flag ? this.scrollPage() : com.$O.noop();
        },
        "scrollPage": function() {
            var rect = com.$D.getRect(this.pages[this.pageIndex]);
            if (!rect) {
                return;
            }
            this.initEffects(rect);
        },
        "initEffects": function(rect) {
            var psThis = this;
            psThis.canScroll = false;
            var opts = psThis.options,
                container = psThis.container,
                traslate = "";

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
                if (psThis.pageIndex == index) {
                    com.$D.addClass(page, "ps-active");
                } else {
                    com.$D.removeClass(page, "ps-active");
                }
            });

            com.$E.addEvent(container, "transitionend", function() {
                psThis.canScroll = true;
                opts.pageSwitchComplete(psThis.pageIndex);
            });

            // 分页切换
            if (psThis.paging) {
                com.$A.forEach(psThis.paging.childNodes, function(paging, index) {
                    if (psThis.pageIndex == index) {
                        com.$D.addClass(paging, "paging-active");
                    } else {
                        com.$D.removeClass(paging, "paging-active");
                    }
                });
            }
        }
    };

}(window));