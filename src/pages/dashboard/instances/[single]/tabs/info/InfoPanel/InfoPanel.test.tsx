import { describe, expect } from "vitest";
import InfoPanel from "./InfoPanel";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/tests/render";
import { instances } from "@/tests/mocks/instance";

beforeEach(() => {
  renderWithProviders(<InfoPanel instance={instances[0]} />);
});

describe("InfoPanel", () => {
  it("should render instance info", () => {
    expect(screen.getByText(instances[0].title)).toBeVisible();
  });
});
