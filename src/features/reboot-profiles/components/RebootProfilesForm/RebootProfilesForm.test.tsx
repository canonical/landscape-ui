import { API_URL } from "@/constants";
import { rebootProfiles } from "@/tests/mocks/rebootProfiles";
import { renderWithProviders } from "@/tests/render";
import server from "@/tests/server";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { describe, expect, it, vi } from "vitest";
import RebootProfilesForm from "./RebootProfilesForm";

const [profile] = rebootProfiles;

describe("RebootProfilesForm", () => {
  const user = userEvent.setup();

  it("submits with correct values for add action", async () => {
    const onCreate = vi.fn();
    server.use(
      http.post(`${API_URL}rebootprofiles`, async ({ request }) => {
        onCreate(await request.json());
        return HttpResponse.json(profile, { status: 201 });
      }),
    );
    renderWithProviders(<RebootProfilesForm action="add" />);

    await user.type(screen.getByLabelText(/title/i), "New Test Profile");

    const dayCombobox = screen.getByRole("combobox", {
      name: /days/i,
    });

    await user.click(dayCombobox);

    await user.click(screen.getByText("Sunday"));
    await user.click(screen.getByText("Tuesday"));

    await user.type(screen.getByLabelText("at hour"), "10");
    await user.type(screen.getByLabelText("at minute"), "30");
    await user.clear(screen.getByLabelText(/Expires after/i));
    await user.type(screen.getByLabelText(/Expires after/i), "1");

    await user.click(
      screen.getByRole("button", { name: "Add reboot profile" }),
    );

    expect(
      await screen.findByText("Reboot profile added"),
    ).toBeInTheDocument();
    expect(onCreate).toHaveBeenCalledWith(
      expect.objectContaining({ deliver_within: 1 }),
    );
  });

  it("submits with correct values for edit action", async () => {
    renderWithProviders(<RebootProfilesForm action="edit" profile={profile} />);

    const nameInput = screen.getByLabelText(/title/i);
    await user.clear(nameInput);
    await user.type(nameInput, "Updated title");

    await user.click(screen.getByRole("button", { name: "Save changes" }));

    expect(
      await screen.findByText("Reboot profile updated"),
    ).toBeInTheDocument();
  });

  it("shows validation errors for invalid input", async () => {
    renderWithProviders(<RebootProfilesForm action="add" />);

    await user.type(screen.getByLabelText("at hour"), "25");
    await user.type(screen.getByLabelText("at minute"), "65");
    await user.tripleClick(screen.getByLabelText("Expires after"));
    await user.keyboard("-1");

    await user.click(
      screen.getByRole("button", { name: "Add reboot profile" }),
    );

    expect(
      await screen.findByText("Hour must be between 0 and 23."),
    ).toBeInTheDocument();
    expect(
      await screen.findByText("Minute must be between 0 and 59."),
    ).toBeInTheDocument();
    expect(
      await screen.findByText("At least one day must be selected."),
    ).toBeInTheDocument();
    expect(
      await screen.findByText("'Expires after' must be at least 1."),
    ).toBeInTheDocument();
  });

  it.each([
    ["0", "'Expires after' must be at least 1."],
    ["-1", "'Expires after' must be at least 1."],
    ["-1 ", "'Expires after' must be at least 1."],
    [" ", "Enter an integer greater than or equal to 1."],
    ["abc", "Enter an integer greater than or equal to 1."],
    ["1.5", "'Expires after' must be an integer."],
    ["", "Enter an integer greater than or equal to 1."],
  ])(
    "rejects an expiration value of %j",
    async (value, message) => {
      renderWithProviders(<RebootProfilesForm action="add" />);

      const expirationInput = screen.getByLabelText("Expires after");
      await user.clear(expirationInput);
      if (value) {
        await user.type(expirationInput, value);
      }
      await user.tab();

      expect(await screen.findByText(message)).toBeInTheDocument();
    },
  );

  it("defaults to a valid expiration of one hour", () => {
    renderWithProviders(<RebootProfilesForm action="add" />);

    expect(screen.getByLabelText("Expires after")).toHaveValue(1);
  });

  it("shows enabled access group field in add mode", () => {
    renderWithProviders(<RebootProfilesForm action="add" />);

    expect(screen.getByLabelText(/access group/i)).toBeEnabled();
  });

  it("shows read-only access group field in edit mode", () => {
    const { container } = renderWithProviders(
      <RebootProfilesForm action="edit" profile={profile} />,
    );

    expect(container.querySelector(".p-icon--lock-locked")).toBeInTheDocument();
    expect(screen.getByText(profile.access_group)).toBeInTheDocument();
  });
});
