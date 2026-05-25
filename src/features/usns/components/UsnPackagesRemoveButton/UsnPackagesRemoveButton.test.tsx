import { screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/tests/render";
import UsnPackagesRemoveButton from "./UsnPackagesRemoveButton";

describe("UsnPackagesRemoveButton", () => {
  const renderButton = () =>
    renderWithProviders(
      <UsnPackagesRemoveButton
        instanceTitle="Application Server 1"
        usn="USN-6557-1"
      />,
      {},
      "/instances/1/child/2",
      "/instances/:instanceId/child/:childInstanceId",
    );

  it("renders 'Uninstall packages' button", () => {
    renderButton();

    expect(
      screen.getByRole("button", { name: /uninstall packages/i }),
    ).toBeInTheDocument();
  });

  it("opens confirmation modal when clicking the button", async () => {
    renderButton();

    await userEvent.click(
      screen.getByRole("button", { name: /uninstall packages/i }),
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(
      screen.getByText(/uninstall packages affected by/i),
    ).toBeInTheDocument();
  });

  it("removes packages and shows success notification on confirm", async () => {
    renderButton();

    await userEvent.click(
      screen.getByRole("button", { name: /uninstall packages/i }),
    );
    await userEvent.click(screen.getByRole("button", { name: /^uninstall$/i }));

    expect(
      await screen.findByText(/you queued packages to be uninstalled/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/view details/i)).toBeInTheDocument();
  });

  it("navigates to activities tab when 'View details' is clicked after removal", async () => {
    renderButton();

    await userEvent.click(
      screen.getByRole("button", { name: /uninstall packages/i }),
    );
    await userEvent.click(screen.getByRole("button", { name: /^uninstall$/i }));

    await screen.findByText(/you queued packages to be uninstalled/i);

    await userEvent.click(screen.getByText(/view details/i));
  });

  it("shows error notification when removal fails", async () => {
    const { setEndpointStatus } =
      await import("@/tests/controllers/controller");
    setEndpointStatus("error");

    renderButton();

    await userEvent.click(
      screen.getByRole("button", { name: /uninstall packages/i }),
    );
    await userEvent.click(screen.getByRole("button", { name: /^uninstall$/i }));

    setEndpointStatus("default");
  });
});
