import { API_URL } from "@/constants";
import useSidePanel from "@/hooks/useSidePanel";
import { authResponse } from "@/tests/mocks/auth";
import { renderWithProviders } from "@/tests/render";
import server from "@/tests/server";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { beforeEach } from "vitest";
import OrganisationSwitch from "./OrganisationSwitch";

vi.mock("@/hooks/useSidePanel");
const closeSidePanel = vi.fn();

describe("OrganisationSwitch (integration)", () => {
  beforeEach(() => {
    vi.mocked(useSidePanel, { partial: true }).mockReturnValue({
      closeSidePanel,
    });

    server.use(http.get(`${API_URL}me`, () => HttpResponse.json(authResponse)));
  });

  it("should update the displayed organisation after account switch", async () => {
    renderWithProviders(<OrganisationSwitch />);

    // Wait for the real auth context to fully load from MSW GET /me.
    // authResponse has current_account = "test-account".
    await waitFor(() => {
      expect(
        screen.getByRole("combobox", { name: /organization/i }),
      ).toHaveValue("test-account");
    });

    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: /organization/i }),
      "second-account",
    );

    await waitFor(() => {
      expect(
        screen.getByRole("combobox", { name: /organization/i }),
      ).toHaveValue("second-account");
    });
  });
});
