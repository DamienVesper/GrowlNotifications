"use strict";
exports.__esModule = true;
var tsdom_1 = require("../model/tsdom");
var TopCenterPosition = /** @class */ (function () {
    function TopCenterPosition(notification, margin) {
        this.notification = notification;
        this.margin = margin;
    }
    TopCenterPosition.prototype.calculate = function () {
        var _this = this;
        var offset = this.margin, notifications = tsdom_1["default"].select('.growl-notification.position-' + TopCenterPosition.position);
        notifications.each(function (el) {
            var element = tsdom_1["default"].select(el);
            element
                .css('top', offset)
                .css('left', 'calc(50% - ' + (Math.ceil(element.width() / 2)) + 'px)');
            offset += element.height() + _this.margin;
        });
    };
    TopCenterPosition.prototype.instances = function () {
        var result = [], notifications = tsdom_1["default"].select('.growl-notification.position-' + TopCenterPosition.position);
        notifications.each(function (notification) {
            result.push(tsdom_1["default"].select(notification));
        });
        return result;
    };
    TopCenterPosition.position = 'top-center';
    return TopCenterPosition;
}());
exports.TopCenterPosition = TopCenterPosition;
