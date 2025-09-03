import { expectLoadingState } from "@/tests/helpers";
import { aptSources } from "@/tests/mocks/apt-sources";
import { repositoryProfiles } from "@/tests/mocks/repositoryProfiles";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect } from "vitest";
import APTSourceDeleteModal from "./APTSourceDeleteModal";

describe("APTSourceDeleteModal", () => {
  it("doesn't render while closed", () => {
    renderWithProviders(
      <APTSourceDeleteModal
        aptSource={aptSources[0]}
        close={() => undefined}
      />,
    );
  });

  it("shows a regular message for an apt source without profiles", () => {
    renderWithProviders(
      <APTSourceDeleteModal
        aptSource={aptSources[2]}
        close={() => undefined}
        opened
      />,
    );

    assert(!aptSources[2].profiles.length);

    expect(
      screen.getByText(
        "If this APT source is deleted, it will no longer be available to include in repository profiles.",
      ),
    ).toBeInTheDocument();
  });

  it("shows a list for an apt source with profiles", async () => {
    renderWithProviders(
      <APTSourceDeleteModal
        aptSource={aptSources[0]}
        close={() => undefined}
        opened
      />,
    );

    assert(aptSources[0].profiles.length);

    await expectLoadingState();

    for (const { title } of repositoryProfiles.filter(({ name }) =>
      aptSources[0].profiles.includes(name),
    )) {
      expect(screen.getByText(title)).toBeInTheDocument();
    }
  });

  it("submits without profiles", async () => {
    renderWithProviders(
      <APTSourceDeleteModal
        aptSource={aptSources[2]}
        close={() => undefined}
        opened
      />,
    );

    assert(!aptSources[2].profiles.length);

    await userEvent.click(screen.getByRole("button", { name: "Delete" }));

    expect(
      await screen.findByText(
        "It will no longer be available to include in repository profiles.",
      ),
    ).toBeInTheDocument();
  });

  it("submits with profiles", async () => {
    renderWithProviders(
      <APTSourceDeleteModal
        aptSource={aptSources[0]}
        close={() => undefined}
        opened
      />,
    );

    assert(aptSources[0].profiles.length);

    await userEvent.click(screen.getByRole("button", { name: "Delete" }));

    expect(
      await screen.findByText(
        "It will no longer be available and it has been removed from its associated profiles.",
      ),
    ).toBeInTheDocument();
  });
});
