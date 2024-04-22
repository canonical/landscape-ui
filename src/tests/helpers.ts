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
