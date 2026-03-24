import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { renderWithProviders } from "@/tests/render";
import APTSourcesListActions from "./APTSourcesListActions";
import { aptSources } from "@/tests/mocks/apt-sources";

const [aptSource] = aptSources;

describe("APTSourcesListActions", () => {
  const user = userEvent.setup();

  it("renders the actions toggle button", () => {
    renderWithProviders(<APTSourcesListActions aptSource={aptSource} />);

    expect(
      screen.getByRole("button", {
        name: `${aptSource.name} APT source actions`,
      }),
    ).toBeInTheDocument();
  });

  it("opens delete modal when Delete is clicked", async () => {
    renderWithProviders(<APTSourcesListActions aptSource={aptSource} />);

    await user.click(
      screen.getByRole("button", {
        name: `${aptSource.name} APT source actions`,
      }),
    );

    await user.click(
      screen.getByRole("menuitem", {
        name: `Remove ${aptSource.name} APT source`,
      }),
    );

    expect(await screen.findByRole("dialog")).toBeInTheDocument();
  });
});
