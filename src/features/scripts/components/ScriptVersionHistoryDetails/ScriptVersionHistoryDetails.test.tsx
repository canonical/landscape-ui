import { setEndpointStatus } from "@/tests/controllers/controller";
import { scriptVersion } from "@/tests/mocks/script";
import { renderWithProviders } from "@/tests/render";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LocationDisplay from "@/tests/LocationDisplay";
import { beforeEach, describe, expect, it } from "vitest";
import { getAuthorInfo } from "../../helpers";
import ScriptVersionHistoryDetails from "./ScriptVersionHistoryDetails";

const defaultProps = {
  scriptId: scriptVersion.id,
  isArchived: false,
  versionId: String(scriptVersion.version_number),
};

const routePath = `/?sidePath=history,detail&version=${scriptVersion.version_number}`;

describe("Script Version History Details", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    setEndpointStatus("default");
  });

  it("should render script version history details", async () => {
    renderWithProviders(
      <ScriptVersionHistoryDetails {...defaultProps} />,
      undefined,
      routePath,
    );

    expect(
      await screen.findByText(
        getAuthorInfo({
          author: scriptVersion.creator_name,
          date: scriptVersion.created_at,
        }),
      ),
    ).toBeInTheDocument();

    const codeBlock = await screen.findByText("Code");
    expect(codeBlock).toBeInTheDocument();

    expect(
      screen.getByText(`#!${scriptVersion.interpreter}`),
    ).toBeInTheDocument();
    expect(screen.getByText(scriptVersion.code)).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /use as new version/i }),
    ).toBeInTheDocument();

    expect(screen.getByRole("button", { name: /back/i })).toBeInTheDocument();
  });

  it("should not render edit button if archived", async () => {
    renderWithProviders(
      <ScriptVersionHistoryDetails {...defaultProps} isArchived={true} />,
      undefined,
      routePath,
    );

    expect(
      screen.queryByRole("button", { name: /use as new version/i }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /back/i })).toBeInTheDocument();
  });

  it("should open modal", async () => {
    renderWithProviders(
      <ScriptVersionHistoryDetails {...defaultProps} />,
      undefined,
      routePath,
    );

    const actionButton = await screen.findByRole("button", {
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
    renderWithProviders(
      <>
        <ScriptVersionHistoryDetails {...defaultProps} />
        <LocationDisplay />
      </>,
      undefined,
      routePath,
    );

    const actionButton = await screen.findByRole("button", {
      name: /use as new version/i,
    });

    await user.click(actionButton);

    const confirmButton = await screen.findByRole("button", {
      name: /submit new version/i,
    });
    await user.click(confirmButton);

    await waitFor(() => {
      expect(screen.getByTestId("location").textContent).not.toContain(
        "detail",
      );
    });
  });

  it("should pop sidePath when Back button is clicked", async () => {
    renderWithProviders(
      <>
        <ScriptVersionHistoryDetails {...defaultProps} />
        <LocationDisplay />
      </>,
      undefined,
      routePath,
    );

    const backButton = await screen.findByRole("button", { name: /back/i });
    await user.click(backButton);

    await waitFor(() => {
      expect(screen.getByTestId("location").textContent).not.toContain(
        "detail",
      );
    });
  });

  it("should not navigate when version is not loaded on submit", async () => {
    setEndpointStatus({ status: "error", path: "scripts/versions/detail" });
    renderWithProviders(
      <>
        <ScriptVersionHistoryDetails {...defaultProps} />
        <LocationDisplay />
      </>,
      undefined,
      routePath,
    );

    const actionButton = screen.getByRole("button", {
      name: /use as new version/i,
    });
    await user.click(actionButton);

    const confirmButton = await screen.findByRole("button", {
      name: /submit new version/i,
    });
    await user.click(confirmButton);

    expect(screen.getByTestId("location").textContent).toContain("detail");
  });

  it("should handle error when submitting new version", async () => {
    setEndpointStatus({ status: "error", path: "EditScript" });
    renderWithProviders(
      <ScriptVersionHistoryDetails {...defaultProps} />,
      undefined,
      routePath,
    );

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
