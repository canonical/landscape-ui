import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import UserInfo from "./UserInfo";
import { APP_COMMIT, APP_VERSION } from "@/constants";

const labels = ["Unknown user", "Alerts", "Sign out"];

describe("UserInfo", () => {
  it("renders correctly", () => {
    renderWithProviders(<UserInfo />);

    expect(
      screen.getByText(
        `v${APP_VERSION} (${APP_COMMIT ? APP_COMMIT.slice(0, 7) : "unknown"})`,
      ),
    ).toBeInTheDocument();
    labels.forEach((label) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });
});
