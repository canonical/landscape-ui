import { DEFAULT_MODAL_PAGE_SIZE } from "@/constants";
import { expectLoadingState } from "@/tests/helpers";
import { aptSources } from "@/tests/mocks/apt-sources";
import { repositoryProfiles } from "@/tests/mocks/repositoryProfiles";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect } from "vitest";
import type { APTSourceDeleteModalProps } from "./APTSourceDeleteModal";
import APTSourceDeleteModal from "./APTSourceDeleteModal";

const props: APTSourceDeleteModalProps = {
  aptSource: aptSources[0],
  close: vi.fn(),
  opened: true,
};

describe("APTSourceDeleteModal", () => {
  const user = userEvent.setup();

  it("doesn't render while closed", () => {
    renderWithProviders(<APTSourceDeleteModal {...props} opened={false} />);
  });

  it("shows a regular message for an apt source without profiles", async () => {
    const aptSource = aptSources.find(({ profiles }) => !profiles.length);
    assert(aptSource);

    renderWithProviders(
      <APTSourceDeleteModal {...props} aptSource={aptSource} />,
    );

    expect(
      screen.getByText(
        "If this APT source is deleted, it will no longer be available to include in repository profiles.",
      ),
    ).toBeInTheDocument();
    await user.type(screen.getByRole("textbox"), `delete ${aptSource.name}`);
    await user.click(screen.getByRole("button", { name: "Delete" }));
    expect(
      await screen.findByText(
        "It will no longer be available to include in repository profiles.",
      ),
    ).toBeInTheDocument();
  });

  it("shows a list for an apt source with profiles", async () => {
    const aptSource = aptSources.find(({ profiles }) => profiles.length);
    assert(aptSource);

    renderWithProviders(
      <APTSourceDeleteModal {...props} aptSource={aptSource} />,
    );

    await expectLoadingState();

    const filteredRepositoryProfiles = repositoryProfiles
      .slice(0, DEFAULT_MODAL_PAGE_SIZE)
      .filter(({ name }) => aptSource.profiles.includes(name));

    for (const { title } of filteredRepositoryProfiles) {
      expect(screen.getByText(title)).toBeInTheDocument();
    }

    await user.type(screen.getByRole("textbox"), `delete ${aptSource.name}`);
    await user.click(screen.getByRole("button", { name: "Delete" }));
    expect(
      await screen.findByText(
        "It will no longer be available and it has been removed from its associated profiles.",
      ),
    ).toBeInTheDocument();
  });
});
