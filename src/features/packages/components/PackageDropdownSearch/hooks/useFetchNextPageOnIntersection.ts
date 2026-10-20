import type { FetchNextPageOptions } from "@tanstack/react-query";
import { useEffect } from "react";
import { useIntersectionObserver } from "usehooks-ts";

interface UseFetchNextPageOnIntersectionParams {
  readonly fetchNextPage: (options?: FetchNextPageOptions) => Promise<unknown>;
  readonly hasNextPage: boolean;
  readonly isFetchingNextPage: boolean;
}

/**
 * Returns a ref for an infinite-list footer that keeps fetching pages while
 * the footer is visible. The fetch is driven by the intersection state rather
 * than the observer callback, which only fires on transitions: a footer that
 * stays visible after a page loads would otherwise never request the next one.
 */
export const useFetchNextPageOnIntersection = ({
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
}: UseFetchNextPageOnIntersectionParams) => {
  const { ref, isIntersecting } = useIntersectionObserver();

  useEffect(() => {
    if (isIntersecting && hasNextPage && !isFetchingNextPage) {
      // Don't cancel a page that is already in flight (e.g. when the effect
      // re-runs before isFetchingNextPage updates).
      fetchNextPage({ cancelRefetch: false });
    }
  }, [isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return ref;
};
