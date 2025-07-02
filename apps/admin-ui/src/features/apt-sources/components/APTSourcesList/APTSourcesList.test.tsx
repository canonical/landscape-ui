import { aptSources } from "@/tests/mocks/apt-sources";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { describe, expect } from "vitest";
import APTSourcesList from "./APTSourcesList";

const props: ComponentProps<typeof APTSourcesList> = {
  items: aptSources,
};

describe("APTSourcesList", () => {
  beforeEach(() => {
    renderWithProviders(<APTSourcesList {...props} />);
  });

  it("should show all table columns", async () => {
    const columns = ["Name", "Access group", "Line"];

    const table = screen.getByRole("table");
    expect(table).toHaveTexts(columns);
  });

  it("should show Delete button for each row", async () => {
    for (const aptSource of aptSources) {
      await userEvent.click(
        screen.getByLabelText(`${aptSource.name} APT source actions`),
      );

      const deleteButton = screen.getByLabelText(
        `Remove ${aptSource.name} APT source`,
      );

      expect(deleteButton).toBeInTheDocument();
    }
  });
});
