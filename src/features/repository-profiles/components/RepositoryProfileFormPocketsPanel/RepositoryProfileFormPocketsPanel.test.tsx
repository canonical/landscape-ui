import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it } from "vitest";
import RepositoryProfileFormPocketsPanel from "./RepositoryProfileFormPocketsPanel";
import { distributions } from "@/tests/mocks/distributions";
import { INITIAL_VALUES } from "../RepositoryProfileForm/constants";
import type { RepositoryProfileFormValues } from "../../types";
import { useFormik } from "formik";

const distributionsWithUniquePockets = distributions.slice(0, 2);

describe("RepositoryProfileFormPocketsPanel", () => {
  const user = userEvent.setup();

  const Wrapper = () => {
    const formik = useFormik<RepositoryProfileFormValues>({
      initialValues: INITIAL_VALUES,
      onSubmit: vi.fn(),
    });
    return (
      <RepositoryProfileFormPocketsPanel
        distributions={distributionsWithUniquePockets}
        formik={formik}
      />
    );
  };

  it("renders columns", () => {
    renderWithProviders(<Wrapper />);
    expect(screen.getByText("Distribution")).toBeInTheDocument();
    expect(screen.getByText("Series")).toBeInTheDocument();
    expect(screen.getByText("Pocket")).toBeInTheDocument();
  });

  it("renders pockets and applies search filter", async () => {
    renderWithProviders(<Wrapper />);

    expect(screen.getByText(/distribution 2/i)).toBeInTheDocument();
    await user.type(screen.getByRole("searchbox"), "Pocket 5");
    await user.keyboard("{Enter}");
    expect(screen.getAllByText("Pocket 5").length).toBeGreaterThanOrEqual(1);
  });

  it("shows no pockets found message when search yields no results", async () => {
    renderWithProviders(<Wrapper />);

    await user.type(screen.getByRole("searchbox"), "nonexistent pocket");
    await user.keyboard("{Enter}");
    expect(
      screen.getByText(/No pockets found with the search/i),
    ).toBeInTheDocument();
  });

  it("shows selected number of pockets", async () => {
    renderWithProviders(<Wrapper />);

    expect(screen.getByText("0 selected")).toBeInTheDocument();
    await user.click(screen.getByRole("checkbox", { name: "Pocket 5" }));
    expect(screen.getByText("1 selected")).toBeInTheDocument();
  });
});
