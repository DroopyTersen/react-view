"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
Copyright (c) 2019 Uber Technologies, Inc.

This source code is licensed under the MIT license found in the
LICENSE file in the root directory of this source tree.
*/
const ast_1 = require("./ast");
const const_1 = require("./const");
exports.updateCode = (dispatch, newCode) => {
    dispatch({
        type: const_1.Action.UpdateCode,
        payload: newCode,
    });
};
exports.updateCodeAndProvider = (dispatch, newCode, providerValue) => {
    dispatch({
        type: const_1.Action.UpdateCodeAndProvider,
        payload: {
            code: newCode,
            providerValue,
        },
    });
};
exports.updateAll = (dispatch, newCode, componentName, propsConfig, parseProvider, customProps) => {
    const propValues = {};
    const { parsedProps, parsedProvider } = ast_1.parseCode(newCode, componentName, parseProvider);
    Object.keys(propsConfig).forEach(name => {
        propValues[name] = propsConfig[name].value;
        if (customProps && customProps[name] && customProps[name].parse) {
            // custom prop parser
            propValues[name] = customProps[name].parse(parsedProps[name], propsConfig);
        }
        else if (propsConfig[name].type === const_1.PropTypes.Date) {
            const match = parsedProps[name].match(/^new\s*Date\(\s*"([0-9-T:.Z]+)"\s*\)$/);
            if (match) {
                propValues[name] = match[1];
            }
            else {
                propValues[name] = parsedProps[name];
            }
        }
        else {
            propValues[name] = parsedProps[name];
        }
    });
    dispatch({
        type: const_1.Action.Update,
        payload: {
            code: newCode,
            updatedPropValues: propValues,
            providerValue: parsedProvider,
        },
    });
};
exports.updatePropsAndCodeNoRecompile = (dispatch, newCode, propName, propValue) => {
    dispatch({
        type: const_1.Action.UpdatePropsAndCodeNoRecompile,
        payload: {
            codeNoRecompile: newCode,
            updatedPropValues: { [propName]: propValue },
        },
    });
};
exports.updatePropsAndCode = (dispatch, newCode, propName, propValue) => {
    dispatch({
        type: const_1.Action.UpdatePropsAndCode,
        payload: {
            code: newCode,
            updatedPropValues: { [propName]: propValue },
        },
    });
};
exports.updateProps = (dispatch, propName, propValue) => {
    dispatch({
        type: const_1.Action.UpdateProps,
        payload: { [propName]: propValue },
    });
};
exports.reset = (dispatch, initialCode, providerValue, propsConfig) => {
    dispatch({
        type: const_1.Action.Reset,
        payload: {
            code: initialCode,
            props: propsConfig,
            providerValue,
        },
    });
};
//# sourceMappingURL=actions.js.map