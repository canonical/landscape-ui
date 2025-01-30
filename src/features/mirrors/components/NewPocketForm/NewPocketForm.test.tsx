import { distributions } from "@/tests/mocks/distributions";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import {
  ARCHITECTURE_OPTIONS,
  COMPONENT_OPTIONS,
  DEFAULT_MIRROR_URI,
} from "../../constants";
import NewPocketForm from "./NewPocketForm";

const props: ComponentProps<typeof NewPocketForm> = {
  distribution:
    distributions.find((d) => d.series.length > 0) ?? distributions[0],
  series:
    distributions.find((d) => d.series.length > 0)?.series[0] ??
    distributions[0].series[0],
};

describe("NewPocketForm", () => {
  it("renders basic form fields for mirror pocket", () => {
    const { container } = renderWithProviders(<NewPocketForm {...props} />);
    expect(container).toHaveTexts(["Type", "Mode", "Name", "GPG Key"]);

    expect(screen.getByText("Include .udeb packages")).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /add pocket/i,
      }),
    ).toBeVisible();
  });

  it("handles mirror mode change correctly", async () => {
    renderWithProviders(<NewPocketForm {...props} />);
    const modeSelect = screen.getByRole("combobox", { name: /mode/i });
    const typeSelect = screen.getByRole("combobox", { name: /type/i });

    await userEvent.selectOptions(typeSelect, "ubuntu");
    await userEvent.selectOptions(modeSelect, "mirror");

    expect(modeSelect).toHaveValue("mirror");

    const mirrorUri = screen.getByRole("textbox", { name: /mirror uri/i });
    expect(mirrorUri).toBeVisible();
    expect(mirrorUri).toHaveValue(DEFAULT_MIRROR_URI);

    await userEvent.selectOptions(typeSelect, "third-party");
    expect(mirrorUri).toHaveValue("");
  });

  it("handles pull mode change correctly", async () => {
    renderWithProviders(<NewPocketForm {...props} />);

    const modeSelect = screen.getByRole("combobox", { name: /mode/i });
    await userEvent.selectOptions(modeSelect, "pull");

    expect(modeSelect).toHaveValue("pull");

    expect(screen.getByText("Pull from")).toBeVisible();

    const filterTypeSelect = screen.getByRole("combobox", {
      name: /filter type/i,
    });
    expect(filterTypeSelect).toBeVisible();

    const filterPackages = screen.queryByText("Filter packages");
    expect(filterPackages).not.toBeInTheDocument();

    await userEvent.selectOptions(filterTypeSelect, "Allow list");

    expect(screen.getByText("Filter packages")).toBeVisible();
  });

  it("handles upload mode change correctly", async () => {
    renderWithProviders(<NewPocketForm {...props} />);

    const modeSelect = screen.getByRole("combobox", { name: /mode/i });
    await userEvent.selectOptions(modeSelect, "upload");

    expect(modeSelect).toHaveValue("upload");

    expect(
      screen.getByText("Allow uploaded packages to be unsigned"),
    ).toBeVisible();
    expect(screen.getByText("Uploader GPG keys")).toBeVisible();
  });

  it("handles ubuntu type change correctly", async () => {
    renderWithProviders(<NewPocketForm {...props} />);

    const typeSelect = screen.getByRole("combobox", { name: /type/i });
    await userEvent.selectOptions(typeSelect, "ubuntu");

    expect(typeSelect).toHaveValue("ubuntu");

    COMPONENT_OPTIONS.forEach((component) => {
      expect(screen.getByLabelText(component.label)).toBeVisible();
    });

    ARCHITECTURE_OPTIONS.forEach((architecture) => {
      expect(screen.getByLabelText(architecture.label)).toBeVisible();
    });
  });

  it("handles third-party type change correctly", async () => {
    renderWithProviders(<NewPocketForm {...props} />);

    const typeSelect = screen.getByRole("combobox", { name: /type/i });
    await userEvent.selectOptions(typeSelect, "third-party");

    expect(typeSelect).toHaveValue("third-party");

    const componentsInput = screen.getByRole("textbox", {
      name: /components/i,
    });
    const architecturesInput = screen.getByRole("textbox", {
      name: /architectures/i,
    });
    expect(componentsInput).toBeVisible();
    expect(architecturesInput).toBeVisible();
  });
});
