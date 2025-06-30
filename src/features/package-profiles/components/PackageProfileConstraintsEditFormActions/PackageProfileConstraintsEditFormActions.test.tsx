import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { useFormik } from "formik";
import type { ComponentProps } from "react";
import { packageProfiles } from "@/tests/mocks/package-profiles";
import PackageProfileConstraintsEditFormActions from "./PackageProfileConstraintsEditFormActions";
import { INITIAL_VALUES } from "../PackageProfileConstraintsEditForm/constants";

const [profile] = packageProfiles;

const Wrapper = (
  props: Partial<
    ComponentProps<typeof PackageProfileConstraintsEditFormActions>
  >,
) => {
  const formik = useFormik({
    initialValues: INITIAL_VALUES,
    onSubmit: vi.fn(),
  });

  return (
    <PackageProfileConstraintsEditFormActions
      filter=""
      formik={formik}
      onFilterChange={vi.fn()}
      profile={profile}
      selectedIds={[]}
      setSelectedIds={vi.fn()}
      {...props}
    />
  );
};

describe("PackageProfileConstraintsEditFormActions", () => {
  const user = userEvent.setup();

  it("should render all actions", () => {
    renderWithProviders(<Wrapper />);

    expect(
      screen.getByRole("combobox", { name: /Constraint type/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Remove/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /add new constraint/i }),
    ).toBeInTheDocument();
  });

  it("should disable remove button when no constraints are selected", () => {
    renderWithProviders(<Wrapper selectedIds={[]} />);
    expect(screen.getByRole("button", { name: /Remove/i })).toBeDisabled();
  });

  it("should enable remove button when constraints are selected", () => {
    renderWithProviders(<Wrapper selectedIds={[1, 2]} />);
    expect(screen.getByRole("button", { name: /Remove/i })).toBeEnabled();
  });

  it("should show confirmation modal on remove and perform removal", async () => {
    const setSelectedIds = vi.fn();
    renderWithProviders(
      <Wrapper selectedIds={[1]} setSelectedIds={setSelectedIds} />,
    );

    const removeButton = screen.getByRole("button", {
      name: /remove selected constraint/i,
    });
    await user.click(removeButton);

    const confirmationModalTitle =
      await screen.findByText(/remove constraint/i);
    expect(confirmationModalTitle).toBeInTheDocument();

    const confirmButton = screen.getByRole("button", { name: "Remove" });
    expect(confirmButton).toBeInTheDocument();
  });

  it("should open add constraints side panel", async () => {
    renderWithProviders(<Wrapper />);

    const addConstraintsButton = screen.getByRole("button", {
      name: /add new constraint/i,
    });
    await user.click(addConstraintsButton);

    const formTitle = await screen.findByRole("heading", {
      name: `Add package constraints to "${profile.title}" profile`,
    });
    expect(formTitle).toBeInTheDocument();
  });
});
