import { describe, it } from "vitest";
import { renderWithProviders } from "@/tests/render";
import NewSeriesForm from "./NewSeriesForm";
import { getStrippedUrl } from "./helpers";

describe("NewSeriesForm", () => {
  it("renders form", () => {
    const { container } = renderWithProviders(<NewSeriesForm />);
    expect(container).toHaveTexts([
      "Type",
      "Mirror URI",
      "Mirror series",
      "Series name",
      "Mirror GPG key",
      "GPG key",
      "Pockets",
      "Components",
      "Architectures",
      "Include .udeb packages",
    ]);
  });

  it("strips token from url", () => {
    const url1 = "https://username:password@example.com";
    const url2 = "https://bearer:AJ8H8HghkhgeqpvjzHHAVZMhuv981@example.com";
    const url3 = "https://badString:AJ8H8HghkhgeqpvjzHHAVZMhuv981@example.com";
    const url4 = "https://example.com";
    expect(getStrippedUrl(url1)).toBe("https://example.com");
    expect(getStrippedUrl(url2)).toBe("https://example.com");
    expect(getStrippedUrl(url3)).toBe("https://example.com");
    expect(getStrippedUrl(url4)).toBe("https://example.com");
  });
});
