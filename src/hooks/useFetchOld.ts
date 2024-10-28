import { useContext } from "react";
import { FetchContext } from "@/context/fetchOld";

export default function useFetchOld() {
  const fetch = useContext(FetchContext);

  if (!fetch) {
    throw new Error("useFetchOld must be used within FetchOldProvider");
  }

  return fetch;
}
