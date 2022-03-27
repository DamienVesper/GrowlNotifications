"use strict";
exports.__esModule = true;
var tsdom_1 = require("../model/tsdom");
var TopRightPosition = /** @class */ (function () {
    function TopRightPosition(notification, margin) {
        this.notification = notification;
        this.margin = margin;
    }
    TopRightPosition.prototype.calculate = function () {
        var _this = this;
        var offset = this.margin, notifications = tsdom_1["default"].select('.growl-notification.position-' + TopRightPosition.position);
        notifications.each(function (el) {
            tsdom_1["default"].select(el)
                .css('top', offset)
                .css('right', _this.margin);
            offset += tsdom_1["default"].select(el).height() + _this.margin;
        });
    };
    TopRightPosition.prototype.instances = function () {
        var result = [], notifications = tsdom_1["default"].select('.growl-notification.position-' + TopRightPosition.position);
        notifications.each(function (notification) {
            result.push(tsdom_1["default"].select(notification));
        });
        return result;
    };
    TopRightPosition.position = 'top-right';
    return TopRightPosition;
}());
exports.TopRightPosition = TopRightPosition;
