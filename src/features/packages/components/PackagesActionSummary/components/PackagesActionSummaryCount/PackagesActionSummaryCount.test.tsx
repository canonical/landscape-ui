import { renderWithProviders } from "@/tests/render";
import { instances } from "@/tests/mocks/instance";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { describe, expect, it } from "vitest";
import type { PackageChangePlanAction } from "../../../../types";
import PackagesActionSummaryCount from "./PackagesActionSummaryCount";
import classes from "@/components/layout/SidePanel/SidePanel.module.scss";

const currentPackage = { id: 15, name: "libthai0", version: "0.1.9-1" };
const targetPackage = { id: 16, name: "libthai0", version: "0.1.10-1" };
const props: ComponentProps<typeof PackagesActionSummaryCount> = {
  count: 2,
  id: 1,
  action: { type: "install", package: currentPackage },
};

const actions = [
  {
    action: { type: "install", package: currentPackage },
    heading: "Instances installing libthai0 0.1.9-1",
  },
  {
    action: { type: "remove", package: currentPackage },
    heading: "Instances uninstalling libthai0 0.1.9-1",
  },
  {
    action: { type: "hold", package: currentPackage },
    heading: "Instances holding libthai0 0.1.9-1",
  },
  {
    action: { type: "unhold", package: currentPackage },
    heading: "Instances unholding libthai0 0.1.9-1",
  },
  {
    action: {
      type: "change_version",
      from_package: currentPackage,
      to_package: targetPackage,
    },
    heading: "Instances changing libthai0 from 0.1.9-1 to 0.1.10-1",
  },
  {
    action: { type: "upgrade", to_package: targetPackage },
    heading: "Instances upgrading libthai0 to 0.1.10-1",
  },
] satisfies { action: PackageChangePlanAction; heading: string }[];

describe("PackagesActionSummaryCount", () => {
  it("renders zero instances as plain text with the panel closed", () => {
    renderWithProviders(<PackagesActionSummaryCount {...props} count={0} />);

    expect(screen.getByText("0 instances")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "0 instances" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("complementary", { name: "Side panel" }),
    ).toHaveClass("is-collapsed");
  });

  it.each(actions)(
    "opens the panel with the correct heading for $action.type",
    async ({ action, heading }) => {
      const user = userEvent.setup();
      renderWithProviders(
        <PackagesActionSummaryCount {...props} action={action} />,
      );

      const panel = screen.getByRole("complementary", { name: "Side panel" });
      expect(panel).toHaveClass("is-collapsed");

      await user.click(screen.getByRole("button", { name: "2 instances" }));

      expect(panel).not.toHaveClass("is-collapsed");
      expect(
        screen.getByRole("heading", { name: heading }),
      ).toBeInTheDocument();
      expect(await screen.findByText(instances[0].title)).toBeInTheDocument();
    },
  );

  it("opens a large panel for a singular count and closes it without removing the count", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <PackagesActionSummaryCount {...props} count={1} size="large" />,
    );

    await user.click(screen.getByRole("button", { name: "1 instance" }));

    const panel = screen.getByRole("complementary", { name: "Side panel" });
    expect(panel).not.toHaveClass("is-collapsed");
    expect(panel).toHaveClass(classes.large);
    expect(await screen.findByRole("table")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Close" }));

    await waitFor(() => {
      expect(panel).toHaveClass("is-collapsed");
    });
    expect(
      screen.getByRole("button", { name: "1 instance" }),
    ).toBeInTheDocument();
  });
});
