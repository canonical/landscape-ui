import { useContext } from "react";
import { FetchDebArchiveContext } from "@/api/fetchDebArchive";

export default function useFetchDebArchive() {
  const fetch = useContext(FetchDebArchiveContext);

  if (!fetch) {
    throw new Error(
      "useFetchDebArchive must be used within FetchDebArchiveProvider",
    );
  }

  return fetch;
}
