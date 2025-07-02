import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import UserInfo from "./UserInfo";

const labels = ["Unknown user", "Alerts", "Sign out"];

describe("UserInfo", () => {
  it("renders correctly", () => {
    renderWithProviders(<UserInfo />);

    labels.forEach((label) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });
});
