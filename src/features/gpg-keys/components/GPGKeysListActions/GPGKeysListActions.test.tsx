import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, assert } from "vitest";
import { renderWithProviders } from "@/tests/render";
import GPGKeysListActions from "./GPGKeysListActions";
import { gpgKeys } from "@/tests/mocks/gpgKey";

describe("GPGKeysListActions", () => {
  const user = userEvent.setup();
  const [gpgKey] = gpgKeys;
  assert(gpgKey);

  it("renders the actions toggle button", () => {
    renderWithProviders(<GPGKeysListActions gpgKey={gpgKey} />);

    expect(
      screen.getByRole("button", { name: `${gpgKey.name} GPG key actions` }),
    ).toBeInTheDocument();
  });

  it("opens delete confirmation modal when Remove is clicked", async () => {
    renderWithProviders(<GPGKeysListActions gpgKey={gpgKey} />);

    await user.click(
      screen.getByRole("button", { name: `${gpgKey.name} GPG key actions` }),
    );

    await user.click(
      screen.getByRole("menuitem", { name: `Remove ${gpgKey.name} GPG key` }),
    );

    expect(await screen.findByRole("dialog")).toBeInTheDocument();

    expect(screen.getByText(/are you sure/i)).toBeInTheDocument();
  });
});
