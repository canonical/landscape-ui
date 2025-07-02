import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect } from "vitest";
import Indent from "./Indent";

describe("Indent", () => {
  it("should render", () => {
    const body = "Body";

    renderWithProviders(<Indent>Body</Indent>);

    expect(screen.getByText(body)).toBeInTheDocument();
  });
});
