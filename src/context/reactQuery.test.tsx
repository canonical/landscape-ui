import { AppErrorBoundary } from "@/components/layout/AppErrorBoundary";
import { renderWithProviders } from "@/tests/render";
import type { ApiError } from "@/types/api/ApiError";
import { useQuery } from "@tanstack/react-query";
import { screen } from "@testing-library/react";
import type { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { AxiosError } from "axios";
import type { FC } from "react";
import { describe, expect, it } from "vitest";

const QUERY_ERROR_MESSAGE = "Query failed";
const API_ERROR_MESSAGE = "API request failed";
const AXIOS_ERROR_MESSAGE = "Network Error";

const createAxiosError = (data?: Partial<ApiError>) => {
  const config = { headers: {} } as InternalAxiosRequestConfig;
  const response = data
    ? ({
        data,
        status: 500,
        statusText: "Internal Server Error",
        headers: {},
        config,
      } as AxiosResponse<ApiError>)
    : undefined;

  return new AxiosError<ApiError>(
    AXIOS_ERROR_MESSAGE,
    "ERR_TEST",
    config,
    undefined,
    response,
  );
};

const FailingQuery: FC<{
  readonly throwOnError: boolean | (() => boolean);
  readonly queryKey?: string;
  readonly error?: Error;
}> = ({
  throwOnError,
  queryKey = "failing-query",
  error = new Error(QUERY_ERROR_MESSAGE),
}) => {
  const { isError } = useQuery({
    queryKey: [queryKey],
    queryFn: () => Promise.reject(error),
    throwOnError,
  });

  return isError ? <p>Query error handled locally</p> : null;
};

const expectNotification = async (message: string) => {
  expect(
    await screen.findByText(message, {
      selector: ".p-notification__message",
    }),
  ).toBeInTheDocument();
};

const expectNoNotification = () => {
  expect(
    document.querySelector(".p-notification__message"),
  ).not.toBeInTheDocument();
};

describe("ReactQueryProvider", () => {
  it("notifies about query errors", async () => {
    renderWithProviders(<FailingQuery throwOnError={false} />);

    expect(
      await screen.findByText("Query error handled locally"),
    ).toBeInTheDocument();
    await expectNotification(QUERY_ERROR_MESSAGE);
  });

  it("notifies about query errors without a message when not thrown to a boundary", async () => {
    renderWithProviders(
      <FailingQuery throwOnError={false} error={new Error("")} />,
    );

    expect(
      await screen.findByText("Query error handled locally"),
    ).toBeInTheDocument();
    await expectNotification("Unknown error");
  });

  it("notifies about query errors with a message thrown to an error boundary", async () => {
    renderWithProviders(
      <AppErrorBoundary>
        <FailingQuery throwOnError />
      </AppErrorBoundary>,
    );

    expect(await screen.findByText("Something went wrong")).toBeInTheDocument();
    await expectNotification(QUERY_ERROR_MESSAGE);
  });

  it("does not notify about query errors without a message thrown to an error boundary", async () => {
    renderWithProviders(
      <AppErrorBoundary>
        <FailingQuery throwOnError error={new Error("")} />
      </AppErrorBoundary>,
    );

    expect(await screen.findByText("Something went wrong")).toBeInTheDocument();
    expectNoNotification();
  });

  it("notifies when a throwOnError function returns false", async () => {
    renderWithProviders(<FailingQuery throwOnError={() => false} />);

    await expectNotification(QUERY_ERROR_MESSAGE);
  });

  it("notifies when a throwOnError function returns true and the error has a message", async () => {
    renderWithProviders(
      <AppErrorBoundary>
        <FailingQuery throwOnError={() => true} />
      </AppErrorBoundary>,
    );

    expect(await screen.findByText("Something went wrong")).toBeInTheDocument();
    await expectNotification(QUERY_ERROR_MESSAGE);
  });

  it("does not notify when a throwOnError function returns true and the error has no message", async () => {
    renderWithProviders(
      <AppErrorBoundary>
        <FailingQuery throwOnError={() => true} error={new Error("")} />
      </AppErrorBoundary>,
    );

    expect(await screen.findByText("Something went wrong")).toBeInTheDocument();
    expectNoNotification();
  });

  it("notifies with the API message for Axios errors with a response thrown to a boundary", async () => {
    renderWithProviders(
      <AppErrorBoundary>
        <FailingQuery
          throwOnError
          error={createAxiosError({ message: API_ERROR_MESSAGE })}
        />
      </AppErrorBoundary>,
    );

    expect(await screen.findByText("Something went wrong")).toBeInTheDocument();
    await expectNotification(API_ERROR_MESSAGE);
  });

  it("does not notify for Axios errors whose response has no message thrown to a boundary", async () => {
    renderWithProviders(
      <AppErrorBoundary>
        <FailingQuery throwOnError error={createAxiosError({})} />
      </AppErrorBoundary>,
    );

    expect(await screen.findByText("Something went wrong")).toBeInTheDocument();
    expectNoNotification();
  });

  it("notifies with the error message for Axios errors without a response thrown to a boundary", async () => {
    renderWithProviders(
      <AppErrorBoundary>
        <FailingQuery throwOnError error={createAxiosError()} />
      </AppErrorBoundary>,
    );

    expect(await screen.findByText("Something went wrong")).toBeInTheDocument();
    await expectNotification(AXIOS_ERROR_MESSAGE);
  });

  it("notifies when any observer of the query throws to a boundary and the error has a message", async () => {
    renderWithProviders(
      <>
        <FailingQuery throwOnError={false} queryKey="shared-query" />
        <AppErrorBoundary>
          <FailingQuery throwOnError queryKey="shared-query" />
        </AppErrorBoundary>
      </>,
    );

    expect(await screen.findByText("Something went wrong")).toBeInTheDocument();
    expect(screen.getByText("Query error handled locally")).toBeInTheDocument();
    await expectNotification(QUERY_ERROR_MESSAGE);
  });

  it("notifies when no observer of the query throws to a boundary and the error has no message", async () => {
    const error = new Error("");

    renderWithProviders(
      <>
        <FailingQuery
          throwOnError={false}
          queryKey="shared-query-no-boundary"
          error={error}
        />
        <FailingQuery
          throwOnError={() => false}
          queryKey="shared-query-no-boundary"
          error={error}
        />
      </>,
    );

    await expectNotification("Unknown error");
  });

  it("does not notify when any observer of the query throws to a boundary and the error has no message", async () => {
    const error = new Error("");

    renderWithProviders(
      <>
        <FailingQuery
          throwOnError={false}
          queryKey="shared-query-no-message"
          error={error}
        />
        <AppErrorBoundary>
          <FailingQuery
            throwOnError
            queryKey="shared-query-no-message"
            error={error}
          />
        </AppErrorBoundary>
      </>,
    );

    expect(await screen.findByText("Something went wrong")).toBeInTheDocument();
    expect(screen.getByText("Query error handled locally")).toBeInTheDocument();
    expectNoNotification();
  });
});
