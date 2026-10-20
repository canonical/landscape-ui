import type { FetchNextPageOptions } from "@tanstack/react-query";
import { useEffect } from "react";
import { useIntersectionObserver } from "usehooks-ts";

interface UseFetchNextPageOnIntersectionParams {
  readonly fetchNextPage: (options?: FetchNextPageOptions) => Promise<unknown>;
  readonly hasNextPage: boolean;
  readonly isFetchingNextPage: boolean;
  readonly isFetchNextPageError: boolean;
}

/**
 * Returns a ref for an infinite-list footer that keeps fetching pages while
 * the footer is visible. The fetch is driven by the intersection state rather
 * than the observer callback, which only fires on transitions: a footer that
 * stays visible after a page loads would otherwise never request the next one.
 *
 * After a failed page, fetching pauses until the footer comes back into view,
 * so a persistent error doesn't turn into an endless request loop.
 */
export const useFetchNextPageOnIntersection = ({
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  isFetchNextPageError,
}: UseFetchNextPageOnIntersectionParams) => {
  const canFetchNextPage = hasNextPage && !isFetchingNextPage;

  const { ref, isIntersecting } = useIntersectionObserver({
    onChange: (isVisible) => {
      // Retry a failed page only on a new intersection.
      if (isVisible && isFetchNextPageError && canFetchNextPage) {
        fetchNextPage({ cancelRefetch: false });
      }
    },
  });

  useEffect(() => {
    if (isIntersecting && canFetchNextPage && !isFetchNextPageError) {
      // Don't cancel a page that is already in flight (e.g. when the effect
      // re-runs before isFetchingNextPage updates).
      fetchNextPage({ cancelRefetch: false });
    }
  }, [isIntersecting, canFetchNextPage, isFetchNextPageError, fetchNextPage]);

  return ref;
};
