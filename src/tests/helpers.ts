import { expect } from "vitest";
import { screen, waitForElementToBeRemoved } from "@testing-library/react";
import { BREAKPOINT_PX, COMMON_NUMBERS } from "@/constants";

export const expectLoadingState = async (): Promise<void> => {
  const loadingSpinner = await screen.findByRole("status");
  expect(loadingSpinner).toHaveTextContent("Loading...");
  await waitForElementToBeRemoved(loadingSpinner);
};

export const expectErrorNotification = async (): Promise<void> => {
  const errorNotificationCount = (await screen.findAllByText(/error/i)).length;
  expect(errorNotificationCount).toBeGreaterThanOrEqual(COMMON_NUMBERS.ONE);
};

const originalMatchMedia = window.matchMedia;

const mockMatchMedia = (
  queries: { query: string; matches: boolean }[],
): void => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (q: string) => {
      const match = queries.find((m) => m.query === q);
      return {
        matches: match ? match.matches : false,
        media: q,
        onchange: null,
        addListener: vi.fn(), // Deprecated
        removeListener: vi.fn(), // Deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      };
    },
  });
};

const originalGetBoundingClientRect = Range.prototype.getBoundingClientRect;

export const mockRangeBoundingClientRect = (
  mockFn: () => DOMRect = () => ({
    x: 0,
    y: 0,
    top: 0,
    left: 0,
    bottom: 10,
    right: 100,
    width: 100,
    height: 10,
    toJSON: () => null,
  }),
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
  window.matchMedia = originalMatchMedia;
}
