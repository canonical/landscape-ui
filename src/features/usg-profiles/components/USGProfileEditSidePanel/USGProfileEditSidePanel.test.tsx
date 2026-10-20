import { API_URL } from "@/constants";
import { usgProfiles } from "@/tests/mocks/usgProfiles";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { renderWithProviders } from "@/tests/render";
import server from "@/tests/server";
import { ENDPOINT_STATUS_API_ERROR_MESSAGE } from "@/tests/server/handlers/_constants";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import USGProfileEditSidePanel from "./USGProfileEditSidePanel";

const [, usgProfile] = usgProfiles;

describe("USGProfileEditSidePanel", () => {
  it("renders a loading state while the profile is being fetched", () => {
    renderWithProviders(<USGProfileEditSidePanel />);

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders the edit header and pre-filled form", async () => {
    renderWithProviders(
      <USGProfileEditSidePanel />,
      undefined,
      `/?name=${usgProfile.id}`,
    );

    expect(
      await screen.findByText(`Edit ${usgProfile.title}`),
    ).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Title" })).toHaveValue(
      usgProfile.title,
    );
    expect(
      await screen.findByRole("button", { name: "Save changes" }),
    ).toBeInTheDocument();
  });

  it("saves changes and shows a success notification on submit", async () => {
    renderWithProviders(
      <USGProfileEditSidePanel />,
      undefined,
      `/?name=${usgProfile.id}`,
    );

    await userEvent.click(
      await screen.findByRole("button", { name: "Save changes" }),
    );

    expect(
      await screen.findByText(
        `You have successfully saved changes for ${usgProfile.title} USG profile.`,
      ),
    ).toBeInTheDocument();
  });

  it("populates the end date from a saved compact UTC UNTIL", async () => {
    const profile = {
      ...usgProfile,
      schedule: "FREQ=DAILY;INTERVAL=7;UNTIL=20271231T120000Z",
    };
    setEndpointStatus({
      path: "usg-profiles",
      status: "variant",
      response: [profile],
    });

    renderWithProviders(
      <USGProfileEditSidePanel />,
      undefined,
      `/?name=${profile.id}`,
    );

    expect(await screen.findByLabelText("End date")).toHaveValue(
      "2027-12-31T12:00",
    );
    expect(screen.getByLabelText("Ends")).toHaveValue("on-a-date");
  });

  it("reports a failed save without showing success and allows retry", async () => {
    renderWithProviders(
      <USGProfileEditSidePanel />,
      undefined,
      `/?sidePath=edit&name=${usgProfile.id}`,
    );
    const save = await screen.findByRole("button", { name: "Save changes" });
    await waitFor(() => {
      expect(save).not.toHaveAttribute("aria-disabled", "true");
    });

    setEndpointStatus({ path: "usg-profiles", status: "error" });
    await userEvent.click(save);

    expect(
      await screen.findByText(ENDPOINT_STATUS_API_ERROR_MESSAGE),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/You have successfully saved/),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Title" })).toHaveValue(
      usgProfile.title,
    );
    await waitFor(() => {
      expect(save).not.toHaveAttribute("aria-disabled", "true");
    });

    setEndpointStatus("default");
    await userEvent.click(save);
    expect(
      await screen.findByText(
        `You have successfully saved changes for ${usgProfile.title} USG profile.`,
      ),
    ).toBeInTheDocument();
  });

  it("waits for the save response before showing success", async () => {
    const { promise, resolve } = Promise.withResolvers<undefined>();
    const requestStarted = vi.fn();
    server.use(
      http.patch(`${API_URL}security-profiles/:id`, async () => {
        requestStarted();
        await promise;
        return HttpResponse.json(usgProfile);
      }),
    );
    renderWithProviders(
      <USGProfileEditSidePanel />,
      undefined,
      `/?name=${usgProfile.id}`,
    );
    const save = await screen.findByRole("button", { name: "Save changes" });
    await waitFor(() => {
      expect(save).not.toHaveAttribute("aria-disabled", "true");
    });

    try {
      await userEvent.click(save);
      await waitFor(() => {
        expect(requestStarted).toHaveBeenCalledOnce();
      });
      await waitFor(() => {
        expect(save).toHaveAttribute("aria-disabled", "true");
      });
      expect(
        screen.queryByText(/You have successfully saved/),
      ).not.toBeInTheDocument();
    } finally {
      resolve(undefined);
    }

    expect(
      await screen.findByText(
        `You have successfully saved changes for ${usgProfile.title} USG profile.`,
      ),
    ).toBeInTheDocument();
  });
});
