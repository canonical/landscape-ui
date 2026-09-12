import { renderWithProviders } from "@/tests/render";
import { API_URL } from "@/constants";
import server from "@/tests/server";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import RegenerateLicenseButton from "./RegenerateLicenseButton";

describe("RegenerateLicenseButton", () => {
  it("regenerates the license and shows a success notification", async () => {
    const user = userEvent.setup();

    renderWithProviders(<RegenerateLicenseButton />);

    await user.click(
      screen.getByRole("button", { name: "Regenerate token" }),
    );

    expect(
      await screen.findByText(
        "You have successfully regenerated your APT credentials",
      ),
    ).toBeInTheDocument();
  });

  it("shows an error notification when regeneration fails", async () => {
    server.use(
      http.post(
        `${API_URL}self-hosted/license-url:regenerate`,
        () =>
          new HttpResponse(
            JSON.stringify({ error: "ApiError", message: "Something failed" }),
            { status: 500 },
          ),
      ),
    );
    const user = userEvent.setup();

    renderWithProviders(<RegenerateLicenseButton />);

    await user.click(
      screen.getByRole("button", { name: "Regenerate token" }),
    );

    expect(await screen.findByText("Something failed")).toBeInTheDocument();
  });
});

