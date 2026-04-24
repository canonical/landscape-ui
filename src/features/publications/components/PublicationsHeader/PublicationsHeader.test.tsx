import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PublicationsHeader from "./PublicationsHeader";

describe("PublicationsHeader", () => {
  it("renders search input", () => {
    renderWithProviders(<PublicationsHeader />);

    expect(screen.getByRole("searchbox")).toBeInTheDocument();
  });
});
