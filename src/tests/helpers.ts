import { expect, vi } from "vitest";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { BREAKPOINT_PX } from "@/constants";

export const expectLoadingState = async (): Promise<void> => {
  const loadingSpinner = await screen.findByRole("status");
  expect(loadingSpinner).toHaveTextContent("Loading...");
  // Checked against the document, not the spinner's ancestors: a render
  // between the two steps can detach the spinner's whole subtree, which
  // `waitForElementToBeRemoved` would then watch forever.
  await waitFor(() => {
    expect(loadingSpinner).not.toBeInTheDocument();
  });
};

export const expectErrorNotification = async (): Promise<void> => {
  const errorNotificationCount = (await screen.findAllByText(/error/i)).length;
  expect(errorNotificationCount).toBeGreaterThanOrEqual(1);
};

const getDefaultMatchMediaImplementation = (
  query: string,
  matches = false,
) => ({
  matches,
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
});

const mockMatchMedia = (
  queries: { query: string; matches: boolean }[] = [],
): void => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: (query: string) => {
      const match = queries.find((m) => m.query === query);
      return getDefaultMatchMediaImplementation(query, match?.matches);
    },
  });
};

const originalGetBoundingClientRect = Range.prototype.getBoundingClientRect;

export const mockRangeBoundingClientRect = (
  mockFn: () => DOMRect = () =>
    ({
      x: 0,
      y: 0,
      top: 0,
      left: 0,
      bottom: 10,
      right: 100,
      width: 100,
      height: 10,
      toJSON: () => null,
    }) as DOMRect,
): void => {
  Object.defineProperty(Range.prototype, "getBoundingClientRect", {
    configurable: true,
    writable: true,
    value: mockFn,
  });
};

export const restoreRangeBoundingClientRect = (): void => {
  if (originalGetBoundingClientRect) {
    Range.prototype.getBoundingClientRect = originalGetBoundingClientRect;
  } else {
    delete (Range.prototype as Partial<Range>).getBoundingClientRect;
  }
};

export const setScreenSize = (bp: keyof typeof BREAKPOINT_PX): void => {
  const currentWidth = BREAKPOINT_PX[bp];
  if (currentWidth === undefined) {
    throw new Error(`Unknown breakpoint "${bp}"`);
  }
  const mediaConfig = Object.entries(BREAKPOINT_PX).map(([_, px]) => ({
    query: `(min-width: ${px}px)`,
    matches: currentWidth >= px,
  }));
  mockMatchMedia(mediaConfig);
};

export function resetScreenSize(): void {
  mockMatchMedia([]);
}

/**
 * Stubs the scroll metrics that jsdom always reports as 0, for testing
 * infinite scroll. Every element reports the given client height and a scroll
 * height of one item height per list item it contains. Call before rendering
 * and restore with `vi.restoreAllMocks()`.
 */
export const mockListScrollMetrics = ({
  clientHeight,
  itemHeight,
}: {
  clientHeight: number;
  itemHeight: number;
}): { scrollToBottom: (element: Element) => void } => {
  let scrollTop = 0;

  vi.spyOn(Element.prototype, "clientHeight", "get").mockReturnValue(
    clientHeight,
  );
  vi.spyOn(Element.prototype, "scrollHeight", "get").mockImplementation(
    function (this: Element) {
      return this.querySelectorAll("li").length * itemHeight;
    },
  );
  vi.spyOn(Element.prototype, "scrollTop", "get").mockImplementation(
    () => scrollTop,
  );

  return {
    scrollToBottom: (element) => {
      scrollTop = element.scrollHeight - element.clientHeight;
      fireEvent.scroll(element);
    },
  };
};
