import { API_URL } from "@/constants";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { expectErrorNotification } from "@/tests/helpers";
import { packageProfiles } from "@/tests/mocks/package-profiles";
import { renderWithProviders } from "@/tests/render";
import server from "@/tests/server";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { describe, expect, it, vi } from "vitest";
import PackageProfileEditForm from "./PackageProfileEditForm";

const [profile] = packageProfiles;

describe("PackageProfileEditForm", () => {
  it("submits edited values and notifies on success", async () => {
    renderWithProviders(<PackageProfileEditForm profile={profile} />);

    const titleInput = screen.getByRole("textbox", { name: "Title" });
    await userEvent.clear(titleInput);
    await userEvent.type(titleInput, "New title");

    const descriptionInput = screen.getByRole("textbox", {
      name: "Description",
    });
    await userEvent.clear(descriptionInput);
    await userEvent.type(descriptionInput, "Updated description");

    await userEvent.click(
      await screen.findByRole("button", { name: "Save changes" }),
    );

    expect(
      await screen.findByText(
        `Package profile "${profile.title}" updated successfully`,
      ),
    ).toBeInTheDocument();
  });

  it("shows a required error without sending an update when the description is cleared", async () => {
    const updateRequest = vi.fn(() => HttpResponse.json());
    server.use(
      http.put(`${API_URL}packageprofiles/${profile.name}`, updateRequest),
    );

    renderWithProviders(<PackageProfileEditForm profile={profile} />);

    const descriptionInput = screen.getByRole("textbox", {
      name: "Description",
    });
    await userEvent.clear(descriptionInput);
    await userEvent.click(screen.getByRole("button", { name: "Save changes" }));

    expect(
      await screen.findByText("This field is required."),
    ).toBeInTheDocument();
    expect(descriptionInput).toBeRequired();
    expect(updateRequest).not.toHaveBeenCalled();
  });

  it("surfaces an error notification when the update fails", async () => {
    setEndpointStatus({
      status: "error",
      path: "packageprofiles/:profileName",
    });

    renderWithProviders(<PackageProfileEditForm profile={profile} />);

    await userEvent.click(
      await screen.findByRole("button", { name: "Save changes" }),
    );

    await expectErrorNotification();
  });
});
