import * as React from 'react';
import { PropTypes, TPropValue } from '../index';
declare const Knob: React.SFC<{
    name: string;
    error: string | null;
    description: string;
    val: TPropValue;
    set: (val: TPropValue) => void;
    type: PropTypes;
    options?: {
        [key: string]: string;
    };
    placeholder?: string;
    enumName?: string;
}>;
export default Knob;
