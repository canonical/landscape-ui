import { renderWithProviders } from "@/tests/render";
import TagsAddForm from "./TagsAddForm";
import { instances } from "@/tests/mocks/instance";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { getTestErrorParams } from "@/tests/mocks/error";
import type useInstances from "@/hooks/useInstances";

describe("TagsAddForm", async () => {
  const addTagsToInstances = vi.hoisted(() =>
    vi.fn(({ tags }: { tags: string[] }) => {
      if (tags.includes("error")) {
        const { testError } = getTestErrorParams();

        throw testError;
      }
    }),
  );
  const selected = instances;

  vi.mock("@/hooks/useInstances", async (importOriginal) => {
    const original = await importOriginal<{ default: typeof useInstances }>();

    return {
      default: () => ({
        ...original.default(),
        addTagsToInstancesQuery: {
          mutateAsync: addTagsToInstances,
        },
      }),
    };
  });

  describe("multiple instances", () => {
    beforeEach(() => {
      renderWithProviders(<TagsAddForm selected={selected} />);
    });

    it("should render form", () => {
      expect(
        screen.getByRole("combobox", { name: /tags/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /assign/i }),
      ).toBeInTheDocument();
    });

    it("should validate form", async () => {
      await userEvent.click(screen.getByRole("button", { name: /assign/i }));

      expect(addTagsToInstances).not.toHaveBeenCalled();

      expect(
        screen.getByText(/At least one tag is required/i),
      ).toBeInTheDocument();
    });

    it("should add selected tags to the selected instances", async () => {
      const tags = ["tag1", "tag2"];
      const query = selected.map(({ id }) => `id:${id}`).join(" OR ");

      await userEvent.click(screen.getByRole("combobox", { name: /tags/i }));

      for (const tag of tags) {
        await userEvent.click(screen.getByText(tag));
      }

      await userEvent.click(screen.getByRole("button", { name: /assign/i }));

      expect(addTagsToInstances).toHaveBeenCalledWith({ query, tags });
      expect(
        screen.getByText(
          `Tags successfully assigned to ${selected.length} instances`,
        ),
      ).toBeInTheDocument();
    });

    it("should handle error", async () => {
      const tags = ["error"];
      const { testErrorMessage } = getTestErrorParams();

      await userEvent.click(screen.getByRole("combobox", { name: /tags/i }));

      for (const tag of tags) {
        await userEvent.click(screen.getByText(tag));
      }

      await userEvent.click(screen.getByRole("button", { name: /assign/i }));

      expect(screen.getByText(testErrorMessage)).toBeInTheDocument();
    });
  });

  it("should add selected tags to the single instances", async () => {
    renderWithProviders(<TagsAddForm selected={selected.slice(-1)} />);

    const tags = ["tag1", "tag2"];
    const query = selected
      .slice(-1)
      .map(({ id }) => `id:${id}`)
      .join(" OR ");

    await userEvent.click(screen.getByRole("combobox", { name: /tags/i }));

    for (const tag of tags) {
      await userEvent.click(screen.getByText(tag));
    }

    await userEvent.click(screen.getByRole("button", { name: /assign/i }));

    expect(addTagsToInstances).toHaveBeenCalledWith({ query, tags });
    expect(
      screen.getByText(
        `Tags successfully assigned to "${selected[selected.length - 1].title}" instance`,
      ),
    ).toBeInTheDocument();
  });
});
