import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, assert, beforeEach } from "vitest";
import { renderWithProviders } from "@/tests/render";
import { setEndpointStatus } from "@/tests/controllers/controller";
import GPGKeysListActions from "./GPGKeysListActions";
import { gpgKeys } from "@/tests/mocks/gpgKey";

describe("GPGKeysListActions", () => {
  const user = userEvent.setup();
  const [gpgKey] = gpgKeys;
  assert(gpgKey);

  beforeEach(() => {
    setEndpointStatus("default");
  });

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

  it("closes the modal when Cancel is clicked", async () => {
    renderWithProviders(<GPGKeysListActions gpgKey={gpgKey} />);

    await user.click(
      screen.getByRole("button", { name: `${gpgKey.name} GPG key actions` }),
    );
    await user.click(
      screen.getByRole("menuitem", { name: `Remove ${gpgKey.name} GPG key` }),
    );
    expect(await screen.findByRole("dialog")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /cancel/i }));
    await waitFor(() =>
      { expect(screen.queryByRole("dialog")).not.toBeInTheDocument(); },
    );
  });

  it("removes GPG key when Delete is confirmed", async () => {
    renderWithProviders(<GPGKeysListActions gpgKey={gpgKey} />);

    await user.click(
      screen.getByRole("button", { name: `${gpgKey.name} GPG key actions` }),
    );
    await user.click(
      screen.getByRole("menuitem", { name: `Remove ${gpgKey.name} GPG key` }),
    );
    expect(await screen.findByRole("dialog")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /delete/i }));
    await waitFor(() =>
      { expect(screen.queryByRole("dialog")).not.toBeInTheDocument(); },
    );
  });

  it("handles deletion error gracefully and closes modal", async () => {
    setEndpointStatus({ status: "error", path: "removeGpgKey" });

    renderWithProviders(<GPGKeysListActions gpgKey={gpgKey} />);

    await user.click(
      screen.getByRole("button", { name: `${gpgKey.name} GPG key actions` }),
    );
    await user.click(
      screen.getByRole("menuitem", { name: `Remove ${gpgKey.name} GPG key` }),
    );
    expect(await screen.findByRole("dialog")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /delete/i }));
    await waitFor(() =>
      { expect(screen.queryByRole("dialog")).not.toBeInTheDocument(); },
    );
  });
});

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

  it("closes the modal when Cancel is clicked", async () => {
    renderWithProviders(<GPGKeysListActions gpgKey={gpgKey} />);

    await user.click(
      screen.getByRole("button", { name: `${gpgKey.name} GPG key actions` }),
    );
    await user.click(
      screen.getByRole("menuitem", { name: `Remove ${gpgKey.name} GPG key` }),
    );
    expect(await screen.findByRole("dialog")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /cancel/i }));
    await waitFor(() =>
      { expect(screen.queryByRole("dialog")).not.toBeInTheDocument(); },
    );
  });

  it("removes GPG key when Delete is confirmed", async () => {
    renderWithProviders(<GPGKeysListActions gpgKey={gpgKey} />);

    await user.click(
      screen.getByRole("button", { name: `${gpgKey.name} GPG key actions` }),
    );
    await user.click(
      screen.getByRole("menuitem", { name: `Remove ${gpgKey.name} GPG key` }),
    );
    expect(await screen.findByRole("dialog")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /delete/i }));
    await waitFor(() =>
      { expect(screen.queryByRole("dialog")).not.toBeInTheDocument(); },
    );
  });
});
