import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import CronSchedule from "./CronSchedule";

const onChange = vi.fn();

describe("CronSchedule", () => {
  it("renders the schedule label", () => {
    render(<CronSchedule value="* * * * *" onChange={onChange} />);

    expect(screen.getByText("Schedule")).toBeInTheDocument();
  });

  it("renders the help button", () => {
    render(<CronSchedule value="* * * * *" onChange={onChange} />);

    expect(
      screen.getByRole("button", { name: /open cron help/i }),
    ).toBeInTheDocument();
  });

  it("renders the input field", () => {
    render(<CronSchedule value="* * * * *" onChange={onChange} />);

    expect(
      screen.getByRole("textbox", { name: /schedule/i }),
    ).toBeInTheDocument();
  });

  it("shows the cron phrase as help text for a valid cron value", () => {
    render(<CronSchedule value="0 12 * * *" onChange={onChange} />);

    expect(screen.getByText(/"At 12:00"/)).toBeInTheDocument();
  });

  it("does not show an error for an invalid cron value when not touched", () => {
    render(
      <CronSchedule value="invalid" touched={false} onChange={onChange} />,
    );

    expect(
      screen.queryByText(/Enter a complete interval/),
    ).not.toBeInTheDocument();
  });

  it("shows an error for an invalid cron value when touched", () => {
    render(<CronSchedule value="invalid" touched={true} onChange={onChange} />);

    expect(screen.getByText("Enter a complete interval.")).toBeInTheDocument();
  });

  it("shows no error for a valid cron value even when touched", () => {
    render(
      <CronSchedule value="* * * * *" touched={true} onChange={onChange} />,
    );

    expect(
      screen.queryByText(/Enter a complete interval/),
    ).not.toBeInTheDocument();
  });
});
