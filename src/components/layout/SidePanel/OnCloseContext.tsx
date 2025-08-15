import { createContext } from "react";

const OnCloseContext = createContext<() => void>(() => undefined);

export default OnCloseContext;
