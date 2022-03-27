"use strict";
exports.__esModule = true;
var TopRightPosition_1 = require("./TopRightPosition");
var TopCenterPosition_1 = require("./TopCenterPosition");
var BottomRightPosition_1 = require("./BottomRightPosition");
var TopLeftPosition_1 = require("./TopLeftPosition");
var BottomCenterPosition_1 = require("./BottomCenterPosition");
var BottomLeftPosition_1 = require("./BottomLeftPosition");
var PositionFactory = /** @class */ (function () {
    function PositionFactory() {
    }
    PositionFactory.newInstance = function (position, notification, margin) {
        var positionClass = null;
        if (position === TopRightPosition_1.TopRightPosition.position) {
            positionClass = TopRightPosition_1.TopRightPosition;
        }
        else if (position === TopCenterPosition_1.TopCenterPosition.position) {
            positionClass = TopCenterPosition_1.TopCenterPosition;
        }
        else if (position === BottomRightPosition_1.BottomRightPosition.position) {
            positionClass = BottomRightPosition_1.BottomRightPosition;
        }
        else if (position === TopLeftPosition_1.TopLeftPosition.position) {
            positionClass = TopLeftPosition_1.TopLeftPosition;
        }
        else if (position === BottomCenterPosition_1.BottomCenterPosition.position) {
            positionClass = BottomCenterPosition_1.BottomCenterPosition;
        }
        else if (position === BottomLeftPosition_1.BottomLeftPosition.position) {
            positionClass = BottomLeftPosition_1.BottomLeftPosition;
        }
        return new positionClass(notification, margin);
    };
    return PositionFactory;
}());
exports.PositionFactory = PositionFactory;
