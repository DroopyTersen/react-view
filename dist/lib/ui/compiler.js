"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
Copyright (c) 2019 Uber Technologies, Inc.

This source code is licensed under the MIT license found in the
LICENSE file in the root directory of this source tree.
*/
const react_1 = __importDefault(require("react"));
const core_1 = require("@babel/core");
//@ts-ignore
const preset_react_1 = __importDefault(require("@babel/preset-react"));
const ast_1 = require("../ast");
const errorBoundary = (Element, errorCallback) => {
    class ErrorBoundary extends react_1.default.Component {
        componentDidCatch(error) {
            errorCallback(error);
        }
        render() {
            if (typeof Element === 'undefined')
                return null;
            return typeof Element === 'function' ? react_1.default.createElement(Element, null) : Element;
        }
    }
    return ErrorBoundary;
};
const evalCode = (ast, scope, presets) => {
    const transformedCode = core_1.transformFromAstSync(ast, undefined, {
        presets: presets ? [preset_react_1.default, ...presets] : [preset_react_1.default],
        inputSourceMap: false,
        sourceMaps: false,
        // TS preset needs this and it doesn't seem to matter when TS preset
        // is not used, so let's keep it here?
        filename: 'file.tsx',
    });
    const resultCode = transformedCode ? transformedCode.code : '';
    const scopeKeys = Object.keys(scope);
    const scopeValues = Object.values(scope);
    //@ts-ignore
    const res = new Function('React', ...scopeKeys, `return ${resultCode}`);
    return res(react_1.default, ...scopeValues);
};
const generateElement = (ast, scope, errorCallback, presets) => {
    return errorBoundary(evalCode(ast, scope, presets), errorCallback);
};
const transpile = (code, transformations, scope, setOutput, setError, presets) => {
    try {
        const ast = transformations.reduce((result, transformation) => transformation(result), ast_1.parse(code));
        const component = generateElement(ast, scope, (error) => {
            setError(error.toString());
        }, presets);
        setOutput({ component });
        setError(null);
    }
    catch (error) {
        setError(error.toString());
    }
};
const Compiler = ({ scope, code, setError, transformations, placeholder, minHeight, presets, }) => {
    const [output, setOutput] = react_1.default.useState({ component: null });
    react_1.default.useEffect(() => {
        transpile(code, transformations, scope, setOutput, setError, presets);
    }, [code]);
    const Element = output.component;
    const Placeholder = placeholder;
    return (react_1.default.createElement("div", { style: {
            minHeight: `${minHeight || 0}px`,
            paddingTop: minHeight ? '16px' : 0,
            paddingBottom: minHeight ? '16px' : 0,
        } },
        react_1.default.createElement("div", { style: {
                display: 'flex',
                justifyContent: 'center',
                flexWrap: 'wrap',
            } }, Element ? (react_1.default.createElement(Element, null)) : Placeholder ? (react_1.default.createElement(Placeholder, { height: minHeight || 32 })) : null)));
};
exports.default = react_1.default.memo(Compiler, (prevProps, nextProps) => prevProps.code === nextProps.code);
//# sourceMappingURL=compiler.js.map