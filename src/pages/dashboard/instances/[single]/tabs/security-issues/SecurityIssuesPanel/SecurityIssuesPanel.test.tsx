import { describe, expect } from "vitest";
import { renderWithProviders } from "@/tests/render";
import { screen, waitFor } from "@testing-library/react";
import { expectLoadingState } from "@/tests/helpers";
import { instances } from "@/tests/mocks/instance";
import SecurityIssuesPanel from "@/pages/dashboard/instances/[single]/tabs/security-issues";
import { usns } from "@/tests/mocks/usn";

const props = {
  instance: instances[0],
};

describe("SecurityIssuesPanel", () => {
  it("should render list", async () => {
    renderWithProviders(<SecurityIssuesPanel {...props} />);

    expectLoadingState();

    await waitFor(() => {
      usns.forEach((item) => {
        expect(
          screen.getByRole("link", {
            name: item.usn,
          }),
        ).toBeInTheDocument();
      });
    });
  });
});
