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
const index_1 = require("../index");
const knob_1 = __importDefault(require("./knob"));
const KnobColumn = ({ state, knobNames, error, set, }) => {
    return (React.createElement("div", { style: {
            flexBasis: '50%',
            padding: `0 16px`,
        } }, knobNames.map((name) => (React.createElement(knob_1.default, { key: name, name: name, error: error.where === name ? error.msg : null, description: state[name].description, type: state[name].type, val: state[name].value, options: state[name].options, placeholder: state[name].placeholder, set: (value) => set(value, name), enumName: state[name].enumName })))));
};
const Knobs = ({ state, set, error }) => {
    const [showAllKnobs, setShowAllKnobs] = React.useState(false);
    const allKnobNames = Object.keys(state).filter(name => state[name].type !== index_1.PropTypes.Custom);
    const filteredKnobNames = allKnobNames.filter((name) => state[name].hidden !== true);
    const knobNames = showAllKnobs ? allKnobNames : filteredKnobNames;
    const firstGroup = knobNames.slice(0, Math.round(knobNames.length / 2));
    const secondGroup = knobNames.slice(Math.round(knobNames.length / 2));
    return (React.createElement(React.Fragment, null,
        React.createElement("style", { dangerouslySetInnerHTML: {
                __html: `
        @media screen and (max-width: 600px) {
          .react-view-columns {
            flex-wrap: wrap;
          }
        }
        .react-view-columns {
          display: flex;
          margin: 0 -16px;
        }
      `,
            } }),
        React.createElement("div", { className: "react-view-columns" },
            React.createElement(KnobColumn, { state: state, knobNames: firstGroup, set: set, error: error }),
            React.createElement(KnobColumn, { state: state, knobNames: secondGroup, set: set, error: error })),
        filteredKnobNames.length !== allKnobNames.length && (React.createElement("button", { onClick: () => setShowAllKnobs(!showAllKnobs) }, showAllKnobs ? 'Show only basic props' : 'Show all props'))));
};
exports.default = Knobs;
//# sourceMappingURL=knobs.js.map