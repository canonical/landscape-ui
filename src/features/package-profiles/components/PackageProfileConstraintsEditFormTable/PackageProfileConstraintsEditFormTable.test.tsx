import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { useFormik } from "formik";
import type { ComponentProps } from "react";
import { packageProfiles } from "@/tests/mocks/package-profiles";
import PackageProfileConstraintsEditFormTable from "./PackageProfileConstraintsEditFormTable";
import { INITIAL_VALUES } from "../PackageProfileConstraintsEditForm/constants";

const [profile] = packageProfiles;

const Wrapper = (
  props: Partial<ComponentProps<typeof PackageProfileConstraintsEditFormTable>>,
) => {
  const formik = useFormik({
    initialValues: INITIAL_VALUES,
    onSubmit: vi.fn(),
  });

  return (
    <PackageProfileConstraintsEditFormTable
      filter=""
      formik={formik}
      isConstraintsLoading={false}
      onSelectedIdsChange={vi.fn()}
      pageSize={20}
      profileConstraints={profile.constraints}
      search=""
      selectedIds={[]}
      {...props}
    />
  );
};

describe("PackageProfileConstraintsEditFormTable", () => {
  const user = userEvent.setup();

  it("should render the table with constraints", () => {
    renderWithProviders(<Wrapper />);

    expect(
      screen.getByRole("columnheader", { name: /Constraint/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "Package" }),
    ).toBeInTheDocument();

    for (const constraint of profile.constraints) {
      expect(
        screen.getByRole("rowheader", { name: constraint.package }),
      ).toBeInTheDocument();
    }
  });

  it("should handle selecting all constraints", async () => {
    const onSelectedIdsChange = vi.fn();

    renderWithProviders(<Wrapper onSelectedIdsChange={onSelectedIdsChange} />);

    const selectAllCheckbox = screen.getByRole("checkbox", {
      name: "Toggle all constraints",
    });
    await user.click(selectAllCheckbox);

    expect(onSelectedIdsChange).toHaveBeenCalledWith(
      profile.constraints.map((constraint) => constraint.id),
    );
  });

  it("should handle deselecting all constraints", async () => {
    const onSelectedIdsChange = vi.fn();
    renderWithProviders(
      <Wrapper
        onSelectedIdsChange={onSelectedIdsChange}
        selectedIds={profile.constraints.map((constraint) => constraint.id)}
      />,
    );

    const selectAllCheckbox = screen.getByRole("checkbox", {
      name: "Toggle all constraints",
    });
    await user.click(selectAllCheckbox);

    expect(onSelectedIdsChange).toHaveBeenCalledWith([]);
  });

  it("should handle selecting a single constraint", async () => {
    const onSelectedIdsChange = vi.fn();
    renderWithProviders(<Wrapper onSelectedIdsChange={onSelectedIdsChange} />);

    const [firstConstraint] = profile.constraints;
    const firstCheckbox = screen.getByRole("checkbox", {
      name: `Toggle ${firstConstraint.package} constraint`,
    });

    await user.click(firstCheckbox);

    expect(onSelectedIdsChange).toHaveBeenCalledWith([firstConstraint.id]);
  });
});
