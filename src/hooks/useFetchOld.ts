import { useContext } from "react";
import { FetchContext } from "../context/fetchOld";

export default function useFetchOld() {
  return useContext(FetchContext);
}
