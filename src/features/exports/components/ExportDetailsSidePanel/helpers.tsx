import { CodeSnippet } from "@canonical/react-components";
import type { ReactNode } from "react";
import type { ExportJob } from "../../types/ExportJob";

const ID_ONLY_QUERY_RE = /^id:\d+(\s+OR\s+id:\d+)*$/;

export const getFilterValue = (job: ExportJob): ReactNode => {
  const filter = job.displayQuery?.trim() || "";
  const hasSelection = job.hasSelection ?? false;

  let legacyFilter = "";
  if (!filter && job.query) {
    legacyFilter = ID_ONLY_QUERY_RE.test(job.query.trim())
      ? ""
      : job.query.trim();
  }

  const effectiveFilter = filter || legacyFilter;
  const effectiveSelection =
    hasSelection ||
    (!filter && !!job.query && ID_ONLY_QUERY_RE.test(job.query.trim()));

  if (!effectiveFilter && !effectiveSelection) return null;

  if (effectiveSelection && !effectiveFilter) return "Custom selection";

  if (effectiveFilter && !effectiveSelection) {
    return (
      <CodeSnippet blocks={[{ code: effectiveFilter, wrapLines: true }]} />
    );
  }

  return (
    <>
      <div>Custom selection</div>
      <CodeSnippet blocks={[{ code: effectiveFilter, wrapLines: true }]} />
    </>
  );
};
