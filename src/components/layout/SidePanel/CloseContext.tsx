import { createContext } from "react";

const CloseContext = createContext<() => void>(() => undefined);

export default CloseContext;
