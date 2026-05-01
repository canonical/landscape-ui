import { setEndpointStatus } from "@/tests/controllers/controller";
import { scriptVersion } from "@/tests/mocks/script";
import { renderWithProviders } from "@/tests/render";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { beforeEach, describe, expect, it } from "vitest";
import { getAuthorInfo } from "../../helpers";
import ScriptVersionHistoryDetails from "./ScriptVersionHistoryDetails";

const props: ComponentProps<typeof ScriptVersionHistoryDetails> = {
  scriptId: scriptVersion.id,
  scriptVersion: scriptVersion,
  isArchived: false,
  goBack: vi.fn(),
};

describe("Script Version History Details", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    setEndpointStatus("default");
  });

  it("should render script version history details", async () => {
    renderWithProviders(<ScriptVersionHistoryDetails {...props} />);

    expect(
      screen.getByText(
        getAuthorInfo({
          author: props.scriptVersion.created_by.name,
          date: props.scriptVersion.created_at,
        }),
      ),
    ).toBeInTheDocument();

    const codeBlock = await screen.findByText("Code");
    expect(codeBlock).toBeInTheDocument();

    expect(
      screen.getByText(`#!${props.scriptVersion.interpreter}`),
    ).toBeInTheDocument();
    expect(screen.getByText(props.scriptVersion.code)).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /use as new version/i }),
    ).toBeInTheDocument();

    expect(screen.getByRole("button", { name: /back/i })).toBeInTheDocument();
  });

  it("should not render edit button if archived", async () => {
    renderWithProviders(
      <ScriptVersionHistoryDetails {...props} isArchived={true} />,
    );

    expect(
      screen.queryByRole("button", { name: /use as new version/i }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /back/i })).toBeInTheDocument();
  });

  it("should open modal", async () => {
    renderWithProviders(<ScriptVersionHistoryDetails {...props} />);

    const actionButton = screen.getByRole("button", {
      name: /use as new version/i,
    });

    expect(actionButton).toBeInTheDocument();

    await user.click(actionButton);

    const modal = await screen.findByRole("dialog");
    expect(modal).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /submit new version/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /all future script runs will be done using the latest version of the code./i,
      ),
    ).toBeInTheDocument();

    const modalCancelButton = within(modal).getByRole("button", {
      name: /cancel/i,
    });
    await user.click(modalCancelButton);
    expect(modal).not.toBeInTheDocument();
  });

  it("should confirm and submit new version", async () => {
    renderWithProviders(<ScriptVersionHistoryDetails {...props} />);

    const actionButton = await screen.findByRole("button", {
      name: /use as new version/i,
    });

    await user.click(actionButton);

    const confirmButton = await screen.findByRole("button", {
      name: /submit new version/i,
    });
    await user.click(confirmButton);

    // After success, goBack should be called
  });

  it("should call goBack when Back button is clicked", async () => {
    const goBack = vi.fn();
    renderWithProviders(
      <ScriptVersionHistoryDetails {...props} goBack={goBack} />,
    );

    const backButton = screen.getByRole("button", { name: /back/i });
    await user.click(backButton);

    expect(goBack).toHaveBeenCalledOnce();
  });

  it("should not call goBack when version is not loaded on submit", async () => {
    setEndpointStatus({ status: "error", path: "scripts/versions/detail" });
    const goBack = vi.fn();
    renderWithProviders(
      <ScriptVersionHistoryDetails {...props} goBack={goBack} />,
    );

    const actionButton = screen.getByRole("button", {
      name: /use as new version/i,
    });
    await user.click(actionButton);

    const confirmButton = await screen.findByRole("button", {
      name: /submit new version/i,
    });
    await user.click(confirmButton);

    expect(goBack).not.toHaveBeenCalled();
  });

  it("should handle error when submitting new version", async () => {
    setEndpointStatus({ status: "error", path: "EditScript" });
    renderWithProviders(<ScriptVersionHistoryDetails {...props} />);

    const actionButton = await screen.findByRole("button", {
      name: /use as new version/i,
    });
    await user.click(actionButton);

    const confirmButton = await screen.findByRole("button", {
      name: /submit new version/i,
    });
    await user.click(confirmButton);

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });
});
