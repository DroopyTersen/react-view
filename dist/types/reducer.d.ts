import { TState } from './types';
import { Action } from './const';
export default function reducer(state: TState, action: {
    type: Action;
    payload: any;
}): TState;
