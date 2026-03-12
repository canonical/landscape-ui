import { State } from '../../utils-ts';
export declare function getDefaultValue<S extends State, P extends Partial<S>>(props: P, propKey: keyof S, defaultStateValues: S): S[keyof S];
