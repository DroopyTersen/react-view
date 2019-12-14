/// <reference types="react" />
import * as t from '@babel/types';
import { PluginItem } from '@babel/core';
import { PropTypes, Action } from './const';
import lightTheme from './light-theme';
export declare type TProvider<T = any> = {
    value: T;
    parse: (astRoot: any) => T;
    generate: (value: T, childTree: t.JSXElement) => t.JSXElement;
    imports: TImportsConfig;
};
export declare type TCustomProps = {
    [key: string]: {
        parse: (code: string, knobProps: any) => any;
        generate: (value: any) => any;
    };
};
export declare type TEditorLanguage = 'javascript' | 'jsx' | 'typescript' | 'tsx' | 'css';
export declare type TTransformToken = (tokenProps: {
    style?: {
        [key: string]: string | number | null;
    };
    className: string;
    children: string;
    [key: string]: any;
}) => React.ReactNode;
export declare type TUseViewParams<CustomPropFields = any> = {
    componentName?: string;
    imports?: TImportsConfig;
    scope?: {
        [key: string]: any;
    };
    props?: {
        [key: string]: TProp<CustomPropFields>;
    };
    onUpdate?: (params: {
        code: string;
    }) => void;
    initialCode?: string;
    provider?: TProvider;
    customProps?: TCustomProps;
};
export declare type TCompilerProps = {
    scope: {
        [key: string]: any;
    };
    code: string;
    minHeight?: number;
    setError: (error: string | null) => void;
    transformations: ((ast: t.File) => t.File)[];
    placeholder?: React.FC<{
        height: number;
    }>;
    presets?: PluginItem[];
};
export declare type TKnobsProps = {
    state: {
        [key: string]: TProp;
    };
    set: (propValue: TPropValue, propName: string) => void;
    error: TError;
};
export declare type TEditorProps = {
    code: string;
    transformToken?: TTransformToken;
    placeholder?: string;
    language?: TEditorLanguage;
    onChange: (code: string) => void;
    small?: boolean;
    theme?: typeof lightTheme;
    ['data-testid']?: string;
};
export declare type TErrorProps = {
    msg: string | null;
    code?: string;
    isPopup?: boolean;
};
export declare type TUseView = <ProviderValue = any, CustomPropFields = any>(params?: TUseViewParams<CustomPropFields>) => {
    compilerProps: Omit<TCompilerProps, 'minHeight' | 'placeholder' | 'presets'>;
    knobProps: TKnobsProps;
    editorProps: TEditorProps;
    errorProps: TErrorProps;
    providerValue: ProviderValue;
    actions: {
        formatCode: () => void;
        copyCode: () => void;
        copyUrl: () => void;
        reset: () => void;
        updateProvider: (value: ProviderValue) => void;
    };
};
export declare type TDispatch = (value: {
    type: Action;
    payload: any;
}) => void;
declare type TPropHookFn = (params: {
    getInstrumentOnChange: (what: string, into: string) => t.CallExpression;
    fnBodyAppend: (path: any, callExpression: t.CallExpression) => void;
}) => any;
export declare type TPropHook = {
    what: string;
    into: string;
} | TPropHookFn;
export declare type TImportsConfig = {
    [key: string]: {
        named?: string[];
        default?: string;
    };
};
export declare type TError = {
    where: string;
    msg: string | null;
};
export declare type TPropValue = undefined | boolean | string | number;
export declare type TProp<CustomPropFields = any> = {
    value: TPropValue;
    type: PropTypes;
    description: string;
    options?: any;
    placeholder?: string;
    defaultValue?: TPropValue;
    enumName?: string;
    hidden?: boolean;
    stateful?: boolean;
    propHook?: TPropHook;
    imports?: TImportsConfig;
    custom?: CustomPropFields;
};
export declare type TState<CustomPropFields = any> = {
    code: string;
    codeNoRecompile: string;
    props: {
        [key: string]: TProp<CustomPropFields>;
    };
    providerValue: any;
};
export {};
