import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { renderWithProviders } from "@/tests/render";
import { completedExportJob, processingExportJob } from "@/tests/mocks/exports";
import ExportsListActions from "./ExportsListActions";

describe("ExportsListActions", () => {
  const user = userEvent.setup();

  it("renders the actions menu toggle button", () => {
    renderWithProviders(<ExportsListActions job={completedExportJob} />);
    expect(
      screen.getByRole("button", { name: /actions for/i }),
    ).toBeInTheDocument();
  });

  it("shows download and discard for completed jobs", async () => {
    renderWithProviders(<ExportsListActions job={completedExportJob} />);
    await user.click(screen.getByRole("button", { name: /actions for/i }));

    expect(
      await screen.findByRole("menuitem", { name: "Download" }),
    ).toBeInTheDocument();

    expect(
      await screen.findByRole("menuitem", { name: "Discard" }),
    ).toBeInTheDocument();
  });

  it("shows cancel for processing jobs", async () => {
    renderWithProviders(<ExportsListActions job={processingExportJob} />);
    await user.click(screen.getByRole("button", { name: /actions for/i }));

    expect(
      await screen.findByRole("menuitem", { name: "Cancel" }),
    ).toBeInTheDocument();
  });

  it("opens discard confirmation modal", async () => {
    renderWithProviders(<ExportsListActions job={completedExportJob} />);
    await user.click(screen.getByRole("button", { name: /actions for/i }));

    await user.click(await screen.findByRole("menuitem", { name: "Discard" }));

    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText(/permanently deleted/i)).toBeInTheDocument();
  });

  it("opens cancel confirmation modal for processing jobs", async () => {
    renderWithProviders(<ExportsListActions job={processingExportJob} />);
    await user.click(screen.getByRole("button", { name: /actions for/i }));

    await user.click(await screen.findByRole("menuitem", { name: "Cancel" }));

    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText(/still being generated/i)).toBeInTheDocument();
  });
});
