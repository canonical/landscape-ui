import { State } from '../../utils-ts';
export declare function getInitialValue<S extends State, P extends Partial<S>>(props: P, propKey: keyof S, defaultStateValues: S): S[keyof S];
