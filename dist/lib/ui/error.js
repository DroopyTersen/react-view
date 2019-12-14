"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
Copyright (c) 2019 Uber Technologies, Inc.

This source code is licensed under the MIT license found in the
LICENSE file in the root directory of this source tree.
*/
const React = __importStar(require("react"));
const react_tiny_popover_1 = __importDefault(require("@miksu/react-tiny-popover"));
const utils_1 = require("../utils");
const PopupError = ({ enabled, children, }) => {
    if (!enabled)
        return React.createElement(React.Fragment, null, children);
    return (React.createElement(react_tiny_popover_1.default, { isOpen: enabled, position: 'bottom', content: React.createElement("div", null, children) },
        React.createElement("div", null)));
};
const Error = ({ msg, code, isPopup }) => {
    if (msg === null)
        return null;
    return (React.createElement(PopupError, { enabled: Boolean(isPopup) },
        React.createElement("div", { style: {
                borderRadius: '5px',
                backgroundColor: '#892C21',
                whiteSpace: 'pre',
                fontSize: '11px',
                fontFamily: `Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace`,
                color: '#FFF',
                padding: '16px',
                margin: `${isPopup ? 4 : 8}px 0px`,
                overflowX: 'scroll',
            } }, code ? utils_1.frameError(msg, code) : utils_1.formatBabelError(msg))));
};
exports.default = Error;
//# sourceMappingURL=error.js.map