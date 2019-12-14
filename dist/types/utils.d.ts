import * as React from 'react';
import { TProp, TPropValue } from './types';
export declare function assertUnreachable(): never;
export declare const formatBabelError: (error: string) => string;
export declare const frameError: (error: string, code: string) => string;
export declare const buildPropsObj: (stateProps: {
    [key: string]: TProp<any>;
}, updatedPropValues: {
    [key: string]: TPropValue;
}) => {
    [key: string]: TProp<any>;
};
export declare function useValueDebounce<T>(globalVal: T, globalSet: (val: T) => void, shouldSkip?: boolean): [T, (val: T) => void];
export declare function useHover(): (boolean | React.MutableRefObject<null>)[];
export declare function clone<T>(obj: T): T;
