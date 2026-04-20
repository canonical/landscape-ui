import { expectLoadingState } from "@/tests/helpers";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { listPockets, pockets } from "@/tests/mocks/pockets";
import { renderWithProviders } from "@/tests/render";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { waitFor } from "@testing-library/react";
import { describe, expect } from "vitest";
import PackageList from "./PackageList";

const mirrorPocket = pockets.find((p) => p.mode === "mirror");
assert(mirrorPocket);
const mirrorPocketProps: ComponentProps<typeof PackageList> = {
  distributionName: "Ubuntu",
  seriesName: "Focal Fossa",
  pocket: mirrorPocket,
};

const uploadPocket = pockets.find((p) => p.mode === "upload");
assert(uploadPocket);
const uploadPocketProps: ComponentProps<typeof PackageList> = {
  distributionName: "Ubuntu",
  seriesName: "Focal Fossa",
  pocket: uploadPocket,
};

const pullPocket = pockets.find((p) => p.mode === "pull" && p.filter_type);
assert(pullPocket);
const pullPocketProps: ComponentProps<typeof PackageList> = {
  distributionName: "Ubuntu",
  seriesName: "Focal Fossa",
  pocket: pullPocket,
};
describe("PackageList", () => {
  beforeEach(() => {
    setEndpointStatus("default");
  });

  it("renders common buttons", () => {
    renderWithProviders(<PackageList {...mirrorPocketProps} />);
    expect(screen.getByRole("button", { name: /edit/i })).toBeVisible();
    expect(screen.getByRole("button", { name: /remove/i })).toBeVisible();
  });

  it("renders correct mirror conditionals", async () => {
    renderWithProviders(<PackageList {...mirrorPocketProps} />);
    expect(screen.getByRole("button", { name: /sync/i })).toBeVisible();
    await expectLoadingState();

    expect(screen.getByRole("searchbox", { name: /search/i })).toBeVisible();
  });

  it("renders correct pull conditionals", async () => {
    renderWithProviders(<PackageList {...pullPocketProps} />);
    expect(screen.getByRole("button", { name: /pull/i })).toBeVisible();

    await expectLoadingState();
    expect(screen.getByRole("searchbox", { name: /search/i })).toBeVisible();
  });

  it("renders table with correct columns for mirror pocket", async () => {
    renderWithProviders(<PackageList {...mirrorPocketProps} />);

    await expectLoadingState();
    expect(screen.getByText("Package")).toBeVisible();

    const checkboxes = screen.queryAllByRole("checkbox");
    expect(checkboxes.length).toEqual(0);
  });

  it("renders table with correct columns", async () => {
    renderWithProviders(<PackageList {...uploadPocketProps} />);

    await expectLoadingState();
    const toggleAllCheckbox = screen.getByRole("checkbox", {
      name: /toggle all/i,
    });
    expect(toggleAllCheckbox).toBeVisible();

    const rowCheckboxes = screen.getAllByRole("checkbox").length - 1;
    expect(rowCheckboxes).toEqual(listPockets.length);
  });

  it("does not show sync or search controls for upload pocket", async () => {
    renderWithProviders(<PackageList {...uploadPocketProps} />);

    await expectLoadingState();

    expect(
      screen.queryByRole("button", { name: /^sync$/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /^pull$/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("searchbox", { name: /package search/i }),
    ).not.toBeInTheDocument();
  });

  it("renders empty state when no packages are returned", async () => {
    setEndpointStatus("empty");

    renderWithProviders(<PackageList {...mirrorPocketProps} />);

    await expectLoadingState();

    expect(screen.getByText("No packages found")).toBeInTheDocument();
    expect(
      screen.queryByRole("searchbox", { name: /package search/i }),
    ).not.toBeInTheDocument();
  });

  it("opens the edit side panel from actions", async () => {
    const user = userEvent.setup();
    renderWithProviders(<PackageList {...mirrorPocketProps} />);

    await user.click(screen.getByRole("button", { name: /edit/i }));

    expect(
      await screen.findByRole("heading", { name: /edit .* pocket/i }),
    ).toBeInTheDocument();
  });

  it("removes pocket successfully", async () => {
    const user = userEvent.setup();
    renderWithProviders(<PackageList {...mirrorPocketProps} />);

    await user.click(
      screen.getByRole("button", {
        name: `Remove ${mirrorPocketProps.pocket.name} pocket of ${mirrorPocketProps.distributionName}/${mirrorPocketProps.seriesName}`,
      }),
    );
    const dialog = screen.getByRole("dialog", { name: "Deleting pocket" });
    await user.click(within(dialog).getByRole("button", { name: "Delete" }));

    await waitFor(() => {
      expect(
        screen.queryByRole("dialog", { name: "Deleting pocket" }),
      ).not.toBeInTheDocument();
    });
  });

  it("submits mirror sync confirmation flow", async () => {
    const user = userEvent.setup();
    renderWithProviders(<PackageList {...mirrorPocketProps} />);

    await user.click(
      screen.getByRole("button", {
        name: new RegExp(
          `Synchronize ${mirrorPocketProps.pocket.name} pocket of ${mirrorPocketProps.distributionName}/${mirrorPocketProps.seriesName}`,
          "i",
        ),
      }),
    );

    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
  });

  it("submits pull sync flow", async () => {
    const user = userEvent.setup();
    renderWithProviders(<PackageList {...pullPocketProps} />);

    await user.click(
      screen.getByRole("button", {
        name: new RegExp(
          `Pull packages to ${pullPocketProps.pocket.name} pocket of ${pullPocketProps.distributionName}/${pullPocketProps.seriesName}`,
          "i",
        ),
      }),
    );

    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
  });

  it("renders pull package diffs with updates and deletions", async () => {
    setEndpointStatus({ status: "default", path: "DiffPullPocketUpdate" });
    renderWithProviders(<PackageList {...pullPocketProps} />);

    await expectLoadingState();
    await waitFor(() => {
      expect(
        document.querySelectorAll(".p-icon--warning").length,
      ).toBeGreaterThan(0);
    });
  });

  it("renders pull package list when diffs contain only additions", async () => {
    setEndpointStatus({ status: "default", path: "DiffPullPocketAddOnly" });

    renderWithProviders(<PackageList {...pullPocketProps} />);
    await expectLoadingState();

    expect(await screen.findByText("pocket1")).toBeInTheDocument();
    expect(document.querySelector(".p-icon--warning")).not.toBeInTheDocument();
  });

  it("submits upload remove-packages flow", async () => {
    const user = userEvent.setup();
    const [firstPackage] = listPockets;
    assert(firstPackage);
    renderWithProviders(<PackageList {...uploadPocketProps} />);

    await expectLoadingState();
    await user.click(screen.getByLabelText(firstPackage.name));
    await user.click(
      screen.getByRole("button", { name: /remove selected packages from/i }),
    );
    const dialog = screen.getByRole("dialog", {
      name: /deleting packages from pocket/i,
    });
    await user.click(within(dialog).getByRole("button", { name: /^delete$/i }));

    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
  });

  it("searches and clears package search", async () => {
    const user = userEvent.setup();
    renderWithProviders(<PackageList {...mirrorPocketProps} />);

    await expectLoadingState();

    const searchInput = screen.getByRole("searchbox", {
      name: /package search/i,
    });
    await user.type(searchInput, "pocket1{enter}");
    expect(searchInput).toHaveValue("pocket1");

    await user.click(
      screen.getByRole("button", { name: /clear search field/i }),
    );
    expect(searchInput).toHaveValue("");
  });

  it("resets selected packages when paginating upload list", async () => {
    const user = userEvent.setup();
    setEndpointStatus({ status: "default", path: "ListPocketMany" });
    renderWithProviders(<PackageList {...uploadPocketProps} />);

    await screen.findByRole("checkbox", { name: "Toggle all" });
    const [, firstRowCheckbox] = screen.getAllByRole("checkbox");
    assert(firstRowCheckbox);
    await user.click(firstRowCheckbox);
    await user.click(screen.getByRole("button", { name: /next page/i }));
    await user.click(screen.getByRole("button", { name: /previous page/i }));

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /remove selected packages from/i }),
      ).toHaveAttribute("aria-disabled", "true");
    });
  });

  it("changes page size via pagination select", async () => {
    const user = userEvent.setup();
    setEndpointStatus({ status: "default", path: "ListPocketMany" });
    renderWithProviders(<PackageList {...uploadPocketProps} />);

    await screen.findByRole("combobox", { name: "Instances per page" });
    await user.selectOptions(
      screen.getByRole("combobox", { name: "Instances per page" }),
      "50",
    );

    expect(
      screen.queryByRole("button", { name: /next page/i }),
    ).not.toBeInTheDocument();
  });

  it("shows error notification when removing pocket fails", async () => {
    const user = userEvent.setup();
    setEndpointStatus({ status: "error", path: "RemovePocket" });
    renderWithProviders(<PackageList {...mirrorPocketProps} />);

    await user.click(
      screen.getByRole("button", {
        name: `Remove ${mirrorPocketProps.pocket.name} pocket of ${mirrorPocketProps.distributionName}/${mirrorPocketProps.seriesName}`,
      }),
    );
    const dialog = screen.getByRole("dialog", { name: "Deleting pocket" });
    await user.click(within(dialog).getByRole("button", { name: "Delete" }));

    expect(
      await screen.findByText('The endpoint status is set to "error".'),
    ).toBeInTheDocument();
  });

  it("shows error notification when removing packages fails", async () => {
    const user = userEvent.setup();
    setEndpointStatus({ status: "error", path: "RemovePackagesFromPocket" });
    renderWithProviders(<PackageList {...uploadPocketProps} />);

    const [firstPocket] = listPockets;
    assert(firstPocket);
    await screen.findByRole("checkbox", { name: firstPocket.name });
    await user.click(screen.getByLabelText(firstPocket.name));
    await user.click(
      screen.getByRole("button", { name: /remove selected packages from/i }),
    );
    const dialog = screen.getByRole("dialog", {
      name: /deleting packages from pocket/i,
    });
    await user.click(within(dialog).getByRole("button", { name: /^delete$/i }));

    expect(
      await screen.findByText('The endpoint status is set to "error".'),
    ).toBeInTheDocument();
  });
});
