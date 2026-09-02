import { screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { renderWithProviders } from "@/tests/render";
import AdministratorsPage from "./AdministratorsPage";
import userEvent from "@testing-library/user-event";
import { setEndpointStatus } from "@/tests/controllers/controller";

describe("AdministratorsPage", () => {
  afterEach(() => {
    setEndpointStatus("default");
  });

  it("renders Administrators heading", async () => {
    renderWithProviders(<AdministratorsPage />);

    expect(
      await screen.findByRole("heading", { name: "Administrators" }),
    ).toBeInTheDocument();
  });

  it("renders Invite administrator button", async () => {
    renderWithProviders(<AdministratorsPage />);

    expect(
      await screen.findByRole("button", { name: "Invite administrator" }),
    ).toBeInTheDocument();
  });

  it("opens invite administrator side panel on button click", async () => {
    const user = userEvent.setup();
    renderWithProviders(<AdministratorsPage />);

    const inviteButton = await screen.findByRole("button", {
      name: "Invite administrator",
    });
    await user.click(inviteButton);

    const sidePanel = await screen.findByRole("complementary");
    expect(sidePanel).toBeInTheDocument();

    expect(
      within(sidePanel).getByRole("heading", { name: /invite administrator/i }),
    ).toBeInTheDocument();
  });

  it("opens the administrator limit modal when the limit is reached", async () => {
    const user = userEvent.setup();
    setEndpointStatus({
      path: "max-people-count",
      status: "variant",
      response: { max_people_count: 5 },
    });

    renderWithProviders(<AdministratorsPage />);

    const inviteButton = await screen.findByRole("button", {
      name: "Invite administrator",
    });
    await user.click(inviteButton);

    expect(
      await screen.findByRole("heading", {
        name: "Administrator limit reached",
      }),
    ).toBeInTheDocument();
  });
});
