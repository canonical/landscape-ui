import { aptSources } from "@/tests/mocks/apt-sources";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useFormik } from "formik";
import { describe, it } from "vitest";
import type { RepositoryProfileFormValues } from "../../types";
import { INITIAL_VALUES } from "../RepositoryProfileForm/constants";
import RepositoryProfileFormAptSourcesPanel from "./RepositoryProfileFormAptSourcesPanel";

describe("RepositoryProfileFormAptSourcesPanel", () => {
  const user = userEvent.setup();

  const Wrapper = () => {
    const formik = useFormik<RepositoryProfileFormValues>({
      initialValues: INITIAL_VALUES,
      onSubmit: vi.fn(),
    });
    return (
      <RepositoryProfileFormAptSourcesPanel
        formik={formik}
        aptSources={aptSources}
      />
    );
  };

  it("shows columns", () => {
    renderWithProviders(<Wrapper />);
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Line")).toBeInTheDocument();
  });

  it("filters APT sources and toggles selection", async () => {
    renderWithProviders(<Wrapper />);

    expect(screen.getByText("source1")).toBeInTheDocument();

    const searchInput = screen.getByRole("searchbox");
    await user.type(searchInput, "source1");
    await user.keyboard("{Enter}");
    expect(screen.queryByText("source2")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Reset search" }));
    expect(screen.getByText("source2")).toBeInTheDocument();
  });

  it("selects and deselects APT sources", async () => {
    renderWithProviders(<Wrapper />);

    const checkbox = screen.getByRole("checkbox", { name: "source1" });
    expect(checkbox).not.toBeChecked();

    await user.click(checkbox);
    expect(checkbox).toBeChecked();

    await user.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  it("shows empty state when no APT sources match search", async () => {
    renderWithProviders(<Wrapper />);

    const searchInput = screen.getByRole("searchbox");
    await user.type(searchInput, "nonexistent");
    await user.keyboard("{Enter}");

    expect(
      screen.getByText(/No APT sources found with the search/i),
    ).toBeInTheDocument();
  });
});
