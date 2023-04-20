import { useContext } from "react";
import { FetchContext } from "../context/fetch";

export default function useFetch() {
  return useContext(FetchContext);
}
