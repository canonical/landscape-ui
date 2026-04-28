import { aptSources } from "@/tests/mocks/apt-sources";
import { createFormik } from "@/tests/formik";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it } from "vitest";
import type { RepositoryProfileFormValues } from "../../types";
import { INITIAL_VALUES } from "../RepositoryProfileForm/constants";
import RepositoryProfileFormAptSourcesPanel from "./RepositoryProfileFormAptSourcesPanel";

describe("RepositoryProfileFormAptSourcesPanel", () => {
  const user = userEvent.setup();

  const renderWrapper = (values?: Partial<RepositoryProfileFormValues>) => {
    const formik = createFormik<RepositoryProfileFormValues>({
      ...INITIAL_VALUES,
      ...values,
    });
    renderWithProviders(
      <RepositoryProfileFormAptSourcesPanel
        formik={formik}
        aptSources={aptSources}
      />,
    );
    return { formik };
  };

  it("shows columns", () => {
    renderWrapper();
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Line")).toBeInTheDocument();
  });

  it("filters APT sources and toggles selection", async () => {
    renderWrapper();

    expect(screen.getByText("source1")).toBeInTheDocument();

    const searchInput = screen.getByRole("searchbox");
    await user.type(searchInput, "source1");
    await user.keyboard("{Enter}");
    expect(screen.queryByText("source2")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Reset search" }));
    expect(screen.getByText("source2")).toBeInTheDocument();
  });

  it("selects and deselects APT sources", async () => {
    const { formik } = renderWrapper({ apt_sources: [aptSources[1]] });

    const sourceCheckbox = screen.getByRole("checkbox", { name: "source1" });
    const selectedCheckbox = screen.getByRole("checkbox", { name: "source2" });
    expect(sourceCheckbox).not.toBeChecked();
    expect(selectedCheckbox).toBeChecked();

    await user.click(sourceCheckbox);
    expect(formik.setFieldValue).toHaveBeenCalledWith("apt_sources", [
      aptSources[1],
      aptSources[0],
    ]);

    await user.click(selectedCheckbox);
    expect(formik.setFieldValue).toHaveBeenCalledWith("apt_sources", [
      aptSources[0],
    ]);
  });

  it("shows empty state when no APT sources match search", async () => {
    renderWrapper();

    const searchInput = screen.getByRole("searchbox");
    await user.type(searchInput, "nonexistent");
    await user.keyboard("{Enter}");

    expect(
      screen.getByText(/No APT sources found with the search/i),
    ).toBeInTheDocument();
  });
});
