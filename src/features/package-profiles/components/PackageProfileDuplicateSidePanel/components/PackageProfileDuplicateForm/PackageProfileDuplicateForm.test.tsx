import { API_URL } from "@/constants";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { packageProfiles } from "@/tests/mocks/package-profiles";
import { renderWithProviders } from "@/tests/render";
import server from "@/tests/server";
import { ENDPOINT_STATUS_API_ERROR_MESSAGE } from "@/tests/server/handlers/_constants";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { describe, expect, vi } from "vitest";
import PackageProfileDuplicateForm from "./PackageProfileDuplicateForm";

const [profile] = packageProfiles;

describe("PackageProfileDuplicateForm", () => {
  const user = userEvent.setup();

  it("submits valid values and notifies on success", async () => {
    renderWithProviders(<PackageProfileDuplicateForm profile={profile} />);

    const descriptionInput = screen.getByRole("textbox", {
      name: "Description",
    });
    await user.clear(descriptionInput);
    await user.type(descriptionInput, "Duplicate description");

    await user.click(screen.getByRole("button", { name: "Duplicate" }));
    expect(await screen.findByText("Profile duplicated")).toBeInTheDocument();
  });

  it("shows a required error without sending a duplicate when the description is cleared", async () => {
    const copyRequest = vi.fn(() => HttpResponse.json());
    server.use(http.post(`${API_URL}packageprofiles`, copyRequest));

    renderWithProviders(<PackageProfileDuplicateForm profile={profile} />);

    const descriptionInput = screen.getByRole("textbox", {
      name: "Description",
    });
    await user.clear(descriptionInput);
    await user.click(screen.getByRole("button", { name: "Duplicate" }));

    expect(
      await screen.findByText("This field is required."),
    ).toBeInTheDocument();
    expect(descriptionInput).toBeRequired();
    expect(copyRequest).not.toHaveBeenCalled();
  });

  it("catches errors", async () => {
    setEndpointStatus({ status: "error", path: "packageprofiles" });

    renderWithProviders(<PackageProfileDuplicateForm profile={profile} />);

    await user.click(screen.getByRole("button", { name: "Duplicate" }));
    expect(
      await screen.findByText(ENDPOINT_STATUS_API_ERROR_MESSAGE),
    ).toBeInTheDocument();
  });
});
