/*
Copyright (c) 2019 Uber Technologies, Inc.

This source code is licensed under the MIT license found in the
LICENSE file in the root directory of this source tree.
*/
import { useState, useReducer, useEffect } from 'react';
import copy from 'copy-to-clipboard';
import debounce from 'lodash/debounce';
// transformations, code generation
import { transformBeforeCompilation } from './ast';
import { getCode, formatCode } from './code-generator';
import { buildPropsObj } from './utils';
// actions that can be dispatched
import { reset, updateAll, updateCode, updateCodeAndProvider, updateProps, updatePropsAndCode, updatePropsAndCodeNoRecompile, } from './actions';
import reducer from './reducer';
const useView = (config = {}) => {
    // setting defaults
    const componentName = config.componentName ? config.componentName : '';
    const propsConfig = config.props ? config.props : {};
    const scopeConfig = config.scope ? config.scope : {};
    const importsConfig = config.imports ? config.imports : {};
    const provider = config.provider
        ? config.provider
        : {
            value: undefined,
            parse: () => undefined,
            generate: (_, child) => child,
            imports: {},
        };
    const onUpdate = config.onUpdate ? config.onUpdate : () => { };
    const customProps = config.customProps ? config.customProps : {};
    const initialCode = config.initialCode;
    const [hydrated, setHydrated] = useState(false);
    const [error, setError] = useState({ where: '', msg: null });
    const [state, dispatch] = useReducer(reducer, {
        code: initialCode ||
            getCode({
                props: propsConfig,
                componentName,
                provider,
                providerValue: provider.value,
                importsConfig,
                customProps,
            }),
        codeNoRecompile: '',
        props: propsConfig,
        providerValue: provider ? provider.value : undefined,
    });
    // initialize from the initialCode
    useEffect(() => {
        if (initialCode && !hydrated) {
            setHydrated(true);
            try {
                updateAll(dispatch, initialCode, componentName, propsConfig, provider ? provider.parse : undefined, customProps);
            }
            catch (e) { }
        }
    }, [initialCode]);
    // this callback is secretely inserted into props marked with
    // "propHook" this way we can get notified when the internal
    // state of previewed component is changed by user
    const __reactViewOnChange = debounce((propValue, propName) => {
        !hydrated && setHydrated(true);
        const newCode = getCode({
            props: buildPropsObj(state.props, { [propName]: propValue }),
            componentName,
            provider,
            providerValue: state.providerValue,
            importsConfig,
            customProps,
        });
        updatePropsAndCodeNoRecompile(dispatch, newCode, propName, propValue);
        onUpdate({ code: newCode });
    }, 200);
    return {
        compilerProps: {
            code: state.code,
            setError: (msg) => setError({ where: '__compiler', msg }),
            transformations: [
                (ast) => transformBeforeCompilation(ast, componentName, propsConfig),
            ],
            scope: Object.assign(Object.assign({}, scopeConfig), { __reactViewOnChange }),
        },
        knobProps: {
            state: state.props,
            error,
            set: (propValue, propName) => {
                try {
                    !hydrated && setHydrated(true);
                    const newCode = getCode({
                        props: buildPropsObj(state.props, { [propName]: propValue }),
                        componentName,
                        provider,
                        providerValue: state.providerValue,
                        importsConfig,
                        customProps,
                    });
                    setError({ where: '', msg: null });
                    updatePropsAndCode(dispatch, newCode, propName, propValue);
                    onUpdate({ code: newCode });
                }
                catch (e) {
                    updateProps(dispatch, propName, propValue);
                    setError({ where: propName, msg: e.toString() });
                }
            },
        },
        providerValue: state.providerValue,
        editorProps: {
            code: state.codeNoRecompile !== '' ? state.codeNoRecompile : state.code,
            onChange: (newCode) => {
                try {
                    updateAll(dispatch, newCode, componentName, propsConfig, provider ? provider.parse : undefined, customProps);
                    onUpdate({ code: newCode });
                }
                catch (e) {
                    updateCode(dispatch, newCode);
                }
            },
        },
        errorProps: {
            msg: error.where === '__compiler' ? error.msg : null,
            code: state.code,
        },
        actions: {
            formatCode: () => {
                updateCode(dispatch, formatCode(state.code));
            },
            copyCode: () => {
                copy(state.code);
            },
            copyUrl: () => {
                copy(window.location.href);
            },
            reset: () => {
                const editorOnlyMode = Object.keys(propsConfig).length === 0;
                const providerValue = provider ? provider.value : undefined;
                const newCode = editorOnlyMode
                    ? initialCode
                    : getCode({
                        props: propsConfig,
                        componentName,
                        provider,
                        providerValue,
                        importsConfig,
                        customProps,
                    });
                reset(dispatch, newCode, providerValue, propsConfig);
                onUpdate({ code: newCode });
            },
            updateProvider: (providerValue) => {
                const newCode = getCode({
                    props: buildPropsObj(state.props, {}),
                    componentName,
                    provider,
                    providerValue,
                    importsConfig,
                    customProps,
                });
                updateCodeAndProvider(dispatch, newCode, providerValue);
            },
            updateProp: (propName, propValue) => {
                try {
                    const newCode = getCode({
                        props: buildPropsObj(state.props, { [propName]: propValue }),
                        componentName,
                        provider,
                        providerValue: state.providerValue,
                        importsConfig,
                        customProps,
                    });
                    setError({ where: '', msg: null });
                    updatePropsAndCode(dispatch, newCode, propName, propValue);
                }
                catch (e) {
                    updateProps(dispatch, propName, propValue);
                    setError({ where: propName, msg: e.toString() });
                }
            },
        },
    };
};
export default useView;
//# sourceMappingURL=use-view.js.map