import { describe, expect } from "vitest";
import InfoPanel from "./InfoPanel";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/tests/render";
import { instances } from "@/tests/mocks/instance";
import type { Instance } from "@/types/Instance";
import userEvent from "@testing-library/user-event";

const PROPS_TO_CHECK: (keyof Instance)[] = [
  "title",
  "hostname",
  "distribution",
  "access_group",
  "comment",
];

beforeEach(() => {
  renderWithProviders(<InfoPanel instance={instances[0]} />);
});

describe("InfoPanel", () => {
  it("should render instance info", () => {
    for (const prop of PROPS_TO_CHECK) {
      expect(screen.getByText(instances[0][prop] as string)).toBeVisible();
    }
  });

  it("should edit instance", async () => {
    const editButton = screen.getByRole("button", {
      name: /edit/i,
    });

    await userEvent.click(editButton);

    expect(
      await screen.findByRole("heading", {
        name: /edit instance/i,
      }),
    ).toBeVisible();

    expect(
      await screen.findByRole("textbox", {
        name: /title/i,
      }),
    ).toHaveValue(instances[0].title);
  });
});
