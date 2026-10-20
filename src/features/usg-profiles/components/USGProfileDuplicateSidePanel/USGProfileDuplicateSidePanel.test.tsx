import { API_URL } from "@/constants";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { usgProfiles } from "@/tests/mocks/usgProfiles";
import { renderWithProviders } from "@/tests/render";
import server from "@/tests/server";
import { ENDPOINT_STATUS_API_ERROR_MESSAGE } from "@/tests/server/handlers/_constants";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import USGProfileDuplicateSidePanel from "./USGProfileDuplicateSidePanel";

const [, usgProfile] = usgProfiles;

const submitDuplicate = async () => {
  const duplicate = await screen.findByRole("button", { name: "Duplicate" });
  await waitFor(() => {
    expect(duplicate).not.toHaveAttribute("aria-disabled", "true");
  });
  await userEvent.click(duplicate);
  expect(
    await screen.findByText(/To duplicate the profile, you need to run it/),
  ).toBeInTheDocument();
  const submit = screen.getByRole("button", { name: "Duplicate" });
  await userEvent.click(submit);
  return submit;
};

describe("USGProfileDuplicateSidePanel", () => {
  it("renders a loading state while the profile is being fetched", () => {
    renderWithProviders(<USGProfileDuplicateSidePanel />);

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders the duplicate header and pre-fills the copied title", async () => {
    renderWithProviders(
      <USGProfileDuplicateSidePanel />,
      undefined,
      `/?name=${usgProfile.id}`,
    );

    expect(
      await screen.findByText(`Duplicate ${usgProfile.title}`),
    ).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Title" })).toHaveValue(
      `${usgProfile.title} copy`,
    );
    expect(
      await screen.findByRole("button", { name: "Duplicate" }),
    ).toBeInTheDocument();
  });

  it("duplicates the profile and shows a success notification", async () => {
    renderWithProviders(
      <USGProfileDuplicateSidePanel />,
      undefined,
      `/?name=${usgProfile.id}`,
    );

    await submitDuplicate();
    expect(
      await screen.findByText(
        `You have successfully created ${usgProfile.title} copy USG profile.`,
      ),
    ).toBeInTheDocument();
  });

  it("reports a failed duplication without showing success and keeps the form", async () => {
    renderWithProviders(
      <USGProfileDuplicateSidePanel />,
      undefined,
      `/?sidePath=duplicate&name=${usgProfile.id}`,
    );
    await screen.findByRole("textbox", { name: "Title" });
    setEndpointStatus({ path: "usg-profiles", status: "error" });

    await submitDuplicate();

    expect(
      await screen.findByText(ENDPOINT_STATUS_API_ERROR_MESSAGE),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/You have successfully created/),
    ).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Back" }));
    expect(screen.getByRole("textbox", { name: "Title" })).toHaveValue(
      `${usgProfile.title} copy`,
    );
  });

  it("waits for duplication to finish before showing success", async () => {
    const { promise, resolve } = Promise.withResolvers<undefined>();
    const requestStarted = vi.fn();
    server.use(
      http.post(`${API_URL}usg-profiles`, async () => {
        requestStarted();
        await promise;
        return HttpResponse.json(usgProfile);
      }),
    );
    renderWithProviders(
      <USGProfileDuplicateSidePanel />,
      undefined,
      `/?name=${usgProfile.id}`,
    );

    try {
      const duplicate = await submitDuplicate();
      await waitFor(() => {
        expect(requestStarted).toHaveBeenCalledOnce();
      });
      await waitFor(() => {
        expect(duplicate).toHaveAttribute("aria-disabled", "true");
      });
      expect(
        screen.queryByText(/You have successfully created/),
      ).not.toBeInTheDocument();
    } finally {
      resolve(undefined);
    }

    expect(
      await screen.findByText(
        `You have successfully created ${usgProfile.title} copy USG profile.`,
      ),
    ).toBeInTheDocument();
  });
});
