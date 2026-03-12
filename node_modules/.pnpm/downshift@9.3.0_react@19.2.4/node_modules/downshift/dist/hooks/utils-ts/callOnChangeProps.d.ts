import { Action, Props, State } from '../../utils-ts';
export declare function callOnChangeProps<S extends State, P extends Partial<S> & Props<S, T>, T>(action: Action<T>, props: P, state: S, newState: S): void;
