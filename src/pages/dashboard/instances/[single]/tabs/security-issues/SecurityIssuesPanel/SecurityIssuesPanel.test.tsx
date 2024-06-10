import { describe, expect } from "vitest";
import { renderWithProviders } from "@/tests/render";
import { screen, waitFor } from "@testing-library/react";
import { expectLoadingState } from "@/tests/helpers";
import { instances } from "@/tests/mocks/instance";
import SecurityIssuesPanel from "@/pages/dashboard/instances/[single]/tabs/security-issues";
import { usns } from "@/tests/mocks/usn";

const props = {
  instance: instances[0],
  instanceTitle: instances[0].title,
};

describe("SecurityIssuesPanel", () => {
  it("should render list", async () => {
    renderWithProviders(<SecurityIssuesPanel {...props} />);

    await expectLoadingState();

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
