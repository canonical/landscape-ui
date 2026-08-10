import { setEndpointStatus } from "@/tests/controllers/controller";
import { expectErrorNotification } from "@/tests/helpers";
import { packageProfiles } from "@/tests/mocks/package-profiles";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import PackageProfileEditForm from "./PackageProfileEditForm";

const [profile] = packageProfiles;

describe("PackageProfileEditForm", () => {
  beforeEach(() => {
    setEndpointStatus("default");
  });

  it("submits edited values and notifies on success", async () => {
    renderWithProviders(<PackageProfileEditForm profile={profile} />);

    const titleInput = screen.getByRole("textbox", { name: "Title" });
    await userEvent.clear(titleInput);
    await userEvent.type(titleInput, "New title");

    await userEvent.click(
      await screen.findByRole("button", { name: "Save changes" }),
    );

    expect(
      await screen.findByText(
        `Package profile "${profile.title}" updated successfully`,
      ),
    ).toBeInTheDocument();
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
