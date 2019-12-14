/*
Copyright (c) 2019 Uber Technologies, Inc.

This source code is licensed under the MIT license found in the
LICENSE file in the root directory of this source tree.
*/
import * as React from 'react';
import { useView, Compiler, Knobs, Editor, Error, ActionButtons, Placeholder, } from '../index';
const View = args => {
    const params = useView(args);
    return (React.createElement("div", { style: { maxWidth: '600px' } },
        React.createElement(Compiler, Object.assign({}, params.compilerProps, { minHeight: 62, placeholder: Placeholder })),
        React.createElement(Error, { msg: params.errorProps.msg, isPopup: true }),
        React.createElement(Knobs, Object.assign({}, params.knobProps)),
        React.createElement(Editor, Object.assign({}, params.editorProps, { "data-testid": "rv-editor" })),
        React.createElement(Error, Object.assign({}, params.errorProps)),
        React.createElement(ActionButtons, Object.assign({}, params.actions))));
};
export default View;
//# sourceMappingURL=view.js.map