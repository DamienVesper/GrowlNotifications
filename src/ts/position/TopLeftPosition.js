"use strict";
exports.__esModule = true;
var tsdom_1 = require("../model/tsdom");
var TopLeftPosition = /** @class */ (function () {
    function TopLeftPosition(notification, margin) {
        this.notification = notification;
        this.margin = margin;
    }
    TopLeftPosition.prototype.calculate = function () {
        var _this = this;
        var offset = this.margin;
        var notifications = tsdom_1["default"].select('.growl-notification.position-' + TopLeftPosition.position);
        notifications.each(function (el) {
            var element = tsdom_1["default"].select(el);
            element
                .css('top', offset)
                .css('left', _this.margin);
            offset += element.height() + _this.margin;
        });
    };
    TopLeftPosition.prototype.instances = function () {
        var result = [], notifications = tsdom_1["default"].select('.growl-notification.position-' + TopLeftPosition.position);
        notifications.each(function (notification) {
            result.push(tsdom_1["default"].select(notification));
        });
        return result;
    };
    TopLeftPosition.position = 'top-left';
    return TopLeftPosition;
}());
exports.TopLeftPosition = TopLeftPosition;
