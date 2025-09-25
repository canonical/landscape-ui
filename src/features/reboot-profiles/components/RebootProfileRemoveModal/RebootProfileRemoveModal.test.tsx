import { setEndpointStatus } from "@/tests/controllers/controller";
import { rebootProfiles } from "@/tests/mocks/rebootProfiles";
import { renderWithProviders } from "@/tests/render";
import { ENDPOINT_STATUS_API_ERROR_MESSAGE } from "@/tests/server/handlers/_constants";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import type { RebootProfileRemoveModalProps } from "./RebootProfileRemoveModal";
import RebootProfileRemoveModal from "./RebootProfileRemoveModal";

const user = userEvent.setup();

const props: RebootProfileRemoveModalProps = {
  close: vi.fn(),
  opened: true,
  rebootProfile: rebootProfiles[0],
};

const remove = async () => {
  expect(screen.getByText("Remove reboot profile")).toBeInTheDocument();
  await user.type(
    screen.getByRole("textbox"),
    `remove ${props.rebootProfile.title}`,
  );
  const removeButton = screen.getByRole("button", { name: "Remove" });
  expect(removeButton).toBeEnabled();
  await user.click(removeButton);
};

describe("RebootProfileRemoveModal", () => {
  it("opens a modal on remove button click and allows profile removal", async () => {
    renderWithProviders(<RebootProfileRemoveModal {...props} />);
    await remove();
    expect(
      await screen.findByText("Reboot profile removed"),
    ).toBeInTheDocument();
  });

  it("shows errors while removing", async () => {
    renderWithProviders(<RebootProfileRemoveModal {...props} />);
    setEndpointStatus("error");
    await remove();
    expect(
      await screen.findByText(ENDPOINT_STATUS_API_ERROR_MESSAGE),
    ).toBeInTheDocument();
  });
});
