import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ProfilesEmptyState from "./ProfilesEmptyState";
import { ProfileTypes } from "../../helpers";

describe("ProfilesEmptyState", () => {
  it.each([
    [ProfileTypes.package],
    [ProfileTypes.repository],
    [ProfileTypes.reboot],
    [ProfileTypes.removal],
    [ProfileTypes.script],
    [ProfileTypes.security],
    [ProfileTypes.upgrade],
    [ProfileTypes.wsl],
  ])("renders package message without external link", (type) => {
    renderWithProviders(<ProfilesEmptyState type={type} />);

    expect(
      screen.getByText(`You haven't added any ${type} profiles yet.`),
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("link", {
        name: `How to manage ${type} profiles in Landscape`,
      }),
    ).toHaveAttribute(
      "href",
      expect.stringContaining(`${type.toLocaleLowerCase()}-profile`),
    );

    expect(screen.getByRole("button", { name: "Add profile" })).toHaveIcon(
      "plus",
    );
  });
});
