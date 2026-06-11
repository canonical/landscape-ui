import type { ComponentProps } from "react";
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

  it("renders an empty-state message when the USN has no affected packages", () => {
    renderWithProviders(<UsnPackageList {...props} usnPackages={[]} />);
    // The expandable table previously rendered a headers-only body when
    // the post-expand fetch returned 0 packages. Now we show a clear
    // empty-state message instead.
    expect(
      screen.getByText(/No packages are currently affected by this USN/i),
    ).toBeInTheDocument();
    expect(screen.queryByRole("rowheader")).not.toBeInTheDocument();
    // Heading stays as the visual anchor so the expanded section reads
    // consistently across loading / empty / data states.
    expect(screen.getByText(/Packages affected by/i)).toBeInTheDocument();
  });

  it("renders the heading + loading state while the package fetch is in flight", () => {
    renderWithProviders(
      <UsnPackageList {...props} isLoading usnPackages={[]} />,
    );
    // The heading stays anchored — the user always knows which USN is
    // being inspected, even before data arrives.
    expect(screen.getByText(/Packages affected by/i)).toBeInTheDocument();
    // LoadingState renders an element with role="status".
    expect(screen.getByRole("status")).toBeInTheDocument();
    // No empty-state copy and no table while loading.
    expect(
      screen.queryByText(/No packages are currently affected/i),
    ).not.toBeInTheDocument();
    expect(screen.queryByRole("rowheader")).not.toBeInTheDocument();
  });
});
