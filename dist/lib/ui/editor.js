"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
Copyright (c) 2019 Uber Technologies, Inc.

This source code is licensed under the MIT license found in the
LICENSE file in the root directory of this source tree.
*/
const React = __importStar(require("react"));
const react_simple_code_editor_1 = __importDefault(require("react-simple-code-editor"));
const prism_react_renderer_1 = __importStar(require("prism-react-renderer"));
const index_1 = require("../index");
const highlightCode = ({ code, theme, transformToken, language, }) => (React.createElement(prism_react_renderer_1.default, { Prism: prism_react_renderer_1.Prism, code: code, theme: theme, language: language || 'jsx' }, ({ tokens, getLineProps, getTokenProps }) => (React.createElement(React.Fragment, null, tokens.map((line, i) => (React.createElement("div", Object.assign({ key: i }, getLineProps({ line, key: i })), line.map((token, key) => {
    const tokenProps = getTokenProps({ token, key });
    if (transformToken) {
        return transformToken(tokenProps);
    }
    return React.createElement("span", Object.assign({ key: key }, tokenProps));
}))))))));
const Editor = ({ code: globalCode, transformToken, onChange, placeholder, language, theme, ['data-testid']: testid, }) => {
    const [focused, setFocused] = React.useState(false);
    const editorTheme = Object.assign(Object.assign({}, (theme || index_1.lightTheme)), { plain: Object.assign({ whiteSpace: 'break-spaces' }, (theme || index_1.lightTheme).plain) });
    const [code, setCode] = index_1.useValueDebounce(globalCode, onChange, focused);
    return (React.createElement("div", { "data-testid": testid, style: {
            boxSizing: 'border-box',
            paddingLeft: '4px',
            paddingRight: '4px',
            maxWidth: 'auto',
            overflow: 'hidden',
            border: focused ? '1px solid #276EF1' : '1px solid #CCC',
            borderRadius: '5px',
        } },
        React.createElement("style", { dangerouslySetInnerHTML: {
                __html: `.npm__react-simple-code-editor__textarea { outline: none !important }`,
            } }),
        React.createElement(react_simple_code_editor_1.default, { value: code || '', placeholder: placeholder, highlight: code => highlightCode({ code, theme: editorTheme, transformToken, language }), onValueChange: code => setCode(code), onFocus: () => setFocused(true), onBlur: () => setFocused(false), padding: 8, style: editorTheme.plain })));
};
exports.default = Editor;
//# sourceMappingURL=editor.js.map