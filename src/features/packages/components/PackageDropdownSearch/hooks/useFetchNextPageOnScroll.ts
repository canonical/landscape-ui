import type { FetchNextPageOptions } from "@tanstack/react-query";
import { useEffect, useEffectEvent, useState } from "react";
import { NEAR_BOTTOM_RATIO } from "../constants";

interface UseFetchNextPageOnScrollParams {
  readonly fetchNextPage: (options?: FetchNextPageOptions) => Promise<unknown>;
  readonly hasNextPage: boolean;
  readonly isFetchingNextPage: boolean;
  readonly pageCount: number;
}

/**
 * Fetches the next page when the given scroll container is scrolled near its
 * bottom, using the same check as the other infinite-scroll dropdowns. Returns
 * a callback ref for the scroll container.
 *
 * The check also runs whenever a page loads, so a page that is too short to
 * scroll still leads to the next one. A failed page is retried on the next
 * scroll.
 */
export const useFetchNextPageOnScroll = ({
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  pageCount,
}: UseFetchNextPageOnScrollParams) => {
  const [scrollContainer, setScrollContainer] = useState<HTMLElement | null>(
    null,
  );

  const fetchNextPageIfNearBottom = useEffectEvent(() => {
    if (!scrollContainer || !hasNextPage || isFetchingNextPage) {
      return;
    }

    const { scrollTop, scrollHeight, clientHeight } = scrollContainer;

    // A container without height (hidden or not laid out) has nothing to fill.
    if (!clientHeight) {
      return;
    }

    const nearBottom =
      scrollHeight - scrollTop <= clientHeight * NEAR_BOTTOM_RATIO;

    if (nearBottom) {
      // Don't cancel a page that is already in flight when scroll events
      // arrive before isFetchingNextPage updates.
      fetchNextPage({ cancelRefetch: false });
    }
  });

  useEffect(() => {
    if (!scrollContainer) {
      return;
    }

    const handleScroll = () => {
      fetchNextPageIfNearBottom();
    };

    scrollContainer.addEventListener("scroll", handleScroll);

    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll);
    };
  }, [scrollContainer]);

  useEffect(() => {
    fetchNextPageIfNearBottom();
  }, [scrollContainer, pageCount]);

  return setScrollContainer;
};
