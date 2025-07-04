import { useContext } from "react";
import { EnvContext } from "./EnvContext";

export default function useEnv() {
  return useContext(EnvContext);
}
