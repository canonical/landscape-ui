import { API_URL, INPUT_DATE_TIME_FORMAT } from "@/constants";
import useSidePanel from "@/hooks/useSidePanel";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { scripts } from "@/tests/mocks/script";
import { renderWithProviders } from "@/tests/render";
import server from "@/tests/server";
import { ENDPOINT_STATUS_API_ERROR_MESSAGE } from "@/tests/server/handlers/_constants";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import date from "@/libs/date";
import { http, HttpResponse } from "msw";
import axios from "axios";
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

  it("does not send an instance query when targeting all computers", async () => {
    renderWithProviders(
      <ScriptProfileForm
        {...props}
        initialValues={{ ...props.initialValues, all_computers: true }}
      />,
    );

    await vi.waitFor(() => {
      expect(capturedUrl).toBeDefined();
    });

    expect(capturedUrl?.searchParams.has("query")).toBe(false);
  });
});

describe("ScriptProfileForm edge cases", () => {
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
    setEndpointStatus("default");
  });

  it("blocks submission when the selected script has no id", async () => {
    const onSubmit = vi.fn();

    renderWithProviders(
      <ScriptProfileForm
        {...props}
        onSubmit={onSubmit}
        initialValues={{
          ...props.initialValues,
          script: scripts[0],
          script_id: undefined,
        }}
      />,
    );

    await userEvent.click(
      await screen.findByRole("button", { name: "Submit" }),
    );

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("blocks submission when the recurring interval is invalid", async () => {
    const onSubmit = vi.fn();

    renderWithProviders(
      <ScriptProfileForm
        {...props}
        onSubmit={onSubmit}
        initialValues={{
          ...props.initialValues,
          trigger_type: "recurring",
          interval: "invalid",
          start_after: date().format(INPUT_DATE_TIME_FORMAT),
        }}
      />,
    );

    await userEvent.click(
      await screen.findByRole("button", { name: "Submit" }),
    );

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("blocks submission and notifies when the association limit is reached", async () => {
    setEndpointStatus({
      status: "variant",
      path: "computers",
      response: {
        results: [],
        count: 5000,
        next: null,
        previous: null,
      },
    });

    const onSubmit = vi.fn();

    renderWithProviders(
      <ScriptProfileForm
        {...props}
        onSubmit={onSubmit}
        initialValues={{ ...props.initialValues, tags: ["tag1"] }}
      />,
    );

    expect(
      await screen.findByText(/associated instances limit reached/i),
    ).toBeInTheDocument();

    await userEvent.click(
      await screen.findByRole("button", { name: "Submit" }),
    );

    expect(
      await screen.findByText("Association limit reached"),
    ).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it.each(["API", "non-API"])(
    "shows %s submission errors globally with a side panel open",
    async (errorType) => {
      const message =
        errorType === "API"
          ? ENDPOINT_STATUS_API_ERROR_MESSAGE
          : "submission failed";
      const onSubmit = vi.fn();

      if (errorType === "API") {
        setEndpointStatus({ status: "error", path: "script-profiles" });
        onSubmit.mockImplementation(async () => {
          await axios.post(`${API_URL}script-profiles`);
        });
      } else {
        onSubmit.mockRejectedValue(new Error(message));
      }

      const OpenProfileForm = () => {
        const { setSidePanelContent } = useSidePanel();

        return (
          <button
            onClick={() => {
              setSidePanelContent(
                "Test profile",
                <ScriptProfileForm {...props} onSubmit={onSubmit} />,
              );
            }}
          >
            Open profile form
          </button>
        );
      };

      renderWithProviders(<OpenProfileForm />);

      await userEvent.click(
        screen.getByRole("button", { name: "Open profile form" }),
      );

      await userEvent.click(
        await screen.findByRole("button", { name: "Submit" }),
      );

      const errorMessage = await screen.findByText(message);
      expect(errorMessage.closest("aside")).toBeNull();
      expect(screen.getAllByText(message)).toHaveLength(1);
      expect(
        screen.getByRole("textbox", { name: "Title" }).closest("aside"),
      ).not.toBeNull();
      expect(props.onSuccess).not.toHaveBeenCalled();
    },
  );

  it("shows duplicate script profile title errors inline", async () => {
    setEndpointStatus({
      status: "error",
      path: "script-profiles",
      response: {
        error: "ScriptProfileDuplicate",
      },
    });

    const onSubmit = vi.fn().mockImplementation(async () => {
      await axios.post(`${API_URL}script-profiles`);
    });

    renderWithProviders(<ScriptProfileForm {...props} onSubmit={onSubmit} />);

    await userEvent.click(
      await screen.findByRole("button", { name: "Submit" }),
    );

    const titleError = await screen.findByText(
      "Title already used by an active or archived script profile.",
    );
    expect(titleError).toHaveClass("p-form-validation__message");
  });

  it("renders nothing when the script profile limits are unavailable", async () => {
    setEndpointStatus({ status: "empty", path: "script-profile-limits" });

    renderWithProviders(<ScriptProfileForm {...props} />);

    await waitFor(() => {
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });

    expect(
      screen.queryByRole("textbox", { name: "Title" }),
    ).not.toBeInTheDocument();
  });
});
