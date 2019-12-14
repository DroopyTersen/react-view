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
const index_1 = require("../index");
const utils_1 = require("../utils");
const getTooltip = (description, type, name) => (React.createElement("div", { style: {
        backgroundColor: 'white',
        border: '1px solid #CCC',
        padding: '8px',
        borderRadius: '5px',
        fontFamily: "'Helvetica Neue', Arial",
        fontSize: '14px',
    } },
    React.createElement("b", null, name),
    ": ",
    React.createElement("i", null, type),
    React.createElement("br", null),
    React.createElement("br", null),
    description));
const Spacing = ({ children, name, }) => {
    return (React.createElement("div", { "data-testid": `rv-knob-${name}`, style: {
            margin: '10px 0px',
            fontFamily: "'Helvetica Neue', Arial",
            fontSize: '14px',
        } }, children));
};
const Label = ({ children, tooltip }) => {
    const [hoverRef, isHover] = utils_1.useHover();
    return (React.createElement(react_tiny_popover_1.default, { isOpen: Boolean(isHover), position: 'top', content: React.createElement("div", null, tooltip) },
        React.createElement("label", { ref: hoverRef, style: {
                fontWeight: 500,
                lineHeight: '20px',
            } },
            children,
            " ",
            React.createElement("span", { style: { fontSize: '12px', fontWeight: 400 } }, "[?]"))));
};
const BooleanKnob = ({ tooltip, name, val, globalSet }) => {
    const [hoverRef, isHover] = utils_1.useHover();
    return (React.createElement(react_tiny_popover_1.default, { isOpen: Boolean(isHover), position: 'top', content: React.createElement("div", null, tooltip) },
        React.createElement("div", { ref: hoverRef, style: {
                display: 'flex',
                alignItems: 'center',
                fontWeight: 500,
            } },
            React.createElement("input", { id: name, type: "checkbox", style: { marginRight: '8px', marginLeft: '0px' }, checked: Boolean(val), onChange: () => {
                    globalSet(!val);
                } }),
            React.createElement("label", { htmlFor: name },
                name,
                " ",
                React.createElement("span", { style: { fontSize: '12px', fontWeight: 400 } }, "[?]")))));
};
const Knob = ({ name, error, type, val: globalVal, set: globalSet, options = {}, description, placeholder, enumName, }) => {
    const [val] = index_1.useValueDebounce(globalVal, globalSet);
    switch (type) {
        case index_1.PropTypes.Ref:
            return (React.createElement(Spacing, null,
                React.createElement(Label, { tooltip: getTooltip(description, type, name) }, name),
                React.createElement("a", { href: "https://reactjs.org/docs/refs-and-the-dom.html", target: "_blank", rel: "noopener noreferrer", style: {
                        fontSize: '14px',
                        display: 'block',
                    } }, "React Ref documentation"),
                React.createElement(index_1.Error, { msg: error, isPopup: true })));
        case index_1.PropTypes.Boolean:
            return (React.createElement(Spacing, null,
                React.createElement(BooleanKnob, { tooltip: getTooltip(description, type, name), val: Boolean(val), globalSet: globalSet, name: name }),
                React.createElement(index_1.Error, { msg: error, isPopup: true })));
        case index_1.PropTypes.Enum:
            const optionsKeys = Object.keys(options);
            const numberOfOptions = optionsKeys.length;
            return (React.createElement(Spacing, null,
                React.createElement(Label, { tooltip: getTooltip(description, type, name) }, name),
                numberOfOptions < 7 ? (React.createElement("div", { style: { display: 'flex', flexWrap: 'wrap' } }, Object.keys(options).map(opt => (React.createElement("div", { style: {
                        marginRight: '16px',
                        marginBottom: '8px',
                        display: 'flex',
                        alignItems: 'center',
                    }, key: opt },
                    React.createElement("input", { style: { marginRight: '8px', marginLeft: '0px' }, type: "radio", checked: `${enumName || name.toUpperCase()}.${opt}` === val, key: opt, id: `${name}_${opt}`, value: `${enumName || name.toUpperCase()}.${opt}`, name: `radio_${name}`, onChange: e => globalSet(e.target.value) }),
                    React.createElement("label", { htmlFor: `${name}_${opt}` }, opt)))))) : (React.createElement("select", { onChange: e => globalSet(e.target.value), value: String(val), name: name, style: {
                        display: 'block',
                        padding: '8.5px 10px',
                        MozAppearance: 'none',
                        WebkitAppearance: 'none',
                        appearance: 'none',
                        width: '100%',
                        border: '1px solid #CCC',
                        background: `url(data:image/svg+xml;base64,PHN2ZyBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0Ljk1IDEwIj48ZGVmcz48c3R5bGU+LmNscy0ye2ZpbGw6IzQ0NDt9PC9zdHlsZT48L2RlZnM+PHRpdGxlPmFycm93czwvdGl0bGU+PHBvbHlnb24gY2xhc3M9ImNscy0yIiBwb2ludHM9IjEuNDEgNC42NyAyLjQ4IDMuMTggMy41NCA0LjY3IDEuNDEgNC42NyIvPjxwb2x5Z29uIGNsYXNzPSJjbHMtMiIgcG9pbnRzPSIzLjU0IDUuMzMgMi40OCA2LjgyIDEuNDEgNS4zMyAzLjU0IDUuMzMiLz48L3N2Zz4=) no-repeat 95% 50%`,
                        fontSize: '14px',
                        borderRadius: '5px',
                    } }, Object.keys(options).map(opt => (React.createElement("option", { key: `${name}_${opt}`, value: `${enumName || name.toUpperCase()}.${opt}` }, opt))))),
                React.createElement(index_1.Error, { msg: error, isPopup: true })));
        case index_1.PropTypes.ReactNode:
        case index_1.PropTypes.Function:
        case index_1.PropTypes.Array:
        case index_1.PropTypes.Object:
        case index_1.PropTypes.String:
        case index_1.PropTypes.Date:
        case index_1.PropTypes.Number:
            return (React.createElement(Spacing, { name: name },
                React.createElement(Label, { tooltip: getTooltip(description, type, name) }, name),
                React.createElement(index_1.Editor, { onChange: code => {
                        globalSet(code);
                    }, code: val ? String(val) : '', placeholder: placeholder, small: true }),
                React.createElement(index_1.Error, { msg: error, isPopup: true })));
        default:
            return null;
    }
};
exports.default = Knob;
//# sourceMappingURL=knob.js.map