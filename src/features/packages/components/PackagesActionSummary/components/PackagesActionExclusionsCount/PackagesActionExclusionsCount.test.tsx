import { renderWithProviders } from "@/tests/render";
import { instances } from "@/tests/mocks/instance";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { describe, expect, it } from "vitest";
import PackagesActionExclusionsCount from "./PackagesActionExclusionsCount";

const props: ComponentProps<typeof PackagesActionExclusionsCount> = {
  count: 2,
  id: 1,
  actionType: "install",
  packageName: "libthai0",
};

describe("PackagesActionExclusionsCount", () => {
  it("renders zero instances as plain text without an action", () => {
    renderWithProviders(<PackagesActionExclusionsCount {...props} count={0} />);

    expect(screen.getByText("0 instances")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "0 instances" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("complementary", { name: "Side panel" }),
    ).toHaveClass("is-collapsed");
  });

  it.each([
    ["install", "Instances not installing libthai0"],
    ["remove", "Instances not uninstalling libthai0"],
    ["hold", "Instances not holding libthai0"],
    ["unhold", "Instances not unholding libthai0"],
    [
      "change_version",
      "Instances not changing libthai0 to a different version",
    ],
    ["upgrade", "Instances not upgrading libthai0"],
  ] as const)(
    "opens the exclusions panel with the correct heading for %s",
    async (actionType, heading) => {
      const user = userEvent.setup();
      renderWithProviders(
        <PackagesActionExclusionsCount {...props} actionType={actionType} />,
      );

      const panel = screen.getByRole("complementary", { name: "Side panel" });
      expect(panel).toHaveClass("is-collapsed");

      await user.click(screen.getByRole("button", { name: "2 instances" }));

      expect(
        await screen.findByRole("heading", { name: heading }),
      ).toBeInTheDocument();
      expect(panel).not.toHaveClass("is-collapsed");
      expect(await screen.findByRole("table")).toBeInTheDocument();
    },
  );

  it("renders a singular count and closes the panel without removing the count", async () => {
    const user = userEvent.setup();
    renderWithProviders(<PackagesActionExclusionsCount {...props} count={1} />);

    await user.click(screen.getByRole("button", { name: "1 instance" }));
    const panel = screen.getByRole("complementary", { name: "Side panel" });
    expect(panel).not.toHaveClass("is-collapsed");
    expect(await screen.findByText(instances[0].title)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Close" }));

    await waitFor(() => {
      expect(panel).toHaveClass("is-collapsed");
    });
    expect(
      screen.getByRole("button", { name: "1 instance" }),
    ).toBeInTheDocument();
  });
});
