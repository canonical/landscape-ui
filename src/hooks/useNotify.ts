import { useContext } from "react";
import { NotifyContext } from "../context/notify";

export default function useNotify() {
  return useContext(NotifyContext);
}
