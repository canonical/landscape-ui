import useLocalSidePanel from "@/hooks/useLocalSidePanel";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { FC } from "react";
import { useBoolean } from "usehooks-ts";
import { describe, it } from "vitest";
import LocalSidePanelProvider from "./localSidePanel";

const TestComponent: FC = () => {
  const SidePanel = useLocalSidePanel();

  const { value: isOpen, setFalse: close } = useBoolean(true);

  if (isOpen) {
    return (
      <SidePanel close={close} title="Title">
        Content
      </SidePanel>
    );
  } else {
    return null;
  }
};

describe("localSidePanel", () => {
  it("should collapse when closed", async () => {
    renderWithProviders(
      <LocalSidePanelProvider>
        <TestComponent />
      </LocalSidePanelProvider>,
      undefined,
      "/root?panel=true",
    );

    const titleElement = screen.getByText("Title");
    const contentElement = screen.getByText("Content");

    expect(titleElement).toBeInTheDocument();
    expect(contentElement).toBeInTheDocument();

    await userEvent.click(
      screen.getByRole("button", { name: "Close side panel" }),
    );

    expect(titleElement).not.toBeInTheDocument();
    expect(contentElement).not.toBeInTheDocument();
  });
});
