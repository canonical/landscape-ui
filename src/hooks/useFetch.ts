import { useContext } from "react";
import { FetchContext } from "@/context/fetch";

export default function useFetch() {
  const fetch = useContext(FetchContext);

  if (!fetch) {
    throw new Error("useFetch must be used within FetchProvider");
  }

  return fetch;
}
