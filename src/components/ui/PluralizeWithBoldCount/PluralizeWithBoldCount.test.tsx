import { describe, expect, it } from "vitest";
import { getByRole } from "@testing-library/react";
import { renderWithProviders } from "@/tests/render";
import PluralizeWithBoldCount from "./PluralizeWithBoldCount";

describe("PluralizeWithBoldCount", () => {
  it("uses singular form", () => {
    const { container } = renderWithProviders(
      <PluralizeWithBoldCount count={1} singular="singular" />,
    );

    expect(container).toHaveTextContent("1 singular");
    expect(getByRole(container, "strong")).toHaveTextContent("1");
  });

  it("uses default plural form", () => {
    const { container } = renderWithProviders(
      <PluralizeWithBoldCount count={20000} singular="singular" />,
    );

    expect(container).toHaveTextContent("20,000 singulars");
    expect(getByRole(container, "strong")).toHaveTextContent("20,000");
  });

  it("uses given plural form", () => {
    const { container } = renderWithProviders(
      <PluralizeWithBoldCount count={0} singular="singular" plural="plural" />,
    );

    expect(container).toHaveTextContent("0 plural");
    expect(getByRole(container, "strong")).toHaveTextContent("0");
  });
});
