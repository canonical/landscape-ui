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

const SwitchResourceWrapper = () => {
  const { search } = useLocation();

  return (
    <>
      <div aria-label="resource-a-row">
        <ViewLogsButton resource="resource-a" />
      </div>
      <div aria-label="resource-b-row">
        <ViewLogsButton resource="resource-b" />
      </div>
      <div data-testid="location">{search}</div>
    </>
  );
};

describe("ViewLogsButton", () => {
  it("opens side panel with logs action when sidePath is empty", async () => {
    renderWithProviders(<ComponentWrapper />);

    await userEvent.click(screen.getByRole("button", { name: /view logs/i }));

    expect(screen.getByTestId("location")).toHaveTextContent(
      "?sidePath=logs&name=test-resource",
    );
  });

  it("replaces side path with logs when sidePath is not empty", async () => {
    renderWithProviders(
      <ComponentWrapper />,
      undefined,
      "?sidePath=view&name=test-resource",
    );

    await userEvent.click(screen.getByRole("button", { name: /view logs/i }));

    const location = screen.getByTestId("location");
    expect(location).toHaveTextContent("name=test-resource");
    expect(location).toHaveTextContent("sidePath=logs");
  });

  it("keeps single logs sidePath on repeated clicks", async () => {
    renderWithProviders(<ComponentWrapper />);

    const viewLogsButton = screen.getByRole("button", { name: /view logs/i });
    await userEvent.click(viewLogsButton);
    await userEvent.click(viewLogsButton);
    await userEvent.click(viewLogsButton);

    expect(screen.getByTestId("location")).toHaveTextContent(
      "?sidePath=logs&name=test-resource",
    );
  });

  it("updates name when switching resources", async () => {
    renderWithProviders(<SwitchResourceWrapper />);

    expect(
      screen.getAllByRole("button", {
        name: /view logs/i,
      }),
    ).toHaveLength(2);

    const firstButton = screen
      .getByLabelText("resource-a-row")
      .querySelector("button");
    const secondButton = screen
      .getByLabelText("resource-b-row")
      .querySelector("button");

    expect(firstButton).not.toBeNull();
    expect(secondButton).not.toBeNull();

    if (!firstButton || !secondButton) {
      throw new Error("Expected both View logs buttons to be present");
    }

    await userEvent.click(firstButton);
    expect(screen.getByTestId("location")).toHaveTextContent(
      "?sidePath=logs&name=resource-a",
    );

    await userEvent.click(secondButton);
    expect(screen.getByTestId("location")).toHaveTextContent(
      "?sidePath=logs&name=resource-b",
    );
  });
});
