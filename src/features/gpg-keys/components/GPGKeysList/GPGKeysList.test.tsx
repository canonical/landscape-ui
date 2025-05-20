import { gpgKeys } from "@/tests/mocks/gpgKey";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { describe, expect } from "vitest";
import GPGKeysList from "./GPGKeysList";

const props: ComponentProps<typeof GPGKeysList> = {
  items: gpgKeys,
};

describe("GPGKeysList", () => {
  beforeEach(() => {
    renderWithProviders(<GPGKeysList {...props} />);
  });

  it("should show all table columns", async () => {
    const columns = ["Name", "Access type", "Fingerprint"];

    const table = screen.getByRole("table");
    expect(table).toHaveTexts(columns);
  });

  it("should show Delete button for each row", async () => {
    for (const gpgKey of gpgKeys) {
      await userEvent.click(
        screen.getByLabelText(`${gpgKey.name} GPG key actions`),
      );

      const deleteButton = screen.getByRole("button", {
        name: `Remove ${gpgKey.name} GPG key`,
      });

      expect(deleteButton).toBeInTheDocument();
    }
  });
});
