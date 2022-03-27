"use strict";
require("../scss/themes/light/light-theme.scss");
var PositionFactory_1 = require("./position/PositionFactory");
var deepmerge = require("deepmerge");
var tsdom_1 = require("./model/tsdom");
var TopCenterPosition_1 = require("./position/TopCenterPosition");
var TopRightPosition_1 = require("./position/TopRightPosition");
var TopLeftPosition_1 = require("./position/TopLeftPosition");
var BottomCenterPosition_1 = require("./position/BottomCenterPosition");
var BottomLeftPosition_1 = require("./position/BottomLeftPosition");
var BottomRightPosition_1 = require("./position/BottomRightPosition");
var GrowlNotification = /** @class */ (function () {
    function GrowlNotification(options) {
        if (options === void 0) { options = {}; }
        this.options = deepmerge.all([GrowlNotification.defaultOptions, GrowlNotification.globalOptions, options]);
        // Disable animation duration if animation close set to 'none'
        if (!this.options.animation.close || this.options.animation.close == 'none') {
            this.options.animationDuration = 0;
        }
        this.notification = tsdom_1["default"].create('div');
        this.body = tsdom_1["default"].select('body');
        this.template = GrowlNotification.template;
        this.position = PositionFactory_1.PositionFactory.newInstance(this.options.position, this.notification, this.options.margin);
        GrowlNotification.instances.push(this);
    }
    Object.defineProperty(GrowlNotification, "defaultOptions", {
        get: function () {
            return {
                margin: 20,
                type: 'default',
                title: '',
                description: '',
                image: {
                    visible: false,
                    customImage: ''
                },
                closeTimeout: 0,
                closeWith: ['click', 'button'],
                animation: {
                    open: 'slide-in',
                    close: 'slide-out'
                },
                animationDuration: .2,
                position: 'top-right',
                showBorder: false,
                showButtons: false,
                buttons: {
                    action: {
                        text: 'Ok',
                        callback: function () { }
                    },
                    cancel: {
                        text: 'Cancel',
                        callback: function () { }
                    }
                },
                showProgress: false
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GrowlNotification, "template", {
        get: function () {
            return "<span class=\"growl-notification__close\">\n                  <span class=\"growl-notification__close-icon\"></span>\n                </span>\n                <div class=\"growl-notification__progress\">\n                    <div class=\"growl-notification__progress-bar\"></div>\n                </div>\n               <div class=\"growl-notification__body\">\n                 {{ image }}\n                 <div class=\"growl-notification__content\">\n                   <div class=\"growl-notification__title\">{{ title }}</div>\n                   <div class=\"growl-notification__desc\">{{ description }}</div>\n                 </div>\n                </div>\n                <div class=\"growl-notification__buttons\">\n                    <span class=\"growl-notification__button growl-notification__button--action\">Ok</span>\n                    <span class=\"growl-notification__button growl-notification__button--cancel\">Cancel</span>\n                </div>";
        },
        enumerable: true,
        configurable: true
    });
    GrowlNotification.notify = function (options) {
        if (options === void 0) { options = {}; }
        var newInstance = new GrowlNotification(options).show();
        var reduceHeight = 0;
        var removedNotifications = [];
        var instances = newInstance.position.instances();
        instances.forEach(function (instance) {
            if (GrowlNotification.hasOverflow(newInstance, reduceHeight)) {
                removedNotifications.push(instance);
                reduceHeight += instance.height() + newInstance.options.margin;
            }
        });
        removedNotifications.forEach(function (instance) {
            instance.remove();
        });
        newInstance.position.calculate();
        return newInstance;
    };
    GrowlNotification.hasOverflow = function (newInstance, reduceHeight) {
        if (reduceHeight === void 0) { reduceHeight = 0; }
        var result = false;
        var windowHeight = tsdom_1["default"].select(window).height();
        var offset = 0;
        if ((newInstance.position instanceof TopCenterPosition_1.TopCenterPosition) ||
            (newInstance.position instanceof TopRightPosition_1.TopRightPosition) ||
            (newInstance.position instanceof TopLeftPosition_1.TopLeftPosition)) {
            offset = (newInstance.getContent().offset().top + newInstance.getContent().height() + newInstance.options.margin) - reduceHeight;
            if (offset >= windowHeight) {
                result = true;
            }
        }
        else if ((newInstance.position instanceof BottomCenterPosition_1.BottomCenterPosition) ||
            (newInstance.position instanceof BottomRightPosition_1.BottomRightPosition) ||
            (newInstance.position instanceof BottomLeftPosition_1.BottomLeftPosition)) {
            offset = newInstance.getContent().offset().top + reduceHeight;
            if (offset <= 0) {
                result = true;
            }
        }
        return result;
    };
    GrowlNotification.closeAll = function () {
        GrowlNotification.instances = [];
        tsdom_1["default"].select('.growl-notification').each(function (growlNotification) {
            tsdom_1["default"].select(growlNotification).remove();
        });
    };
    GrowlNotification.prototype.show = function () {
        this.addNotification();
        this.initPosition();
        this.bindEvents();
        return this;
    };
    GrowlNotification.prototype.close = function () {
        var self = this;
        this.notification
            .removeClass('animation-' + this.options.animation.open)
            .addClass('animation-' + this.options.animation.close)
            .addClass('growl-notification--closed');
        setTimeout(function () {
            self.remove();
            self.position.calculate();
        }, this.options.animationDuration * 1000);
    };
    GrowlNotification.prototype.remove = function () {
        var index = GrowlNotification.instances.indexOf(this);
        GrowlNotification.instances.splice(index, 1);
        this.notification.remove();
        return this;
    };
    GrowlNotification.prototype.getContent = function () {
        return this.notification;
    };
    /**
    * Add notification to document
    */
    GrowlNotification.prototype.addNotification = function () {
        var options = this.options;
        var template = this.template.replace('{{ title }}', options.title);
        template = template.replace('{{ description }}', options.description);
        if (this.options.image.visible) {
            if (this.options.image.customImage) {
                template = template.replace('{{ image }}', '<div class="growl-notification__image growl-notification__image--custom"><img src="' + this.options.image.customImage + '" alt=""></div>');
            }
            else {
                template = template.replace('{{ image }}', '<div class="growl-notification__image"></div>');
            }
        }
        else {
            template = template.replace('{{ image }}', '');
        }
        this.notification
            .addClass('growl-notification')
            .addClass('growl-notification--' + options.type)
            .addClass('animation-' + options.animation.open)
            .addClass('position-' + options.position);
        if (options.image) {
            this.notification.addClass('growl-notification--image');
        }
        this.notification.html(template);
        if (!options.title) {
            this.notification.find('.growl-notification__title').remove();
        }
        if (options.width) {
            this.notification.width(options.width);
        }
        if (options.zIndex) {
            this.notification.css('z-index', options.zIndex);
        }
        if (options.showProgress && (options.closeTimeout > 0)) {
            this.notification
                .find('.growl-notification__progress')
                .addClass('is-visible');
            this.notification.addClass('has-progress');
        }
        if (options.showButtons) {
            this.notification.find('.growl-notification__buttons').addClass('is-visible');
            this.notification.find('.growl-notification__button--action').text(options.buttons.action.text);
            this.notification.find('.growl-notification__button--cancel').text(options.buttons.cancel.text);
        }
        this.body.append(this.notification);
        if (options.showProgress && (options.closeTimeout > 0)) {
            this.calculateProgress();
        }
    };
    /**
    * Calculate and set notification positions
    */
    GrowlNotification.prototype.initPosition = function () {
        this.position.calculate();
    };
    GrowlNotification.prototype.calculateProgress = function () {
        var _this = this;
        var intervalAmount = Math.ceil(Number(this.options.closeTimeout) / 100), width = 1, interval = setInterval(function () {
            if (width >= 100) {
                clearInterval(interval);
            }
            else {
                _this.notification
                    .find('.growl-notification__progress-bar')
                    .css('width', width + '%');
                width++;
            }
        }, intervalAmount);
    };
    GrowlNotification.prototype.bindEvents = function () {
        var self = this;
        if (this.options.closeWith.indexOf('click') > -1) {
            this.notification
                .addClass('growl-notification--close-on-click')
                .on('click', function () { return self.close(); });
        }
        else if (this.options.closeWith.indexOf('button') > -1) {
            var closeBtn = this.notification.find('.growl-notification__close');
            closeBtn.on('click', function () { return self.close(); });
        }
        if (this.options.showButtons) {
            var actionBtn = this.notification.find('.growl-notification__button--action');
            actionBtn.on('click', function (e) {
                self.options.buttons.action.callback.apply(self);
                self.close();
                e.stopPropagation();
            });
            var cancelBtn = this.notification.find('.growl-notification__button--cancel');
            cancelBtn.on('click', function (e) {
                self.options.buttons.cancel.callback.apply(self);
                self.close();
                e.stopPropagation();
            });
        }
        if (this.options.closeTimeout && (this.options.closeTimeout > 0)) {
            setTimeout(function () { return self.close(); }, this.options.closeTimeout);
        }
    };
    GrowlNotification.setGlobalOptions = function (options) {
        GrowlNotification.globalOptions = options;
    };
    GrowlNotification.globalOptions = {};
    GrowlNotification.instances = [];
    return GrowlNotification;
}());
module.exports = GrowlNotification;
