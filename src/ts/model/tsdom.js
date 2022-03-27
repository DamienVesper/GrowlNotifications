"use strict";
exports.__esModule = true;
var TsDom = /** @class */ (function () {
    /**
     * Initialize selector
     *
     * @param {any | string} selector
     * @param {HTMLElement | Document} context
     */
    function TsDom(selector, context) {
        // Nodes collection array
        this.nodes = [];
        /**
         * Pseudo selector for current node
         *
         * @type {string}
         */
        this.pseudoSelector = '';
        this.callbacks = {};
        if (!context) {
            context = document;
        }
        if (typeof selector === 'string') {
            if (selector[0] === '<' && selector[selector.length - 1] === ">") {
                this.nodes = [TsDom.createNode(selector)];
            }
            else {
                if (selector.search(/(:before|:after)$/gi) !== -1) {
                    var found = selector.match(/(:before|:after)$/gi);
                    selector = selector.split(found[0])[0];
                    this.pseudoSelector = found[0];
                }
                // Query DOM
                this.nodes = [].slice.call(context.querySelectorAll(selector));
            }
        }
        else if (selector instanceof NodeList) {
            this.nodes = selector.length > 1 ? [].slice.call(selector) : [selector];
        }
        else if (selector instanceof HTMLDocument || selector instanceof Window || selector instanceof HTMLElement) {
            this.nodes = [selector];
        }
    }
    TsDom.select = function (selector, context) {
        return new TsDom(selector, context);
    };
    TsDom.create = function (nodeName) {
        return new TsDom(TsDom.createNode(nodeName));
    };
    TsDom.prototype.attr = function (attrName, attrValue) {
        if (attrValue != undefined) {
            this.each(this.nodes, function (node) {
                node.setAttribute(attrName, attrValue);
            });
            return this;
        }
        return this.getLastNode().getAttribute(attrName);
    };
    /**
     * Append content to nodes
     *
     * @param {HTMLElement} content
     */
    TsDom.prototype.append = function (content) {
        var element;
        if (content instanceof TsDom) {
            element = content.get();
        }
        else {
            element = content;
        }
        this.each(this.nodes, function (node) {
            node.appendChild(element);
        });
        return this;
    };
    TsDom.prototype.parent = function () {
        return new TsDom(this.getLastNode().parentNode);
    };
    /**
     * Iteration per elements
     *
     * @param {HTMLElement[]} nodes
     * @param {Function} callback
     * @returns {TsDom}
     */
    TsDom.prototype.each = function (nodes, callback) {
        if (nodes instanceof Function) {
            callback = nodes;
            nodes = this.nodes;
        }
        for (var i = 0; i < nodes.length; i++) {
            callback.call(this.nodes[i], this.nodes[i], i);
        }
        return this;
    };
    TsDom.prototype.hasClass = function (className) {
        return this.getLastNode().classList.contains(className);
    };
    /**
     * Add css classes to element
     *
     * @param {string} className
     * @returns {TsDom}
     */
    TsDom.prototype.addClass = function (className) {
        if (className) {
            var cssClasses_1 = className.split(' ');
            this.each(this.nodes, function (node) {
                for (var classIndex in cssClasses_1) {
                    node.classList.add(cssClasses_1[classIndex]);
                }
            });
        }
        return this;
    };
    /**
     * Remove css classes from element
     *
     * @param {string} className
     * @returns {TsDom}
     */
    TsDom.prototype.removeClass = function (className) {
        var cssClasses = className.split(' ');
        this.each(this.nodes, function (node) {
            for (var classIndex in cssClasses) {
                node.classList.remove(cssClasses[classIndex]);
            }
        });
        return this;
    };
    TsDom.prototype.find = function (selector) {
        return new TsDom(selector, this.getLastNode());
    };
    TsDom.prototype.trigger = function (eventName, detail) {
        var event = new CustomEvent(eventName, {
            detail: detail
        });
        this.each(this.nodes, function (node) {
            node.dispatchEvent(event);
        });
        return this;
    };
    TsDom.prototype.text = function (text) {
        this.each(this.nodes, function (node) {
            node.innerText = text;
        });
        return this;
    };
    /**
     * Set ot Get css property from element
     *
     * @param styleName
     * @param value
     * @returns {any}
     */
    TsDom.prototype.css = function (styleName, value) {
        if (typeof value == 'undefined') {
            var node = this.getLastNode();
            var result = null;
            styleName = TsDom.convertToJsProperty(styleName);
            if ((typeof node.getBoundingClientRect === "function") && !this.pseudoSelector) {
                result = node.getBoundingClientRect()[styleName];
            }
            if (!result) {
                var value_1 = getComputedStyle(node, this.pseudoSelector)[styleName];
                if (value_1.search('px')) {
                    result = parseInt(value_1, 10);
                }
            }
            if (isNaN(result)) {
                throw 'Undefined css property: ' + styleName;
            }
            return result;
        }
        else {
            if (Number.isInteger(value)) {
                value = value + 'px';
            }
            if (this.nodes.length > 1) {
                this.each(this.nodes, function (node) {
                    node.style[styleName] = value;
                });
            }
            else {
                this.nodes[0].style[styleName] = value;
            }
        }
        return this;
    };
    /**
     * Add event listener to element
     *
     * @param {string} eventName
     * @param {Function} callback
     * @returns {TsDom}
     */
    TsDom.prototype.on = function (eventName, callback) {
        var _this = this;
        this.each(this.nodes, function (node) {
            var callbackFn = function (e) {
                callback.call(node, e);
            };
            _this.callbacks[eventName] = callbackFn;
            node.addEventListener(eventName, callbackFn);
        });
        return this;
    };
    TsDom.prototype.off = function (eventName) {
        var callbackFn = this.callbacks[eventName];
        this.each(this.nodes, function (node) {
            node.removeEventListener(eventName, callbackFn, false);
        });
        return this;
    };
    TsDom.prototype.val = function (value) {
        if (typeof value === 'undefined') {
            return this.getLastNode().value;
        }
        this.each(this.nodes, function (node) {
            node.value = value;
        });
        return this;
    };
    /**
     * Check node type
     *
     * @param {string} tagName
     * @returns {boolean}
     */
    TsDom.prototype.is = function (tagName) {
        return this.getLastNode().tagName.toLowerCase() === tagName;
    };
    TsDom.prototype.get = function (index) {
        if (index === void 0) { index = 0; }
        return this.nodes[index];
    };
    TsDom.prototype.length = function () {
        return this.nodes.length;
    };
    TsDom.prototype.hide = function () {
        this.each(this.nodes, function (node) {
            TsDom.select(node).css('display', 'none');
        });
        return this;
    };
    TsDom.prototype.show = function () {
        this.each(this.nodes, function (node) {
            TsDom.select(node).css('display', '');
        });
        return this;
    };
    TsDom.prototype.empty = function () {
        this.each(this.nodes, function (node) {
            TsDom.select(node).get().innerHTML = '';
        });
        return this;
    };
    TsDom.prototype.html = function (content) {
        this.each(this.nodes, function (node) {
            node.innerHTML = content;
        });
    };
    TsDom.prototype.remove = function () {
        this.each(this.nodes, function (node) {
            node.remove();
        });
    };
    TsDom.prototype.insertBefore = function (data) {
        var element = this.resolveElement(data);
        this.each(this.nodes, function (node) {
            node.parentNode.insertBefore(element, element.previousSibling);
        });
        return this;
    };
    TsDom.prototype.insertAfter = function (contents) {
        var element = this.resolveElement(contents);
        this.each(this.nodes, function (node) {
            node.parentNode.insertBefore(element, node.nextSibling);
        });
        return this;
    };
    TsDom.prototype.resolveElement = function (contents) {
        var element;
        if (TsDom.isHtml(contents)) {
            element = TsDom.createNode(contents);
        }
        else if (contents instanceof HTMLElement) {
            element = contents;
        }
        else if (contents instanceof TsDom) {
            element = contents.get();
        }
        return element;
    };
    TsDom.prototype.closest = function (selector) {
        return TsDom.select(this.getLastNode().closest(selector));
    };
    TsDom.prototype.data = function (dataName) {
        return this.attr('data-' + dataName);
    };
    TsDom.prototype.width = function (value) {
        if (value !== undefined) {
            this.css('width', value);
            return this;
        }
        if (this.getLastNode() === window) {
            return parseInt(this.getLastNode().innerWidth, 10);
        }
        return parseInt(this.css('width'), 10);
    };
    TsDom.prototype.height = function (value) {
        if (value !== undefined) {
            this.css('height', value);
            return this;
        }
        if (this.getLastNode() === window) {
            return parseInt(this.getLastNode().innerHeight, 10);
        }
        return parseInt(this.css('height'), 10);
    };
    TsDom.prototype.position = function () {
        return {
            top: Number(this.getLastNode().getBoundingClientRect().top),
            bottom: Number(this.getLastNode().getBoundingClientRect().bottom),
            left: Number(this.getLastNode().getBoundingClientRect().left),
            right: Number(this.getLastNode().getBoundingClientRect().right)
        };
    };
    TsDom.prototype.offset = function () {
        return {
            top: Number(this.getLastNode().offsetTop),
            left: Number(this.getLastNode().offsetLeft)
        };
    };
    TsDom.createNode = function (nodeName) {
        if (nodeName[0] === '<' && nodeName[nodeName.length - 1] === ">") {
            var element = document.createElement('div');
            element.innerHTML = nodeName;
            return element.firstChild;
        }
        else {
            return document.createElement(nodeName);
        }
    };
    TsDom.isHtml = function (text) {
        return text[0] === '<' && text[text.length - 1] === ">";
    };
    /**
     * Make css property notation to javascript property notation
     *
     * @param {string} propertyName
     * @returns {string}
     */
    TsDom.convertToJsProperty = function (propertyName) {
        propertyName = propertyName.toLowerCase().replace('-', ' ');
        propertyName = propertyName.replace(/(^| )(\w)/g, function (x) {
            return x.toUpperCase();
        });
        propertyName = propertyName.charAt(0).toLowerCase() + propertyName.slice(1);
        return propertyName.replace(' ', '');
    };
    /**
     *
     * @returns {any}
     */
    TsDom.prototype.getLastNode = function () {
        return this.nodes[this.nodes.length - 1];
    };
    return TsDom;
}());
exports["default"] = TsDom;
