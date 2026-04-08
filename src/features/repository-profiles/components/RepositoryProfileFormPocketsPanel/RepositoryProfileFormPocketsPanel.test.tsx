import { renderWithProviders } from "@/tests/render";
import { createFormik } from "@/tests/formik";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it } from "vitest";
import RepositoryProfileFormPocketsPanel from "./RepositoryProfileFormPocketsPanel";
import { distributions } from "@/tests/mocks/distributions";
import { INITIAL_VALUES } from "../RepositoryProfileForm/constants";
import type { RepositoryProfileFormValues } from "../../types";

const distributionsWithUniquePockets = distributions.slice(0, 2);

describe("RepositoryProfileFormPocketsPanel", () => {
  const user = userEvent.setup();

  const renderWrapper = (values?: Partial<RepositoryProfileFormValues>) => {
    const formik = createFormik<RepositoryProfileFormValues>({
      ...INITIAL_VALUES,
      ...values,
    });
    renderWithProviders(
      <RepositoryProfileFormPocketsPanel
        distributions={distributionsWithUniquePockets}
        formik={formik}
      />,
    );
    return { formik };
  };

  it("renders columns", () => {
    renderWrapper();
    expect(screen.getByText("Distribution")).toBeInTheDocument();
    expect(screen.getByText("Series")).toBeInTheDocument();
    expect(screen.getByText("Pocket")).toBeInTheDocument();
  });

  it("renders pockets and applies search filter", async () => {
    renderWrapper();

    expect(screen.getByText(/distribution 2/i)).toBeInTheDocument();
    await user.type(screen.getByRole("searchbox"), "Pocket 5");
    await user.keyboard("{Enter}");
    expect(screen.getAllByText("Pocket 5").length).toBeGreaterThanOrEqual(1);
  });

  it("shows no pockets found message when search yields no results", async () => {
    renderWrapper();

    await user.type(screen.getByRole("searchbox"), "nonexistent pocket");
    await user.keyboard("{Enter}");
    expect(
      screen.getByText(/No pockets found with the search/i),
    ).toBeInTheDocument();
  });

  it("shows selected number of pockets", async () => {
    const selectedPocket = 125;
    const { formik } = renderWrapper({ pockets: [selectedPocket] });

    expect(screen.getByText("1 selected")).toBeInTheDocument();
    await user.click(screen.getByRole("checkbox", { name: "Pocket 5" }));
    expect(formik.setFieldValue).toHaveBeenCalledWith("pockets", []);
  });
});
