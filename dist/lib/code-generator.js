"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
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
const template_1 = __importDefault(require("@babel/template"));
const t = __importStar(require("@babel/types"));
const utils_1 = require("./utils");
const const_1 = require("./const");
const ast_1 = require("./ast");
// forked prettier on a diet
//@ts-ignore
const standalone_1 = __importDefault(require("@miksu/prettier/lib/standalone"));
//@ts-ignore
const parser_babylon_1 = __importDefault(require("@miksu/prettier/lib/language-js/parser-babylon"));
const reactImport = template_1.default.ast(`import * as React from 'react';`);
exports.getAstPropValue = (prop, name, customProps) => {
    const value = prop.value;
    switch (prop.type) {
        case const_1.PropTypes.String:
            return t.stringLiteral(String(value));
        case const_1.PropTypes.Boolean:
            return t.booleanLiteral(Boolean(value));
        case const_1.PropTypes.Enum:
            return t.identifier(String(value));
        case const_1.PropTypes.Date:
            return t.newExpression(t.identifier('Date'), value ? [t.stringLiteral(String(value))] : []);
        case const_1.PropTypes.Ref:
            return null;
        case const_1.PropTypes.Object:
            return template_1.default.ast(`${value}`, { plugins: ['jsx'] });
        case const_1.PropTypes.Array:
        case const_1.PropTypes.Number:
        case const_1.PropTypes.Function:
        case const_1.PropTypes.ReactNode:
            const output = template_1.default.ast(String(value), { plugins: ['jsx'] })
                .expression;
            // we never expect that user would input a variable as the value
            // treat it as a string instead
            if (output.type === 'Identifier') {
                return t.stringLiteral(output.name);
            }
            return output;
        case const_1.PropTypes.Custom:
            if (!customProps[name] || !customProps[name].generate) {
                console.error(`Missing customProps.${name}.generate definition.`);
            }
            return customProps[name].generate(value);
    }
};
exports.getAstPropsArray = (props, customProps) => {
    return Object.entries(props).map(([name, prop]) => {
        const { value, stateful, defaultValue } = prop;
        if (stateful)
            return t.jsxAttribute(t.jsxIdentifier(name), t.jsxExpressionContainer(t.identifier(name)));
        // When the `defaultValue` is set and `value` is the same as the `defaultValue`
        // we don't add it to the list of props.
        // It handles boolean props where `defaultValue` set to true,
        // and enum props that have a `defaultValue` set to be displayed
        // in the view correctly (checked checkboxes and selected default value in radio groups)
        // and not rendered in the component's props.
        if ((typeof value !== 'boolean' && !value) ||
            value === defaultValue ||
            (typeof value === 'boolean' && !value && !defaultValue)) {
            return null;
        }
        const astValue = exports.getAstPropValue(prop, name, customProps);
        if (!astValue)
            return null;
        // shortcut render "isDisabled" vs "isDisabled={true}"
        if (astValue.type === 'BooleanLiteral' && astValue.value === true) {
            return t.jsxAttribute(t.jsxIdentifier(name), null);
        }
        return t.jsxAttribute(t.jsxIdentifier(name), astValue.type === 'StringLiteral'
            ? astValue
            : t.jsxExpressionContainer(astValue));
    });
};
exports.getAstReactHooks = (props, customProps) => {
    const hooks = [];
    const buildReactHook = template_1.default(`const [%%name%%, %%setName%%] = React.useState(%%value%%);`);
    Object.keys(props).forEach(name => {
        if (props[name].stateful === true) {
            hooks.push(buildReactHook({
                name: t.identifier(name),
                setName: t.identifier(`set${name[0].toUpperCase() + name.slice(1)}`),
                value: exports.getAstPropValue(props[name], name, customProps),
            }));
        }
    });
    return hooks;
};
exports.getAstImport = (identifiers, source, defaultIdentifier) => {
    return t.importDeclaration([
        ...(defaultIdentifier
            ? [t.importDefaultSpecifier(t.identifier(defaultIdentifier))]
            : []),
        ...identifiers.map(identifier => t.importSpecifier(t.identifier(identifier), t.identifier(identifier))),
    ], t.stringLiteral(source));
};
exports.getAstJsxElement = (name, attrs, children) => {
    const isSelfClosing = children.length === 0;
    return t.jsxElement(t.jsxOpeningElement(t.jsxIdentifier(name), attrs.filter(attr => !!attr), isSelfClosing), isSelfClosing ? null : t.jsxClosingElement(t.jsxIdentifier(name)), children, true);
};
const addToImportList = (importList, imports) => {
    for (const [importFrom, importNames] of Object.entries(imports)) {
        if (!importList.hasOwnProperty(importFrom)) {
            importList[importFrom] = {
                named: [],
                default: '',
            };
        }
        if (importNames.default) {
            importList[importFrom].default = importNames.default;
        }
        if (importNames.named && importNames.named.length > 0) {
            if (!importList[importFrom].hasOwnProperty('named')) {
                importList[importFrom]['named'] = [];
            }
            importList[importFrom].named = [
                ...new Set(importList[importFrom].named.concat(importNames.named)),
            ];
        }
    }
};
exports.getAstImports = (importsConfig, providerImports, props) => {
    // global scoped import that are always displayed
    const importList = utils_1.clone(importsConfig);
    // prop level imports (typically enums related) that are displayed
    // only when the prop is being used
    Object.values(props).forEach(prop => {
        if (prop.imports &&
            prop.value &&
            prop.value !== '' &&
            prop.value !== prop.defaultValue) {
            addToImportList(importList, prop.imports);
        }
    });
    addToImportList(importList, providerImports);
    return Object.keys(importList).map(from => exports.getAstImport(importList[from].named || [], from, importList[from].default));
};
const getChildrenAst = (value) => {
    return template_1.default.ast(`<>${value}</>`, {
        plugins: ['jsx'],
    }).expression.children;
};
exports.getAst = (props, componentName, provider, providerValue, importsConfig, customProps) => {
    const { children } = props, restProps = __rest(props, ["children"]);
    const buildExport = template_1.default(`export default () => {%%body%%}`);
    return t.file(t.program([
        reactImport,
        ...exports.getAstImports(importsConfig, providerValue ? provider.imports : {}, props),
        buildExport({
            body: [
                ...exports.getAstReactHooks(restProps, customProps),
                t.returnStatement(provider.generate(providerValue, exports.getAstJsxElement(componentName, exports.getAstPropsArray(restProps, customProps), children && children.value
                    ? getChildrenAst(String(children.value))
                    : []))),
            ],
        }),
    ]), [], []);
};
exports.formatAstAndPrint = (ast, printWidth) => {
    const result = standalone_1.default.__debug.formatAST(ast, {
        originalText: '',
        parser: 'babel',
        printWidth: printWidth ? printWidth : 58,
        plugins: [parser_babylon_1.default],
    });
    return (result.formatted
        // add a new line before export
        .replace('export default', `${result.formatted.startsWith('import ') ? '\n' : ''}export default`)
        // remove newline at the end of file
        .replace(/[\r\n]+$/, '')
        // remove ; at the end of file
        .replace(/[;]+$/, ''));
};
exports.formatCode = (code) => {
    return exports.formatAstAndPrint(ast_1.parse(code));
};
exports.getCode = ({ props, componentName, provider, providerValue, importsConfig, customProps, }) => {
    if (Object.keys(props).length === 0) {
        return '';
    }
    const ast = exports.getAst(props, componentName, provider, providerValue, importsConfig, customProps);
    return exports.formatAstAndPrint(ast);
};
//# sourceMappingURL=code-generator.js.map