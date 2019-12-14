import * as t from '@babel/types';
import { TProp, TImportsConfig, TCustomProps, TProvider } from './types';
export declare const getAstPropValue: (prop: TProp<any>, name: string, customProps: TCustomProps) => any;
export declare const getAstPropsArray: (props: {
    [key: string]: TProp<any>;
}, customProps: TCustomProps) => (t.JSXAttribute | null)[];
export declare const getAstReactHooks: (props: {
    [key: string]: TProp<any>;
}, customProps: TCustomProps) => t.ExpressionStatement[];
export declare const getAstImport: (identifiers: string[], source: string, defaultIdentifier?: string | undefined) => t.ImportDeclaration;
export declare const getAstJsxElement: (name: string, attrs: (t.JSXAttribute | null)[], children: (t.JSXElement | t.JSXFragment | t.JSXExpressionContainer | t.JSXSpreadChild | t.JSXText)[]) => t.JSXElement;
export declare const getAstImports: (importsConfig: TImportsConfig, providerImports: TImportsConfig, props: {
    [key: string]: TProp<any>;
}) => t.ImportDeclaration[];
export declare const getAst: (props: {
    [key: string]: TProp<any>;
}, componentName: string, provider: TProvider<any>, providerValue: any, importsConfig: TImportsConfig, customProps: TCustomProps) => t.File;
export declare const formatAstAndPrint: (ast: t.File, printWidth?: number | undefined) => any;
export declare const formatCode: (code: string) => string;
declare type TGetCodeParams = {
    componentName: string;
    props: {
        [key: string]: TProp;
    };
    importsConfig: TImportsConfig;
    provider: TProvider;
    providerValue: any;
    customProps: TCustomProps;
};
export declare const getCode: ({ props, componentName, provider, providerValue, importsConfig, customProps, }: TGetCodeParams) => any;
export {};
