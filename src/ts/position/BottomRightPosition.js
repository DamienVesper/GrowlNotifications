"use strict";
exports.__esModule = true;
var tsdom_1 = require("../model/tsdom");
var BottomRightPosition = /** @class */ (function () {
    function BottomRightPosition(notification, margin) {
        this.notification = notification;
        this.margin = margin;
    }
    BottomRightPosition.prototype.calculate = function () {
        var _this = this;
        var offset = this.margin, notifications = tsdom_1["default"].select('.growl-notification.position-' + BottomRightPosition.position);
        notifications.each(function (el) {
            var element = tsdom_1["default"].select(el);
            element
                .css('bottom', offset)
                .css('right', _this.margin);
            offset += element.height() + _this.margin;
        });
    };
    BottomRightPosition.prototype.instances = function () {
        var result = [], notifications = tsdom_1["default"].select('.growl-notification.position-' + BottomRightPosition.position);
        notifications.each(function (notification) {
            result.push(tsdom_1["default"].select(notification));
        });
        return result;
    };
    BottomRightPosition.position = 'bottom-right';
    return BottomRightPosition;
}());
exports.BottomRightPosition = BottomRightPosition;
