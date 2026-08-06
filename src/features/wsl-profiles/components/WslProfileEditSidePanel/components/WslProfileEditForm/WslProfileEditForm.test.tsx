import { setEndpointStatus } from "@/tests/controllers/controller";
import { expectErrorNotification } from "@/tests/helpers";
import { wslProfiles } from "@/tests/mocks/wsl-profiles";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import WslProfileEditForm from "./WslProfileEditForm";

const [, profile] = wslProfiles;

describe("WslProfileEditForm", () => {
  beforeEach(() => {
    setEndpointStatus("default");
  });

  it("renders the editing-unavailable warning and immutable field values", async () => {
    renderWithProviders(<WslProfileEditForm profile={profile} />);

    expect(await screen.findByText("Editing unavailable")).toBeInTheDocument();
    expect(
      screen.getByText(/you cannot edit access group/i),
    ).toBeInTheDocument();

    expect(screen.getByRole("textbox", { name: "Title" })).toHaveValue(
      profile.title,
    );
    expect(screen.getByRole("textbox", { name: "Description" })).toHaveValue(
      profile.description,
    );

    expect(screen.getByText("rootfs image")).toBeInTheDocument();
    expect(screen.getByText("cloud-init")).toBeInTheDocument();
    expect(screen.getByText("Compliance settings")).toBeInTheDocument();
    expect(screen.getByText(profile.image_source)).toBeInTheDocument();
    expect(
      screen.getByText("Uninstall non-Landscape instances"),
    ).toBeInTheDocument();
  });

  it("shows 'Plain text' as the cloud-init value when the profile has cloud-init contents", () => {
    renderWithProviders(
      <WslProfileEditForm
        profile={{ ...profile, cloud_init_contents: "#cloud-config" }}
      />,
    );

    expect(screen.getByText("Plain text")).toBeInTheDocument();
  });

  it("shows 'From a file' as the cloud-init value when the profile has a cloud-init secret name", () => {
    renderWithProviders(
      <WslProfileEditForm
        profile={{
          ...profile,
          cloud_init_contents: null,
          cloud_init_secret_name: "my-secret",
        }}
      />,
    );

    expect(screen.getByText("From a file")).toBeInTheDocument();
  });

  it("submits the editable fields and notifies on success", async () => {
    renderWithProviders(<WslProfileEditForm profile={profile} />);

    const titleInput = screen.getByRole("textbox", { name: "Title" });
    await userEvent.clear(titleInput);
    await userEvent.type(titleInput, "Updated WSL title");

    await userEvent.click(
      await screen.findByRole("button", { name: "Save changes" }),
    );

    expect(
      await screen.findByText(
        `WSL profile "${profile.title}" updated successfully`,
      ),
    ).toBeInTheDocument();
  });

  it("surfaces an error notification when saving fails", async () => {
    setEndpointStatus({
      status: "error",
      path: "child-instance-profiles/:name",
    });

    renderWithProviders(<WslProfileEditForm profile={profile} />);

    await userEvent.click(
      await screen.findByRole("button", { name: "Save changes" }),
    );

    await expectErrorNotification();
  });
});
