import { describe, expect, vi } from "vitest";
import UsnPackageList from "./UsnPackageList";
import { renderWithProviders } from "@/tests/render";
import { screen, waitFor } from "@testing-library/react";
import { expectLoadingState } from "@/tests/helpers";
import { usnPackages, usns } from "@/tests/mocks/usn";
import userEvent from "@testing-library/user-event";

const props = {
  limit: 2,
  onLimitChange: vi.fn(),
  usn: usns[0].usn,
  isRemovable: false as false,
  instanceIds: [],
};

describe("UsnPackageList", () => {
  it("should render list", async () => {
    renderWithProviders(<UsnPackageList {...props} />);

    await expectLoadingState();

    await waitFor(() => {
      usnPackages.forEach((usnPackage, index) => {
        if (index >= props.limit) {
          return;
        }

        expect(screen.getByText(usnPackage.name)).toBeInTheDocument();
        expect(screen.getByText(usnPackage.summary)).toBeInTheDocument();
      });

      expect(
        screen.queryByText(
          `Showing ${props.limit} of ${usnPackages.length} packages.`,
        ),
      ).toBeInTheDocument();
    });
  });

  it("should load more packages", async () => {
    renderWithProviders(<UsnPackageList {...props} />);

    const showMoreButton = await screen.findByText(
      `Show ${usnPackages.length - props.limit} more`,
    );

    expect(showMoreButton).toBeInTheDocument();

    await userEvent.click(showMoreButton);

    expect(props.onLimitChange).toBeCalled();
  });
});
