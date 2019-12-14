/*
Copyright (c) 2019 Uber Technologies, Inc.

This source code is licensed under the MIT license found in the
LICENSE file in the root directory of this source tree.
*/
import React from 'react';
import { transformFromAstSync } from '@babel/core';
//@ts-ignore
import presetReact from '@babel/preset-react';
import { parse } from '../ast';
const errorBoundary = (Element, errorCallback) => {
    class ErrorBoundary extends React.Component {
        componentDidCatch(error) {
            errorCallback(error);
        }
        render() {
            if (typeof Element === 'undefined')
                return null;
            return typeof Element === 'function' ? React.createElement(Element, null) : Element;
        }
    }
    return ErrorBoundary;
};
const evalCode = (ast, scope, presets) => {
    const transformedCode = transformFromAstSync(ast, undefined, {
        presets: presets ? [presetReact, ...presets] : [presetReact],
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
    return res(React, ...scopeValues);
};
const generateElement = (ast, scope, errorCallback, presets) => {
    return errorBoundary(evalCode(ast, scope, presets), errorCallback);
};
const transpile = (code, transformations, scope, setOutput, setError, presets) => {
    try {
        const ast = transformations.reduce((result, transformation) => transformation(result), parse(code));
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
    const [output, setOutput] = React.useState({ component: null });
    React.useEffect(() => {
        transpile(code, transformations, scope, setOutput, setError, presets);
    }, [code]);
    const Element = output.component;
    const Placeholder = placeholder;
    return (React.createElement("div", { style: {
            minHeight: `${minHeight || 0}px`,
            paddingTop: minHeight ? '16px' : 0,
            paddingBottom: minHeight ? '16px' : 0,
        } },
        React.createElement("div", { style: {
                display: 'flex',
                justifyContent: 'center',
                flexWrap: 'wrap',
            } }, Element ? (React.createElement(Element, null)) : Placeholder ? (React.createElement(Placeholder, { height: minHeight || 32 })) : null)));
};
export default React.memo(Compiler, (prevProps, nextProps) => prevProps.code === nextProps.code);
//# sourceMappingURL=compiler.js.map