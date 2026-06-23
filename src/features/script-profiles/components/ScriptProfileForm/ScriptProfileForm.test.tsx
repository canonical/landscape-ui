import { API_URL, INPUT_DATE_TIME_FORMAT } from "@/constants";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { renderWithProviders } from "@/tests/render";
import server from "@/tests/server";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import date from "@/libs/date";
import { http, HttpResponse } from "msw";
import type { ComponentProps } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ScriptProfileForm from "./ScriptProfileForm";

describe("ScriptProfileForm", () => {
  const props: ComponentProps<typeof ScriptProfileForm> = {
    initialValues: {
      all_computers: false,
      interval: "0 0 * * *",
      start_after: date().format(INPUT_DATE_TIME_FORMAT),
      tags: [],
      time_limit: 300,
      timestamp: date().format(INPUT_DATE_TIME_FORMAT),
      title: "New profile",
      trigger_type: "event",
      username: "root",
      script_id: 0,
    },
    onSubmit: vi.fn(),
    onSuccess: vi.fn(),
    submitButtonText: "Submit",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should submit with event type", async () => {
    renderWithProviders(<ScriptProfileForm {...props} />);

    const submitButton = await screen.findByRole("button", { name: "Submit" });

    await userEvent.click(submitButton);

    expect(props.onSubmit).toHaveBeenCalledTimes(1);
    expect(props.onSuccess).toHaveBeenCalledTimes(1);
  });

  it("should submit with one-time type", async () => {
    renderWithProviders(
      <ScriptProfileForm
        {...props}
        initialValues={{ ...props.initialValues, trigger_type: "one_time" }}
      />,
    );

    const submitButton = await screen.findByRole("button", { name: "Submit" });

    await userEvent.click(submitButton);

    expect(props.onSubmit).toHaveBeenCalledTimes(1);
    expect(props.onSuccess).toHaveBeenCalledTimes(1);
  });

  it("should submit with recurring type", async () => {
    renderWithProviders(
      <ScriptProfileForm
        {...props}
        initialValues={{ ...props.initialValues, trigger_type: "recurring" }}
      />,
    );

    const submitButton = await screen.findByRole("button", { name: "Submit" });

    await userEvent.click(submitButton);

    expect(props.onSubmit).toHaveBeenCalledTimes(1);
    expect(props.onSuccess).toHaveBeenCalledTimes(1);
  });
});

describe("ScriptProfileForm instances request params", () => {
  const props: ComponentProps<typeof ScriptProfileForm> = {
    initialValues: {
      all_computers: false,
      interval: "0 0 * * *",
      start_after: date().format(INPUT_DATE_TIME_FORMAT),
      tags: [],
      time_limit: 300,
      timestamp: date().format(INPUT_DATE_TIME_FORMAT),
      title: "New profile",
      trigger_type: "event",
      username: "root",
      script_id: 0,
    },
    onSubmit: vi.fn(),
    onSuccess: vi.fn(),
    submitButtonText: "Submit",
  };

  let capturedUrl: URL | undefined;

  beforeEach(() => {
    capturedUrl = undefined;
    setEndpointStatus("default");

    server.use(
      http.get(`${API_URL}computers`, ({ request }) => {
        capturedUrl = new URL(request.url);
        return HttpResponse.json({
          results: [],
          count: 0,
          next: null,
          previous: null,
        });
      }),
    );
  });

  it("omits query entirely when no tags are selected", async () => {
    renderWithProviders(<ScriptProfileForm {...props} />);

    await vi.waitFor(() => {
      expect(capturedUrl).toBeDefined();
    });

    expect(capturedUrl?.searchParams.has("query")).toBe(false);
  });
});
