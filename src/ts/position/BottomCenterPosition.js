"use strict";
exports.__esModule = true;
var tsdom_1 = require("../model/tsdom");
var BottomCenterPosition = /** @class */ (function () {
    function BottomCenterPosition(notification, margin) {
        this.notification = notification;
        this.margin = margin;
    }
    BottomCenterPosition.prototype.calculate = function () {
        var _this = this;
        var offset = this.margin, notifications = tsdom_1["default"].select('.growl-notification.position-' + BottomCenterPosition.position);
        notifications.each(function (el) {
            var element = tsdom_1["default"].select(el);
            element
                .css('bottom', offset)
                .css('left', 'calc(50% - ' + (Math.ceil(element.width() / 2)) + 'px)');
            offset += element.height() + _this.margin;
        });
    };
    BottomCenterPosition.prototype.instances = function () {
        var result = [], notifications = tsdom_1["default"].select('.growl-notification.position-' + BottomCenterPosition.position);
        notifications.each(function (notification) {
            result.push(tsdom_1["default"].select(notification));
        });
        return result;
    };
    BottomCenterPosition.position = 'bottom-center';
    return BottomCenterPosition;
}());
exports.BottomCenterPosition = BottomCenterPosition;
