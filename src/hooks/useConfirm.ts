import { useContext } from "react";
import { ConfirmContext } from "../context/confirm";

export default function useConfirm() {
  return useContext(ConfirmContext);
}
