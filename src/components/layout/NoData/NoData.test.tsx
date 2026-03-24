import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import NoData from "./NoData";
import { NO_DATA_TEXT } from "./constants";

describe("NoData", () => {
  it("renders the no-data text", () => {
    renderWithProviders(<NoData />);
    expect(screen.getByText(NO_DATA_TEXT)).toBeInTheDocument();
  });
});
