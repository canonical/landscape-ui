import { renderWithProviders } from "@/tests/render";
import { createFormik } from "@/tests/formik";
import { screen } from "@testing-library/react";
import { describe, it } from "vitest";
import type { RepositoryProfileFormValues } from "../../types";
import { INITIAL_VALUES } from "../RepositoryProfileManageSidePanel/constants";
import RepositoryProfileFormDetailsPanel from "./RepositoryProfileFormDetailsPanel";
import { accessGroups } from "@/tests/mocks/accessGroup";

describe("RepositoryProfileFormDetailsPanel", () => {
  const Wrapper = ({
    isTitleRequired = false,
    isAccessGroupDisabled = false,
  }: {
    readonly isTitleRequired?: boolean;
    readonly isAccessGroupDisabled?: boolean;
  }) => {
    const formik = createFormik<RepositoryProfileFormValues>(INITIAL_VALUES);
    return (
      <RepositoryProfileFormDetailsPanel
        formik={formik}
        accessGroups={accessGroups}
        isTitleRequired={isTitleRequired}
        isAccessGroupDisabled={isAccessGroupDisabled}
      />
    );
  };

  it("renders input fields", () => {
    renderWithProviders(<Wrapper />);
    expect(screen.getByLabelText("Title")).toBeInTheDocument();
    expect(screen.getByLabelText("Description")).toBeInTheDocument();
    expect(screen.getByLabelText("Access group")).toBeInTheDocument();
  });

  it("renders title as required when isTitleRequired is true", async () => {
    renderWithProviders(<Wrapper isTitleRequired />);
    expect(screen.getByLabelText("Title")).toHaveAttribute("required");
  });

  it("renders title as optional when isTitleRequired is false", () => {
    renderWithProviders(<Wrapper />);
    expect(screen.getByLabelText("Title")).not.toHaveAttribute("required");
  });

  it("renders disabled access group when isAccessGroupDisabled is true", () => {
    renderWithProviders(<Wrapper isAccessGroupDisabled />);
    expect(screen.getByLabelText("Access group")).toBeDisabled();
  });

  it("renders enabled access group when isAccessGroupDisabled is false", () => {
    renderWithProviders(<Wrapper />);
    expect(screen.getByLabelText("Access group")).toBeEnabled();
  });
});
