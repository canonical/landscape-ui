import { expect } from "vitest";
import { screen, waitForElementToBeRemoved } from "@testing-library/react";

export const expectLoadingState = async () => {
  const loadingSpinner = await screen.findByRole("status");
  expect(loadingSpinner).toHaveTextContent("Loading...");
  await waitForElementToBeRemoved(loadingSpinner);
};

export const expectErrorNotification = async () => {
  const errorNotificationCount = (await screen.findAllByText(/error/i)).length;
  expect(errorNotificationCount).toBeGreaterThanOrEqual(1);
};

const originalMatchMedia = window.matchMedia;

const mockMatchMedia = (queries: { query: string; matches: boolean }[]) => {
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

export const setScreenSize = (size: "small" | "large") => {
  if (size === "small") {
    mockMatchMedia([{ query: "(min-width: 620px)", matches: false }]);
  } else {
    mockMatchMedia([{ query: "(min-width: 620px)", matches: true }]);
  }
};

export function resetScreenSize() {
  window.matchMedia = originalMatchMedia;
}
