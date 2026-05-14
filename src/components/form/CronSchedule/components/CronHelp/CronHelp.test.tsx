import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import CronHelp from "./CronHelp";

describe("CronHelp", () => {
  const user = userEvent.setup();

  it("renders the help button", () => {
    render(<CronHelp />);

    expect(
      screen.getByRole("button", { name: "Open cron help" }),
    ).toBeInTheDocument();
  });

  it("does not show the modal initially", () => {
    render(<CronHelp />);

    expect(
      screen.queryByRole("dialog", { name: "Cron job format" }),
    ).not.toBeInTheDocument();
  });

  it("opens the modal when the help button is clicked", async () => {
    render(<CronHelp />);

    await user.click(screen.getByRole("button", { name: "Open cron help" }));

    expect(
      screen.getByRole("dialog", { name: "Cron job format" }),
    ).toBeInTheDocument();
  });

  it("shows example and accepted values sections in the modal", async () => {
    render(<CronHelp />);

    await user.click(screen.getByRole("button", { name: "Open cron help" }));

    expect(screen.getByText("Example")).toBeInTheDocument();
    expect(screen.getByText("Accepted values")).toBeInTheDocument();
  });

  it("shows the cron example phrase in the modal", async () => {
    render(<CronHelp />);

    await user.click(screen.getByRole("button", { name: "Open cron help" }));

    expect(
      screen.getByText(
        /"at minute 1 on day-of-month 2 in every month from January through March"/i,
      ),
    ).toBeInTheDocument();
  });

  it("closes the modal when the close button is clicked", async () => {
    render(<CronHelp />);

    await user.click(screen.getByRole("button", { name: "Open cron help" }));

    expect(
      screen.getByRole("dialog", { name: "Cron job format" }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /close/i }));

    expect(
      screen.queryByRole("dialog", { name: "Cron job format" }),
    ).not.toBeInTheDocument();
  });
});
