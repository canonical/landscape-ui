import { ComponentProps } from "react";
import { describe, expect, vi } from "vitest";
import UsnPackageList from "./UsnPackageList";
import { renderWithProviders } from "@/tests/render";
import { screen, waitFor } from "@testing-library/react";
import { usnPackages, usns } from "@/tests/mocks/usn";
import userEvent from "@testing-library/user-event";

const limit = 2;
const onLimitChange = vi.fn();

const props: ComponentProps<typeof UsnPackageList> = {
  limit,
  onLimitChange,
  usn: usns[0].usn,
  instanceTitle: "usn-security.lxd",
  showRemoveButton: true,
  usnPackages,
};

describe("UsnPackageList", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should render list", async () => {
    renderWithProviders(<UsnPackageList {...props} />);

    await waitFor(() => {
      usnPackages.forEach((usnPackage, index) => {
        if (index >= props.limit) {
          return;
        }

        expect(screen.getByText(usnPackage.name)).toBeInTheDocument();
        expect(screen.getByText(usnPackage.summary)).toBeInTheDocument();
      });
    });

    expect(
      screen.getByText(
        `Showing ${props.limit} of ${usnPackages.length} packages.`,
      ),
    ).toBeInTheDocument();

    expect(screen.getByText(`Uninstall packages`)).toBeInTheDocument();
  });

  it("should load more packages", async () => {
    const { rerender } = renderWithProviders(<UsnPackageList {...props} />);

    const newLimit = 4;

    onLimitChange.mockImplementationOnce(() => {
      rerender(<UsnPackageList {...props} limit={newLimit} />);
    });

    expect(screen.getAllByRole("rowheader")).toHaveLength(limit);

    await userEvent.click(
      screen.getByText(`Show ${usnPackages.length - props.limit} more`),
    );

    expect(onLimitChange).toHaveBeenCalledOnce();

    expect(screen.getAllByRole("rowheader")).toHaveLength(newLimit);
  });
});
