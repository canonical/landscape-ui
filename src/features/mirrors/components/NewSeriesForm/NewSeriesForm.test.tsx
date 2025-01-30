import { distributions } from "@/tests/mocks/distributions";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { describe, it } from "vitest";
import {
  ARCHITECTURE_OPTIONS,
  DEFAULT_MIRROR_URI,
  PRE_SELECTED_POCKETS,
} from "../../constants";
import NewSeriesForm from "./NewSeriesForm";
import { getStrippedUrl } from "./helpers";

const distribution = distributions[0];

const props: ComponentProps<typeof NewSeriesForm> = {
  distribution: distribution,
  ctaText: "Add series",
};

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

  it("handles ubuntu archive type change correctly", async () => {
    renderWithProviders(
      <NewSeriesForm distribution={distribution} ctaText="Add series" />,
    );
    const typeSelect = screen.getByRole("combobox", { name: /type/i });

    await userEvent.selectOptions(typeSelect, "ubuntu");

    expect(typeSelect).toHaveValue("ubuntu");

    const mirrorUri = screen.getByRole("textbox", { name: /mirror uri/i });
    expect(mirrorUri).toBeVisible();
    expect(mirrorUri).toHaveValue(DEFAULT_MIRROR_URI);

    PRE_SELECTED_POCKETS.ubuntu.forEach((component) => {
      expect(
        screen.getByRole("checkbox", {
          name: component[0].toUpperCase() + component.slice(1),
        }),
      ).toBeChecked();
    });

    ARCHITECTURE_OPTIONS.forEach((architecture) => {
      expect(screen.getByLabelText(architecture.label)).toBeVisible();
    });

    await userEvent.selectOptions(typeSelect, "third-party");
    expect(mirrorUri).toHaveValue("");
  });

  it("handles snapshot type change correctly", async () => {
    renderWithProviders(<NewSeriesForm {...props} />);
    const typeSelect = screen.getByRole("combobox", { name: /type/i });

    await userEvent.selectOptions(typeSelect, "ubuntu-snapshot");

    expect(typeSelect).toHaveValue("ubuntu-snapshot");

    expect(screen.getByText(/snapshot date/i)).toBeVisible();

    const mirrorGPGKey = screen.queryByRole("textbox", {
      name: /mirror gpg key/i,
    });
    expect(mirrorGPGKey).not.toBeInTheDocument();

    PRE_SELECTED_POCKETS.ubuntu.forEach((component) => {
      expect(
        screen.getByRole("checkbox", {
          name: component[0].toUpperCase() + component.slice(1),
        }),
      ).toBeChecked();
    });

    ARCHITECTURE_OPTIONS.forEach((architecture) => {
      expect(screen.getByLabelText(architecture.label)).toBeVisible();
    });
  });

  it("handles third-party type change correctly", async () => {
    renderWithProviders(<NewSeriesForm {...props} />);

    const typeSelect = screen.getByRole("combobox", { name: /type/i });

    await userEvent.selectOptions(typeSelect, "third-party");

    expect(typeSelect).toHaveValue("third-party");

    const componentsInput = screen.getByRole("textbox", {
      name: /components/i,
    });
    const architecturesInput = screen.getByRole("textbox", {
      name: /architectures/i,
    });
    const pocketsInput = screen.getByRole("textbox", {
      name: /pockets/i,
    });
    expect(componentsInput).toBeVisible();
    expect(architecturesInput).toBeVisible();
    expect(pocketsInput).toBeVisible();
  });
});
