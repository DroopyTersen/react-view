"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const const_1 = require("./const");
const utils_1 = require("./utils");
function reducer(state, action) {
    switch (action.type) {
        case const_1.Action.UpdateCode:
            return Object.assign(Object.assign({}, state), { code: action.payload, codeNoRecompile: '' });
        case const_1.Action.UpdateCodeAndProvider:
            return Object.assign(Object.assign({}, state), { code: action.payload.code, providerValue: action.payload.providerValue, codeNoRecompile: '' });
        case const_1.Action.Update:
            return Object.assign(Object.assign({}, state), { code: action.payload.code, providerValue: action.payload.providerValue, codeNoRecompile: '', props: utils_1.buildPropsObj(state.props, action.payload.updatedPropValues) });
        case const_1.Action.UpdatePropsAndCodeNoRecompile:
            return Object.assign(Object.assign({}, state), { codeNoRecompile: action.payload.codeNoRecompile, props: utils_1.buildPropsObj(state.props, action.payload.updatedPropValues) });
        case const_1.Action.UpdateProps:
            return Object.assign(Object.assign({}, state), { codeNoRecompile: '', props: utils_1.buildPropsObj(state.props, action.payload) });
        case const_1.Action.UpdatePropsAndCode:
            return Object.assign(Object.assign({}, state), { code: action.payload.code, codeNoRecompile: '', props: utils_1.buildPropsObj(state.props, action.payload.updatedPropValues) });
        case const_1.Action.Reset:
            return Object.assign(Object.assign({}, state), { code: action.payload.code, codeNoRecompile: '', props: action.payload.props, providerValue: action.payload.providerValue });
        default:
            return utils_1.assertUnreachable();
    }
}
exports.default = reducer;
//# sourceMappingURL=reducer.js.map