import { setEndpointStatus } from "@/tests/controllers/controller";
import { packageProfiles } from "@/tests/mocks/package-profiles";
import { renderWithProviders } from "@/tests/render";
import { ENDPOINT_STATUS_API_ERROR_MESSAGE } from "@/tests/server/handlers/_constants";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useFormik } from "formik";
import type { ComponentProps, FC } from "react";
import { describe, expect } from "vitest";
import type { Constraint } from "../../types";
import PackageProfileConstraintsEditFormActions from "./PackageProfileConstraintsEditFormActions";

type TestComponentProps = Omit<
  ComponentProps<typeof PackageProfileConstraintsEditFormActions>,
  "formik"
>;

const defaultProps: TestComponentProps = {
  filter: "",
  onFilterChange: vi.fn(),
  profile: packageProfiles[0],
  selectedIds: [packageProfiles[0].constraints[0].id],
  setSelectedIds: vi.fn(),
};

const TestComponent: FC<TestComponentProps> = (props) => {
  const formik = useFormik<Constraint>({
    initialValues: {
      constraint: "",
      id: 0,
      notAnyVersion: false,
      package: "",
      rule: "",
      version: "",
    },
    onSubmit: () => undefined,
  });

  return (
    <PackageProfileConstraintsEditFormActions formik={formik} {...props} />
  );
};

describe("PackageProfileConstraintsEditFormActions", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("removes constraints", async () => {
    renderWithProviders(<TestComponent {...defaultProps} />);

    await user.click(
      screen.getByRole("button", {
        name: "Remove selected constraint",
      }),
    );
    expect(
      screen.getByRole("heading", { name: "Remove constraint" }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Remove" }));
    expect(defaultProps.setSelectedIds).toHaveBeenCalledExactlyOnceWith([]);
  });

  it("catches errors while removing constraints", async () => {
    renderWithProviders(<TestComponent {...defaultProps} />);

    setEndpointStatus("error");

    await user.click(
      screen.getByRole("button", {
        name: "Remove selected constraint",
      }),
    );
    expect(
      screen.getByRole("heading", { name: "Remove constraint" }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Remove" }));
    expect(defaultProps.setSelectedIds).not.toHaveBeenCalled();
    expect(
      await screen.findByText(ENDPOINT_STATUS_API_ERROR_MESSAGE),
    ).toBeInTheDocument();
  });

  it("changes the filter", async () => {
    renderWithProviders(<TestComponent {...defaultProps} />);

    await user.selectOptions(
      screen.getByRole("combobox", { name: "Constraint type" }),
      "conflicts",
    );
    expect(defaultProps.onFilterChange).toHaveBeenCalledExactlyOnceWith(
      "conflicts",
    );
  });
});
