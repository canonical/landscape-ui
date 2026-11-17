/**
 * Adds an a11y aria live status message if getA11yStatusMessage is passed.
 * @param getA11yStatusMessage The function that builds the status message.
 * @param options The options to be passed to getA11yStatusMessage if called.
 * @param dependencyArray The dependency array that triggers the status message setter via useEffect.
 * @param environment The environment object containing the document.
 */
export declare function useA11yMessageStatus<Options>(getA11yStatusMessage: ((options: Options) => string) | undefined, options: Options, dependencyArray: unknown[], environment: {
    document: Document | undefined;
} | undefined): void;
