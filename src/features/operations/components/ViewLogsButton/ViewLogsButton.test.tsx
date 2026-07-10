import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import ViewLogsButton from "./ViewLogsButton";
import usePageParams from "@/hooks/usePageParams/usePageParams";

const ComponentWrapper = ({ resource }: { readonly resource?: string }) => {
  const { sidePath, name } = usePageParams();

  return (
    <>
      <ViewLogsButton resource={resource} />
      <div data-testid="sidePath">{sidePath.join("&")}</div>
      <div data-testid="name">{name}</div>
    </>
  );
};

describe("ViewLogsButton", () => {
  it("overwrites side panel when resource is provided", async () => {
    renderWithProviders(
      <ComponentWrapper resource="mirrorName" />,
      undefined,
      "?sidePath=view&name=test-resource",
    );

    await userEvent.click(screen.getByRole("button", { name: /view logs/i }));

    expect(screen.getByTestId("sidePath")).toHaveTextContent("logs");
    expect(screen.getByTestId("name")).toHaveTextContent("mirrorName");
  });

  it("opens second side panel when no resource is provided", async () => {
    renderWithProviders(
      <ComponentWrapper />,
      undefined,
      "?sidePath=view&name=test-resource",
    );

    await userEvent.click(screen.getByRole("button", { name: /view logs/i }));

    expect(screen.getByTestId("sidePath")).toHaveTextContent("view&logs");
    expect(screen.getByTestId("name")).toHaveTextContent("test-resource");
  });
});
