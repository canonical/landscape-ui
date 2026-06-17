import { CodeSnippet } from "@canonical/react-components";
import type { ReactNode } from "react";
import type { ExportJob } from "../../types/ExportJob";

export const getFilterValue = (job: ExportJob): ReactNode => {
  const filter = job.query?.trim();

  if (!filter) {
    return null;
  }

  return <CodeSnippet blocks={[{ code: filter, wrapLines: true }]} />;
};
