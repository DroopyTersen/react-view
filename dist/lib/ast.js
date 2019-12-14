"use strict";
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
const traverse_1 = __importDefault(require("@babel/traverse"));
const generator_1 = __importDefault(require("@babel/generator"));
const t = __importStar(require("@babel/types"));
const parser_1 = require("@babel/parser");
const code_generator_1 = require("./code-generator");
exports.parse = (code) => parser_1.parse(code, {
    sourceType: 'module',
    plugins: ['jsx', 'flow'],
});
// creates a call expression that synchronizes view state
const getInstrumentOnChange = (what, into) => t.callExpression(t.identifier('__reactViewOnChange'), [
    t.identifier(what),
    t.stringLiteral(into),
]);
// appends a call expression to a function body
const fnBodyAppend = (path, callExpression) => {
    if (path.node.type !== 'JSXExpressionContainer') {
        return;
    }
    const callbackBody = path.get('expression').get('body');
    if (callbackBody.type === 'BlockStatement') {
        // when the callback body is a block
        // e.g.: e => { setValue(e.target.value) }
        callbackBody.pushContainer('body', callExpression);
    }
    else {
        // when it is a single statement like e => setValue(e.target.value)
        // we have to create a BlockStatement first
        callbackBody.replaceWith(t.blockStatement([
            t.expressionStatement(callbackBody.node),
            t.expressionStatement(callExpression),
        ]));
    }
};
// removing all imports, exports and top level
// variable declaration, add __reactViewOnChange instrumentation when needed
exports.transformBeforeCompilation = (ast, elementName, propsConfig) => {
    try {
        traverse_1.default(ast, {
            VariableDeclaration(path) {
                if (path.parent.type === 'Program') {
                    //@ts-ignore
                    path.replaceWith(path.node.declarations[0].init);
                }
            },
            ImportDeclaration(path) {
                path.remove();
            },
            ExportDefaultDeclaration(path) {
                if (path.node.declaration.type === 'ArrowFunctionExpression' ||
                    path.node.declaration.type === 'FunctionDeclaration') {
                    path.replaceWith(path.node.declaration);
                }
                else {
                    path.remove();
                }
            },
            // adds internal state instrumentation through __reactViewOnChange callback
            JSXElement(path) {
                if (path.node.openingElement.type === 'JSXOpeningElement' &&
                    //@ts-ignore
                    path.node.openingElement.name.name === elementName) {
                    if (propsConfig['children'] && propsConfig['children'].propHook) {
                        const propHook = propsConfig['children'].propHook;
                        path.get('children').forEach(child => {
                            typeof propHook === 'object'
                                ? fnBodyAppend(child, getInstrumentOnChange(propHook.what, propHook.into))
                                : child.traverse(propHook({ getInstrumentOnChange, fnBodyAppend }));
                        });
                    }
                    path
                        .get('openingElement')
                        .get('attributes')
                        .forEach(attr => {
                        const name = attr.get('name').node.name;
                        const propHook = propsConfig[name].propHook;
                        if (typeof propHook !== 'undefined') {
                            typeof propHook === 'object'
                                ? fnBodyAppend(attr.get('value'), getInstrumentOnChange(propHook.what, propHook.into))
                                : attr.traverse(propHook({ getInstrumentOnChange, fnBodyAppend }));
                        }
                    });
                }
            },
        });
    }
    catch (e) { }
    return ast;
};
function parseCode(code, elementName, parseProvider) {
    const propValues = {};
    const stateValues = {};
    let parsedProvider = undefined;
    try {
        const ast = exports.parse(code);
        traverse_1.default(ast, {
            JSXElement(path) {
                if (Object.keys(propValues).length === 0 && // process just the first element
                    path.node.openingElement.type === 'JSXOpeningElement' &&
                    //@ts-ignore
                    path.node.openingElement.name.name === elementName) {
                    path.node.openingElement.attributes.forEach((attr) => {
                        const name = attr.name.name;
                        let value = null;
                        if (attr.value === null) {
                            //boolean prop without value
                            value = true;
                        }
                        else {
                            if (attr.value.type === 'StringLiteral') {
                                value = attr.value.value;
                            }
                            else if (attr.value.type === 'JSXExpressionContainer') {
                                if (attr.value.expression.type === 'BooleanLiteral') {
                                    value = attr.value.expression.value;
                                }
                                else {
                                    value = code_generator_1.formatAstAndPrint(
                                    //@ts-ignore
                                    t.program([t.expressionStatement(attr.value.expression)]), 30);
                                }
                            }
                        }
                        propValues[name] = value;
                    });
                    propValues['children'] = code_generator_1.formatAstAndPrint(code_generator_1.getAstJsxElement('ViewRoot', [], path.node.children), 30)
                        .replace(/\n  /g, '\n')
                        .replace(/^<ViewRoot>\n?/, '')
                        .replace(/<\/ViewRoot>$/, '')
                        .replace(/\s*<ViewRoot \/>\s*/, '');
                }
            },
            VariableDeclarator(path) {
                // looking for React.useState()
                const node = path.node;
                if (node.id.type === 'ArrayPattern' &&
                    node.init.type === 'CallExpression' &&
                    node.init.callee.property.name === 'useState') {
                    const name = node.id.elements[0].name;
                    const valueNode = node.init.arguments[0];
                    if (valueNode.type === 'StringLiteral' ||
                        valueNode.type === 'BooleanLiteral') {
                        stateValues[name] = valueNode.value;
                    }
                    else {
                        stateValues[name] = generator_1.default(valueNode).code;
                    }
                }
            },
        });
        if (parseProvider) {
            parsedProvider = parseProvider(ast);
        }
    }
    catch (e) {
        throw new Error("Code is not valid and can't be parsed.");
    }
    // override props by local state (React hooks)
    Object.keys(stateValues).forEach(stateValueKey => {
        Object.keys(propValues).forEach(propValueKey => {
            if (propValues[propValueKey] === stateValueKey) {
                propValues[propValueKey] = stateValues[stateValueKey];
            }
        });
    });
    return { parsedProps: propValues, parsedProvider };
}
exports.parseCode = parseCode;
//# sourceMappingURL=ast.js.map