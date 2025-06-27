import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { useFormik } from "formik";
import { describe, it } from "vitest";
import type { RepositoryProfileFormValues } from "../../types";
import { INITIAL_VALUES } from "../RepositoryProfileForm/constants";
import RepositoryProfileFormDetailsPanel from "./RepositoryProfileFormDetailsPanel";
import { accessGroups } from "@/tests/mocks/accessGroup";

describe("RepositoryProfileFormDetailsPanel", () => {
  const Wrapper = ({
    isTitleRequired = false,
  }: {
    readonly isTitleRequired?: boolean;
  }) => {
    const formik = useFormik<RepositoryProfileFormValues>({
      initialValues: INITIAL_VALUES,
      onSubmit: vi.fn(),
    });
    return (
      <RepositoryProfileFormDetailsPanel
        formik={formik}
        accessGroups={accessGroups}
        isTitleRequired={isTitleRequired}
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
});
