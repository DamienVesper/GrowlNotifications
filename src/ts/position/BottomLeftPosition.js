"use strict";
exports.__esModule = true;
var tsdom_1 = require("../model/tsdom");
var BottomLeftPosition = /** @class */ (function () {
    function BottomLeftPosition(notification, margin) {
        this.notification = notification;
        this.margin = margin;
    }
    BottomLeftPosition.prototype.calculate = function () {
        var _this = this;
        var offset = this.margin, notifications = tsdom_1["default"].select('.growl-notification.position-' + BottomLeftPosition.position);
        notifications.each(function (el) {
            var element = tsdom_1["default"].select(el);
            element
                .css('bottom', offset)
                .css('left', _this.margin);
            offset += element.height() + _this.margin;
        });
    };
    BottomLeftPosition.prototype.instances = function () {
        var result = [], notifications = tsdom_1["default"].select('.growl-notification.position-' + BottomLeftPosition.position);
        notifications.each(function (notification) {
            result.push(tsdom_1["default"].select(notification));
        });
        return result;
    };
    BottomLeftPosition.position = 'bottom-left';
    return BottomLeftPosition;
}());
exports.BottomLeftPosition = BottomLeftPosition;
