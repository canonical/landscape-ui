import type { StaffAccountAdministrator } from "@/features/super-admin";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import StaffAccountAdministrators from "./StaffAccountAdministrators";

const administrators: StaffAccountAdministrator[] = [
  { name: "Jane Doe", email: "jane@acme.com", openid: null },
  { name: "Hank Scorpio", email: "hank@globex.com", openid: null },
];

describe("StaffAccountAdministrators", () => {
  it("renders the name and email of every administrator", () => {
    const { container } = renderWithProviders(
      <StaffAccountAdministrators administrators={administrators} />,
    );

    expect(container).toHaveTexts(["Name", "Email"]);

    for (const { name, email } of administrators) {
      expect(screen.getByText(name)).toBeInTheDocument();
      expect(screen.getByText(email)).toBeInTheDocument();
    }
  });

  it("renders the empty message without administrators", () => {
    renderWithProviders(<StaffAccountAdministrators administrators={[]} />);

    expect(
      screen.getByText("This account has no administrators."),
    ).toBeInTheDocument();
  });
});
