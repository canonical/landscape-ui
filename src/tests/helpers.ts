import { expect } from "vitest";
import { screen } from "@testing-library/react";

export const expectLoadingState = () =>
  expect(screen.getByRole("status")).toHaveTextContent("Loading...");
