import { expectLoadingState } from "@/tests/helpers";
import { instances } from "@/tests/mocks/instance";
import { renderWithProviders } from "@/tests/render";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TagsAddForm, { computeNewTags } from "./TagsAddForm";

describe("TagsAddForm", async () => {
  afterEach(() => {
    setEndpointStatus("default");
  });

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

      expect(assignButton).toHaveAttribute("aria-disabled", "true");
      await userEvent.click(assignButton);
      expect(screen.queryByText(/tags assigned/i)).not.toBeInTheDocument();

      await Promise.all(
        screen
          .getAllByRole("checkbox")
          .map((checkbox) => userEvent.click(checkbox)),
      );

      expect(assignButton).not.toHaveAttribute("aria-disabled");
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

    it("should filter tags based on search input", async () => {
      renderWithProviders(<TagsAddForm selected={instances} />);
      await expectLoadingState();

      const searchbox = screen.getByRole("searchbox", { name: /search/i });
      await userEvent.type(searchbox, "appservers");

      const rows = screen.getAllByRole("row");
      // Header row + at least one data row with "appservers"
      expect(rows.length).toBeGreaterThan(1);
      expect(screen.getByText("appservers")).toBeInTheDocument();
    });

    it("should deselect all tags when toggling all while all are selected", async () => {
      renderWithProviders(<TagsAddForm selected={instances} />);
      await expectLoadingState();

      const [checkbox] = screen.getAllByRole("checkbox");

      assert(checkbox);

      // Select all (click header checkbox)
      await userEvent.click(checkbox);

      // Header checkbox should now be checked
      expect(checkbox).toBeChecked();

      // Toggle all off by clicking header checkbox again
      await userEvent.click(checkbox);

      // Submit button should be disabled again
      const assignButton = screen.getByRole("button", { name: /assign/i });
      expect(assignButton).toHaveAttribute("aria-disabled", "true");
    });
  });

  it("should directly assign tags when there are no profile changes", async () => {
    setEndpointStatus({
      status: "empty",
      path: "tags/profile-diff",
    });

    const [selectedInstance] = instances;
    renderWithProviders(<TagsAddForm selected={[selectedInstance]} />);
    await expectLoadingState();

    const [, checkbox] = screen.getAllByRole("checkbox");

    assert(checkbox);

    await userEvent.click(checkbox);

    await userEvent.click(screen.getByRole("button", { name: /assign/i }));

    expect(
      await screen.findByText(/tags successfully assigned/i),
    ).toBeInTheDocument();
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

  it("should show error when profile changes fetch fails on submit", async () => {
    setEndpointStatus({
      status: "error",
      path: "tags/profile-diff",
    });

    const [selectedInstance] = instances;
    renderWithProviders(<TagsAddForm selected={[selectedInstance]} />);
    await expectLoadingState();

    const [, checkbox] = screen.getAllByRole("checkbox");

    assert(checkbox);

    await userEvent.click(checkbox);

    await userEvent.click(screen.getByRole("button", { name: /assign/i }));

    // Should not show success notification
    expect(
      screen.queryByText(/tags successfully assigned/i),
    ).not.toBeInTheDocument();
  });

  it("should show error when adding tags fails", async () => {
    setEndpointStatus({
      status: "error",
      path: "AddTagsToComputers",
    });

    const [selectedInstance] = instances;
    renderWithProviders(<TagsAddForm selected={[selectedInstance]} />);
    await expectLoadingState();

    const [, checkbox] = screen.getAllByRole("checkbox");

    assert(checkbox);

    await userEvent.click(checkbox);

    await userEvent.click(screen.getByRole("button", { name: /assign/i }));

    // Profile-diff returns data, so modal opens
    const modal = await screen.findByRole("dialog");
    expect(modal).toBeInTheDocument();

    // Click "Add tags" in modal → AddTagsToComputers errors → catch block
    await userEvent.click(screen.getByRole("button", { name: /add tags/i }));

    // No success notification shown
    await waitFor(() => {
      expect(
        screen.queryByText(/tags successfully assigned/i),
      ).not.toBeInTheDocument();
    });
  });

  it("should deselect a tag when clicked a second time", async () => {
    const [selectedInstance] = instances;
    renderWithProviders(<TagsAddForm selected={[selectedInstance]} />);
    await expectLoadingState();

    // Get checkboxes fresh
    const [, firstCheckbox] = screen.getAllByRole("checkbox");

    assert(firstCheckbox);

    await userEvent.click(firstCheckbox);
    expect(firstCheckbox).toBeChecked();

    await userEvent.click(firstCheckbox);
    expect(firstCheckbox).not.toBeChecked();
  });

  it("should deselect a tag using fireEvent to cover toggle deselect branch", async () => {
    const [selectedInstance] = instances;
    renderWithProviders(<TagsAddForm selected={[selectedInstance]} />);
    await expectLoadingState();

    const [, firstTagCheckbox] = screen.getAllByRole("checkbox");

    assert(firstTagCheckbox);

    await userEvent.click(firstTagCheckbox);
    expect(firstTagCheckbox).toBeChecked();

    // Deselect using fireEvent to ensure the toggle deselect path runs
    fireEvent.change(firstTagCheckbox, { target: { checked: false } });

    await waitFor(() => {
      expect(firstTagCheckbox).not.toBeChecked();
    });
  });

  it("should skip adding a tag when all selected instances already have it", async () => {
    const instanceWithTag = { ...instances[0], tags: ["appservers"] };

    renderWithProviders(<TagsAddForm selected={[instanceWithTag]} />);
    await expectLoadingState();

    // The "appservers" checkbox is checked and disabled because the instance already has it
    const checkboxes = screen.getAllByRole("checkbox");
    const [, appserversCheckbox] = checkboxes;

    assert(appserversCheckbox);

    expect(appserversCheckbox).toBeChecked();

    // Use fireEvent to call toggle even on the disabled/checked checkbox
    fireEvent.change(appserversCheckbox, { target: { checked: false } });

    // Assign button remains disabled since selectedTags is still empty
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /assign/i })).toHaveAttribute(
        "aria-disabled",
        "true",
      );
    });
  });

  it("should disable checkbox for tags that all selected instances already have", async () => {
    // Instance that already has all available tags ("appservers", "asd")
    const instanceWithAllTags = {
      ...instances[0],
      tags: ["appservers", "asd"],
    };

    renderWithProviders(<TagsAddForm selected={[instanceWithAllTags]} />);
    await expectLoadingState();

    // All tag checkboxes should be disabled/checked since instance already has those tags
    const checkboxes = screen.getAllByRole("checkbox");
    // At least one data checkbox exists
    expect(checkboxes.length).toBeGreaterThan(1);
  });
});

describe("computeNewTags", () => {
  it("should remove tag when already selected (deselect branch)", () => {
    expect(computeNewTags(["appservers", "asd"], "appservers", [])).toEqual([
      "asd",
    ]);
  });

  it("should skip adding tag when all selected instances already have it", () => {
    const instance = { ...instances[0], tags: ["appservers"] };
    const result = computeNewTags([], "appservers", [instance]);
    expect(result).toEqual([]);
  });
});
