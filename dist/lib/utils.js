"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
Copyright (c) 2019 Uber Technologies, Inc.

This source code is licensed under the MIT license found in the
LICENSE file in the root directory of this source tree.
*/
const React = __importStar(require("react"));
const code_frame_1 = require("@babel/code-frame");
function assertUnreachable() {
    throw new Error("Didn't expect to get here");
}
exports.assertUnreachable = assertUnreachable;
exports.formatBabelError = (error) => {
    const isTemplate = error.includes('/* @babel/template */');
    return error
        .replace('1 | /* @babel/template */;', '')
        .replace(/\((\d+):(\d+)\)/, (_, line, col) => `(${parseInt(line, 10) - (isTemplate ? 1 : 0)}:${col})`)
        .replace('<>', '')
        .replace('</>', '')
        .replace(/(\d+) \|/g, (_, line) => {
        const lineNum = parseInt(line, 10);
        const newLineNum = lineNum - 1;
        const lenDiff = line.length - `${newLineNum}`.length;
        return `${' '.repeat(lenDiff)}${newLineNum} |`;
    });
};
exports.frameError = (error, code) => {
    if (error) {
        const found = error.match(/\((\d+)\:(\d+)\)$/);
        if (found) {
            const location = {
                start: { line: parseInt(found[1], 10), column: parseInt(found[2], 10) },
            };
            return `${error}\n\n${code_frame_1.codeFrameColumns(code, location)}`;
        }
    }
    return error;
};
exports.buildPropsObj = (stateProps, updatedPropValues) => {
    const newProps = {};
    Object.keys(stateProps).forEach(name => {
        newProps[name] = Object.assign({}, stateProps[name]);
    });
    Object.keys(updatedPropValues).forEach(name => {
        newProps[name] = {
            value: typeof updatedPropValues[name] !== 'undefined'
                ? updatedPropValues[name]
                : stateProps[name].defaultValue,
            type: stateProps[name].type,
            options: stateProps[name].options,
            enumName: stateProps[name].enumName,
            description: stateProps[name].description,
            placeholder: stateProps[name].placeholder,
            hidden: stateProps[name].hidden,
            custom: stateProps[name].custom,
            stateful: stateProps[name].stateful,
            propHook: stateProps[name].propHook,
            imports: stateProps[name].imports,
            defaultValue: stateProps[name].defaultValue,
        };
    });
    return newProps;
};
// creates a duplicate internal state, so we can preserve instant value editing
// while debouncing top-level state updates that are slow
function useValueDebounce(globalVal, globalSet, shouldSkip = false) {
    const [val, set] = React.useState(globalVal);
    React.useEffect(() => {
        // begins a countdown when 'val' changes. if it changes before countdown
        // ends, clear the timeout avoids lodash debounce to avoid stale
        // values in globalSet.
        if (val !== globalVal) {
            const timeout = setTimeout(() => globalSet(val), 250);
            return () => clearTimeout(timeout);
        }
        return void 0;
    }, [val]);
    React.useEffect(() => {
        if (!shouldSkip)
            set(globalVal);
    }, [globalVal]);
    return [val, set];
}
exports.useValueDebounce = useValueDebounce;
function useHover() {
    const [value, setValue] = React.useState(false);
    const ref = React.useRef(null);
    const handleMouseOver = () => setValue(true);
    const handleMouseOut = () => setValue(false);
    React.useEffect(() => {
        const node = ref.current;
        if (node) {
            node.addEventListener('mouseover', handleMouseOver);
            node.addEventListener('mouseout', handleMouseOut);
            return () => {
                node.removeEventListener('mouseover', handleMouseOver);
                node.removeEventListener('mouseout', handleMouseOut);
            };
        }
        return undefined;
    }, [ref.current]);
    return [ref, value];
}
exports.useHover = useHover;
function clone(obj) {
    if (typeof obj == 'function') {
        return obj;
    }
    const result = Array.isArray(obj) ? [] : {};
    for (const key in obj) {
        const value = obj[key];
        const type = {}.toString.call(value).slice(8, -1);
        if (type == 'Array' || type == 'Object') {
            result[key] = clone(value);
        }
        else {
            result[key] = value;
        }
    }
    return result;
}
exports.clone = clone;
//# sourceMappingURL=utils.js.map