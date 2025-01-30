import { describe } from "vitest";
import { screen } from "@testing-library/react";
import ProviderList from "./ProviderList";
import type { ComponentProps } from "react";
import { identityProviders } from "@/tests/mocks/identityProviders";
import { renderWithProviders } from "@/tests/render";
import userEvent from "@testing-library/user-event";

const props: ComponentProps<typeof ProviderList> = {
  oidcAvailable: true,
  oidcProviders: identityProviders,
  ubuntuOneAvailable: true,
  ubuntuOneEnabled: true,
};

describe("ProviderListActions", () => {
  it("should render correctly", async () => {
    const { container } = renderWithProviders(<ProviderList {...props} />);

    expect(container).toHaveTexts(["Name", "Status", "Provider", "Actions"]);

    expect(screen.getByRole("table")).toBeInTheDocument();

    expect(screen.getAllByRole("row")).toHaveLength(
      identityProviders.length + 2,
    );

    await userEvent.click(
      screen.getByRole("button", { name: "Ubuntu One provider actions" }),
    );

    expect(
      screen.getByRole("button", { name: "Delete Ubuntu One provider" }),
    ).toHaveAttribute("aria-disabled", "true");
  });
});
