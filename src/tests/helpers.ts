import { expect, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { BREAKPOINT_PX } from "@/constants";

export const expectLoadingState = async (): Promise<void> => {
  const loadingSpinner = await screen.findByRole("status");
  expect(loadingSpinner).toHaveTextContent("Loading...");
  // Suspense can hide its fallback without removing it from the DOM.
  await waitFor(() => {
    expect(loadingSpinner).not.toBeVisible();
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
 * Stubs IntersectionObserver, which jsdom does not implement. Each observed
 * element receives a single entry with the given intersection state when it
 * is observed; like the real API, no further entries are delivered while that
 * state does not change. Returns a function that restores the original value.
 */
export const mockIntersectionObserver = ({
  isIntersecting = true,
}: { isIntersecting?: boolean } = {}): (() => void) => {
  const hadIntersectionObserver = "IntersectionObserver" in window;
  const originalIntersectionObserver = window.IntersectionObserver;

  class IntersectionObserverMock {
    readonly root = null;
    readonly rootMargin = "0px";
    readonly thresholds = [0];
    readonly unobserve = vi.fn();
    readonly disconnect = vi.fn();
    readonly takeRecords = vi.fn(() => []);
    private readonly callback: IntersectionObserverCallback;

    constructor(callback: IntersectionObserverCallback) {
      this.callback = callback;
    }

    observe(target: Element): void {
      const rect = target.getBoundingClientRect();

      this.callback(
        [
          {
            target,
            isIntersecting,
            intersectionRatio: isIntersecting ? 1 : 0,
            boundingClientRect: rect,
            intersectionRect: rect,
            rootBounds: null,
            time: performance.now(),
          },
        ],
        this as unknown as IntersectionObserver,
      );
    }
  }

  Object.defineProperty(window, "IntersectionObserver", {
    configurable: true,
    writable: true,
    value: IntersectionObserverMock,
  });

  return () => {
    if (hadIntersectionObserver) {
      Object.defineProperty(window, "IntersectionObserver", {
        configurable: true,
        writable: true,
        value: originalIntersectionObserver,
      });
    } else {
      delete (window as Partial<typeof window>).IntersectionObserver;
    }
  };
};
