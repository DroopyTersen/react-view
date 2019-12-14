"use strict";
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
const React = __importStar(require("react"));
const index_1 = require("../index");
const View = args => {
    const params = index_1.useView(args);
    return (React.createElement("div", { style: { maxWidth: '600px' } },
        React.createElement(index_1.Compiler, Object.assign({}, params.compilerProps, { minHeight: 62, placeholder: index_1.Placeholder })),
        React.createElement(index_1.Error, { msg: params.errorProps.msg, isPopup: true }),
        React.createElement(index_1.Knobs, Object.assign({}, params.knobProps)),
        React.createElement(index_1.Editor, Object.assign({}, params.editorProps, { "data-testid": "rv-editor" })),
        React.createElement(index_1.Error, Object.assign({}, params.errorProps)),
        React.createElement(index_1.ActionButtons, Object.assign({}, params.actions))));
};
exports.default = View;
//# sourceMappingURL=view.js.map