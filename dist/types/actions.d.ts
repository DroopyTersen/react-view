import { TProp, TDispatch, TPropValue, TCustomProps } from './types';
export declare const updateCode: (dispatch: TDispatch, newCode: string) => void;
export declare const updateCodeAndProvider: (dispatch: TDispatch, newCode: string, providerValue: any) => void;
export declare const updateAll: (dispatch: TDispatch, newCode: string, componentName: string, propsConfig: {
    [key: string]: TProp<any>;
}, parseProvider?: ((astRoot: any) => any) | undefined, customProps?: TCustomProps | undefined) => void;
export declare const updatePropsAndCodeNoRecompile: (dispatch: TDispatch, newCode: string, propName: string, propValue: TPropValue) => void;
export declare const updatePropsAndCode: (dispatch: TDispatch, newCode: string, propName: string, propValue: TPropValue) => void;
export declare const updateProps: (dispatch: TDispatch, propName: string, propValue: TPropValue) => void;
export declare const reset: (dispatch: TDispatch, initialCode: string, providerValue: any, propsConfig: {
    [key: string]: TProp<any>;
}) => void;
