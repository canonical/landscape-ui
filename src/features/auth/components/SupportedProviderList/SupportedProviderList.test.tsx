import { describe } from "vitest";
import { renderWithProviders } from "@/tests/render";
import SupportedProviderList from "./SupportedProviderList";
import { screen } from "@testing-library/react";
import { expectLoadingState } from "@/tests/helpers";
import userEvent from "@testing-library/user-event";

describe("SupportedProviderList", () => {
  it("should render the supported provider list", async () => {
    renderWithProviders(<SupportedProviderList />);

    await expectLoadingState();

    expect(
      screen.getByText(
        "More identity providers will be integrated in the future.",
      ),
    ).toBeInTheDocument();

    expect(
      await screen.findByRole("button", { name: "Okta" }),
    ).toBeInTheDocument();
  });

  it("should render the supported provider list without Ubuntu One", async () => {
    renderWithProviders(<SupportedProviderList />);

    await expectLoadingState();

    expect(
      screen.queryByRole("button", { name: "Ubuntu One" }),
    ).not.toBeInTheDocument();
  });

  it("should open form to add provider on click", async () => {
    renderWithProviders(<SupportedProviderList />);

    await expectLoadingState();

    await userEvent.click(await screen.findByRole("button", { name: "Okta" }));

    expect(
      await screen.findByRole("heading", {
        name: "Add Okta identity provider",
      }),
    ).toBeInTheDocument();
  });
});
