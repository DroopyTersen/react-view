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
const react_1 = require("react");
const copy_to_clipboard_1 = __importDefault(require("copy-to-clipboard"));
const debounce_1 = __importDefault(require("lodash/debounce"));
// transformations, code generation
const ast_1 = require("./ast");
const code_generator_1 = require("./code-generator");
const utils_1 = require("./utils");
// actions that can be dispatched
const actions_1 = require("./actions");
const reducer_1 = __importDefault(require("./reducer"));
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
    const [hydrated, setHydrated] = react_1.useState(false);
    const [error, setError] = react_1.useState({ where: '', msg: null });
    const [state, dispatch] = react_1.useReducer(reducer_1.default, {
        code: initialCode ||
            code_generator_1.getCode({
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
    react_1.useEffect(() => {
        if (initialCode && !hydrated) {
            setHydrated(true);
            try {
                actions_1.updateAll(dispatch, initialCode, componentName, propsConfig, provider ? provider.parse : undefined, customProps);
            }
            catch (e) { }
        }
    }, [initialCode]);
    // this callback is secretely inserted into props marked with
    // "propHook" this way we can get notified when the internal
    // state of previewed component is changed by user
    const __reactViewOnChange = debounce_1.default((propValue, propName) => {
        !hydrated && setHydrated(true);
        const newCode = code_generator_1.getCode({
            props: utils_1.buildPropsObj(state.props, { [propName]: propValue }),
            componentName,
            provider,
            providerValue: state.providerValue,
            importsConfig,
            customProps,
        });
        actions_1.updatePropsAndCodeNoRecompile(dispatch, newCode, propName, propValue);
        onUpdate({ code: newCode });
    }, 200);
    return {
        compilerProps: {
            code: state.code,
            setError: (msg) => setError({ where: '__compiler', msg }),
            transformations: [
                (ast) => ast_1.transformBeforeCompilation(ast, componentName, propsConfig),
            ],
            scope: Object.assign(Object.assign({}, scopeConfig), { __reactViewOnChange }),
        },
        knobProps: {
            state: state.props,
            error,
            set: (propValue, propName) => {
                try {
                    !hydrated && setHydrated(true);
                    const newCode = code_generator_1.getCode({
                        props: utils_1.buildPropsObj(state.props, { [propName]: propValue }),
                        componentName,
                        provider,
                        providerValue: state.providerValue,
                        importsConfig,
                        customProps,
                    });
                    setError({ where: '', msg: null });
                    actions_1.updatePropsAndCode(dispatch, newCode, propName, propValue);
                    onUpdate({ code: newCode });
                }
                catch (e) {
                    actions_1.updateProps(dispatch, propName, propValue);
                    setError({ where: propName, msg: e.toString() });
                }
            },
        },
        providerValue: state.providerValue,
        editorProps: {
            code: state.codeNoRecompile !== '' ? state.codeNoRecompile : state.code,
            onChange: (newCode) => {
                try {
                    actions_1.updateAll(dispatch, newCode, componentName, propsConfig, provider ? provider.parse : undefined, customProps);
                    onUpdate({ code: newCode });
                }
                catch (e) {
                    actions_1.updateCode(dispatch, newCode);
                }
            },
        },
        errorProps: {
            msg: error.where === '__compiler' ? error.msg : null,
            code: state.code,
        },
        actions: {
            formatCode: () => {
                actions_1.updateCode(dispatch, code_generator_1.formatCode(state.code));
            },
            copyCode: () => {
                copy_to_clipboard_1.default(state.code);
            },
            copyUrl: () => {
                copy_to_clipboard_1.default(window.location.href);
            },
            reset: () => {
                const editorOnlyMode = Object.keys(propsConfig).length === 0;
                const providerValue = provider ? provider.value : undefined;
                const newCode = editorOnlyMode
                    ? initialCode
                    : code_generator_1.getCode({
                        props: propsConfig,
                        componentName,
                        provider,
                        providerValue,
                        importsConfig,
                        customProps,
                    });
                actions_1.reset(dispatch, newCode, providerValue, propsConfig);
                onUpdate({ code: newCode });
            },
            updateProvider: (providerValue) => {
                const newCode = code_generator_1.getCode({
                    props: utils_1.buildPropsObj(state.props, {}),
                    componentName,
                    provider,
                    providerValue,
                    importsConfig,
                    customProps,
                });
                actions_1.updateCodeAndProvider(dispatch, newCode, providerValue);
            },
            updateProp: (propName, propValue) => {
                try {
                    const newCode = code_generator_1.getCode({
                        props: utils_1.buildPropsObj(state.props, { [propName]: propValue }),
                        componentName,
                        provider,
                        providerValue: state.providerValue,
                        importsConfig,
                        customProps,
                    });
                    setError({ where: '', msg: null });
                    actions_1.updatePropsAndCode(dispatch, newCode, propName, propValue);
                }
                catch (e) {
                    actions_1.updateProps(dispatch, propName, propValue);
                    setError({ where: propName, msg: e.toString() });
                }
            },
        },
    };
};
exports.default = useView;
//# sourceMappingURL=use-view.js.map