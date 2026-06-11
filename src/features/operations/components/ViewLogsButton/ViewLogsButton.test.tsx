import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import ViewLogsButton from "./ViewLogsButton";
import { useLocation } from "react-router";

const ComponentWrapper = () => {
  const { search } = useLocation();

  return (
    <>
      <ViewLogsButton resource="test-resource" />
      <div data-testid="location">{search}</div>
    </>
  );
};

describe("ViewLogsButton", () => {
  it("opens side panel with logs action when sidePath is empty", async () => {
    renderWithProviders(<ComponentWrapper />);

    await userEvent.click(
      screen.getByRole("button", { name: /view logs/i }),
    );

    expect(screen.getByTestId("location")).toHaveTextContent(
      "?sidePath=logs&name=test-resource",
    );
  });

  it("pushes side path when sidePath is not empty", async () => {
    renderWithProviders(
      <ComponentWrapper />,
      undefined,
      "?sidePath=view&name=test-resource"
    );

    await userEvent.click(
      screen.getByRole("button", { name: /view logs/i }),
    );

    const location = screen.getByTestId("location");
    expect(location).toHaveTextContent(
      "name=test-resource",
    );
    expect(location).toHaveTextContent(
      "sidePath=view%2Clogs",
    );
  });
});
