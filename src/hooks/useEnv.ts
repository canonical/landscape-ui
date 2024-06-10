import { useContext } from "react";
import { EnvContext } from "@/context/env";

export default function useEnv() {
  return useContext(EnvContext);
}
