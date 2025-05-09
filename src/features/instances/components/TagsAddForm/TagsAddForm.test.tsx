import { setEndpointStatus } from "@/tests/controllers/controller";
import { expectLoadingState } from "@/tests/helpers";
import { instances } from "@/tests/mocks/instance";
import { securityProfiles } from "@/tests/mocks/securityProfiles";
import { tags } from "@/tests/mocks/tag";
import { renderWithProviders } from "@/tests/render";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TagsAddForm from "./TagsAddForm";

describe("TagsAddForm", async () => {
  const selected = instances;

  describe("multiple instances", () => {
    it("should render form", async () => {
      renderWithProviders(<TagsAddForm selected={selected} />);
      await expectLoadingState();

      expect(
        screen.getByRole("searchbox", { name: /search/i }),
      ).toBeInTheDocument();

      expect(screen.getByRole("table")).toBeInTheDocument();

      expect(
        screen.getByRole("button", { name: /assign/i }),
      ).toBeInTheDocument();
    });

    it("should disable submit button when no tags are selected", async () => {
      renderWithProviders(<TagsAddForm selected={selected} />);
      await expectLoadingState();

      const assignButton = screen.getByRole("button", { name: /assign/i });

      expect(assignButton).toBeDisabled();

      await userEvent.click(assignButton);

      expect(screen.queryByText(/tags assigned/i)).not.toBeInTheDocument();
    });

    it("should add selected tags to the selected instances", async () => {
      setEndpointStatus({
        status: "empty",
        path: "security-profiles",
      });
      renderWithProviders(<TagsAddForm selected={selected} />);
      await expectLoadingState();

      const filteredTags = Array.from(
        new Set(
          securityProfiles.flatMap((profile) =>
            profile.tags.filter(
              (tag) =>
                tags.includes(tag) &&
                !selected.every((instance) => instance.tags.includes(tag)),
            ),
          ),
        ),
      );

      const rows = screen.getAllByRole("row");

      for (const tag of filteredTags) {
        const row = rows.find((r) => within(r).queryByText(tag));
        assert(row);
        const checkbox = within(row).getByRole("checkbox");
        await userEvent.click(checkbox);
      }
      expect(screen.getByRole("button", { name: /assign/i })).toBeEnabled();

      await userEvent.click(screen.getByRole("button", { name: /assign/i }));

      expect(
        await screen.findByText(
          `Tags successfully assigned to ${selected.length} instances`,
        ),
      ).toBeInTheDocument();
    });

    it("should show confirmation modal and assign tags after confirming", async () => {
      renderWithProviders(<TagsAddForm selected={selected} />);
      await expectLoadingState();

      const filteredTags = Array.from(
        new Set(
          securityProfiles.flatMap((profile) =>
            profile.tags.filter(
              (tag) =>
                tags.includes(tag) &&
                !selected.every((instance) => instance.tags.includes(tag)),
            ),
          ),
        ),
      );

      const rows = screen.getAllByRole("row");
      const row = rows.find((r) => within(r).queryByText(filteredTags[0]));
      assert(row);
      const checkbox = within(row).getByRole("checkbox");
      await userEvent.click(checkbox);

      await userEvent.click(screen.getByRole("button", { name: /assign/i }));

      expect(
        screen.getByText(/adding tags could trigger/i),
      ).toBeInTheDocument();
      await userEvent.click(screen.getByRole("button", { name: /add tags/i }));

      expect(
        await screen.findByText(
          `Tags successfully assigned to ${selected.length} instances`,
        ),
      ).toBeInTheDocument();
    });
  });

  it("should add selected tags to the single instance", async () => {
    const selectedInstances = instances.slice(0, 1);

    renderWithProviders(<TagsAddForm selected={selectedInstances} />);
    await expectLoadingState();

    const filteredTags = Array.from(
      new Set(
        securityProfiles.flatMap((profile) =>
          profile.tags.filter(
            (tag) =>
              tags.includes(tag) &&
              !selectedInstances.every((instance) =>
                instance.tags.includes(tag),
              ),
          ),
        ),
      ),
    );

    const rows = screen.getAllByRole("row");

    for (const tag of filteredTags) {
      const row = rows.find((r) => within(r).queryByText(tag));
      assert(row);
      const checkbox = within(row).getByRole("checkbox");
      await userEvent.click(checkbox);
    }

    await userEvent.click(screen.getByRole("button", { name: /assign/i }));

    const modal = await screen.findByRole("dialog");
    expect(modal).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /add tags/i }));
    expect(
      await screen.findByText(
        `Tags successfully assigned to "${selectedInstances[0].title}" instance`,
      ),
    ).toBeInTheDocument();
  });
});
