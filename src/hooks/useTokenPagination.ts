import { useState } from "react";

/**
 * Manages token-based (cursor) pagination state.
 *
 * APIs that paginate with opaque page tokens don't expose random access to
 * pages, so we keep a stack of the tokens used to reach each visited page.
 * An empty stack means we're on the first page; each entry is the token that
 * was used to fetch the page at that depth, which lets us step backwards.
 *
 * @param resetKey When this value changes, pagination resets to the first page.
 * Pass the identifier of the resource being paginated (e.g. a mirror or
 * repository name) so switching resources starts from the beginning.
 */
export default function useTokenPagination(resetKey: string) {
  const [pageTokenStack, setPageTokenStack] = useState<string[]>([]);
  const [trackedResetKey, setTrackedResetKey] = useState(resetKey);

  // Reset pagination when the target resource changes.
  if (trackedResetKey !== resetKey) {
    setTrackedResetKey(resetKey);
    setPageTokenStack([]);
  }

  const pushNextPage = (nextPageToken: string | undefined) => {
    if (nextPageToken) {
      setPageTokenStack((stack) => [...stack, nextPageToken]);
    }
  };

  const goToPreviousPage = () => {
    setPageTokenStack((stack) => stack.slice(0, -1));
  };

  return {
    currentPageToken: pageTokenStack.at(-1),
    currentPage: pageTokenStack.length + 1,
    hasPreviousPage: pageTokenStack.length > 0,
    pushNextPage,
    goToPreviousPage,
  };
}
