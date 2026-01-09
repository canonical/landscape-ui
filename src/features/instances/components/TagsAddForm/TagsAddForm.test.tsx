import { expectLoadingState } from "@/tests/helpers";
import { instances } from "@/tests/mocks/instance";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TagsAddForm from "./TagsAddForm";

describe("TagsAddForm", async () => {
  describe("multiple instances", () => {
    it("should render form", async () => {
      renderWithProviders(<TagsAddForm selected={instances} />);
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
      renderWithProviders(<TagsAddForm selected={instances} />);
      await expectLoadingState();

      const assignButton = screen.getByRole("button", { name: /assign/i });

      expect(assignButton).toBeDisabled();
      await userEvent.click(assignButton);
      expect(screen.queryByText(/tags assigned/i)).not.toBeInTheDocument();

      await Promise.all(
        screen
          .getAllByRole("checkbox")
          .map((checkbox) => userEvent.click(checkbox)),
      );

      expect(assignButton).toBeEnabled();
      await userEvent.click(assignButton);

      await userEvent.click(screen.getByRole("button", { name: /add tags/i }));

      expect(
        await screen.findByText(
          `Tags successfully assigned to ${instances.length} instances`,
        ),
      ).toBeInTheDocument();
    });

    it("should add selected tags to the selected instances", async () => {
      renderWithProviders(<TagsAddForm selected={instances} />);
      await expectLoadingState();
    });
  });

  it("should add selected tags to the single instance", async () => {
    const [selectedInstance] = instances;

    renderWithProviders(<TagsAddForm selected={[selectedInstance]} />);
    await expectLoadingState();

    await Promise.all(
      screen
        .getAllByRole("checkbox")
        .map((checkbox) => userEvent.click(checkbox)),
    );

    await userEvent.click(screen.getByRole("button", { name: /assign/i }));

    const modal = await screen.findByRole("dialog");
    expect(modal).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /add tags/i }));
    expect(
      await screen.findByText(
        `Tags successfully assigned to "${selectedInstance.title}" instance`,
      ),
    ).toBeInTheDocument();
  });
});
