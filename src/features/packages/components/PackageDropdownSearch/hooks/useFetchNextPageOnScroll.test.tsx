import { act, fireEvent, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useFetchNextPageOnScroll } from "./useFetchNextPageOnScroll";

type HookParams = Parameters<typeof useFetchNextPageOnScroll>[0];

const CLIENT_HEIGHT = 200;
const SCROLL_HEIGHT = 1000;
const SCROLLED_TO_BOTTOM = SCROLL_HEIGHT - CLIENT_HEIGHT;

const createScrollContainer = ({
  scrollHeight = SCROLL_HEIGHT,
  scrollTop = 0,
}: { scrollHeight?: number; scrollTop?: number } = {}) => {
  const container = document.createElement("div");

  Object.defineProperties(container, {
    clientHeight: { configurable: true, value: CLIENT_HEIGHT },
    scrollHeight: { configurable: true, value: scrollHeight },
    scrollTop: { configurable: true, writable: true, value: scrollTop },
  });

  return container;
};

const renderScrollHook = (
  container: HTMLElement,
  overrides: Partial<HookParams> = {},
) => {
  const initialProps: HookParams = {
    fetchNextPage: vi.fn(async () => undefined),
    hasNextPage: true,
    isFetchingNextPage: false,
    pageCount: 1,
    ...overrides,
  };

  const { result, rerender } = renderHook(
    (props: HookParams) => useFetchNextPageOnScroll(props),
    { initialProps },
  );

  act(() => {
    result.current(container);
  });

  return {
    fetchNextPage: initialProps.fetchNextPage,
    rerender: (props: Partial<HookParams>) => {
      rerender({ ...initialProps, ...props });
    },
  };
};

describe("useFetchNextPageOnScroll", () => {
  it("doesn't fetch when the list fills the container and isn't scrolled", () => {
    const container = createScrollContainer();
    const { fetchNextPage } = renderScrollHook(container);

    fireEvent.scroll(container);

    expect(fetchNextPage).not.toHaveBeenCalled();
  });

  it("fetches the next page when scrolled near the bottom", () => {
    const container = createScrollContainer();
    const { fetchNextPage } = renderScrollHook(container);

    container.scrollTop = SCROLLED_TO_BOTTOM;
    fireEvent.scroll(container);

    expect(fetchNextPage).toHaveBeenCalledExactlyOnceWith({
      cancelRefetch: false,
    });
  });

  it("doesn't fetch while a page is loading or when there are no more pages", () => {
    const container = createScrollContainer({ scrollTop: SCROLLED_TO_BOTTOM });
    const { fetchNextPage, rerender } = renderScrollHook(container, {
      isFetchingNextPage: true,
    });

    fireEvent.scroll(container);

    rerender({ hasNextPage: false });
    fireEvent.scroll(container);

    expect(fetchNextPage).not.toHaveBeenCalled();
  });

  it("keeps fetching while the list doesn't fill the container, until the last page", () => {
    const container = createScrollContainer({ scrollHeight: CLIENT_HEIGHT });
    const { fetchNextPage, rerender } = renderScrollHook(container);

    // Page 1 doesn't fill the container: fetch page 2.
    expect(fetchNextPage).toHaveBeenCalledOnce();

    rerender({ isFetchingNextPage: true });
    rerender({ pageCount: 2 });

    // Page 2 still doesn't fill it: fetch page 3.
    expect(fetchNextPage).toHaveBeenCalledTimes(2);

    rerender({ pageCount: 2, isFetchingNextPage: true });
    rerender({ pageCount: 3, hasNextPage: false });
    fireEvent.scroll(container);

    // Page 3 is the last page.
    expect(fetchNextPage).toHaveBeenCalledTimes(2);
  });

  it("doesn't fetch for a container without height", () => {
    const container = createScrollContainer({ scrollHeight: 0 });
    Object.defineProperty(container, "clientHeight", { value: 0 });

    const { fetchNextPage } = renderScrollHook(container);
    fireEvent.scroll(container);

    expect(fetchNextPage).not.toHaveBeenCalled();
  });

  it("doesn't fetch a failed page again until the next scroll", () => {
    const container = createScrollContainer({ scrollTop: SCROLLED_TO_BOTTOM });
    const { fetchNextPage, rerender } = renderScrollHook(container);

    expect(fetchNextPage).toHaveBeenCalledOnce();

    // The request fails: loading ends without a new page.
    rerender({ isFetchingNextPage: true });
    rerender({ isFetchingNextPage: false });

    expect(fetchNextPage).toHaveBeenCalledOnce();

    fireEvent.scroll(container);

    expect(fetchNextPage).toHaveBeenCalledTimes(2);
  });
});
