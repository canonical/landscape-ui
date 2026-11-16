import { AppErrorBoundary } from "@/components/layout/AppErrorBoundary";
import { renderWithProviders } from "@/tests/render";
import { useQuery } from "@tanstack/react-query";
import { screen } from "@testing-library/react";
import type { FC } from "react";
import { describe, expect, it } from "vitest";

const QUERY_ERROR_MESSAGE = "Query failed";

const FailingQuery: FC<{
  readonly throwOnError: boolean | (() => boolean);
  readonly queryKey?: string;
}> = ({ throwOnError, queryKey = "failing-query" }) => {
  const { isError } = useQuery({
    queryKey: [queryKey],
    queryFn: () => Promise.reject(new Error(QUERY_ERROR_MESSAGE)),
    throwOnError,
  });

  return isError ? <p>Query error handled locally</p> : null;
};

describe("ReactQueryProvider", () => {
  it("notifies about query errors", async () => {
    renderWithProviders(<FailingQuery throwOnError={false} />);

    expect(
      await screen.findByText("Query error handled locally"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(QUERY_ERROR_MESSAGE, {
        selector: ".p-notification__message",
      }),
    ).toBeInTheDocument();
  });

  it("does not notify about query errors thrown to an error boundary", async () => {
    renderWithProviders(
      <AppErrorBoundary>
        <FailingQuery throwOnError />
      </AppErrorBoundary>,
    );

    expect(await screen.findByText("Something went wrong")).toBeInTheDocument();
    expect(
      screen.queryByText(QUERY_ERROR_MESSAGE, {
        selector: ".p-notification__message",
      }),
    ).not.toBeInTheDocument();
  });

  it("notifies when a throwOnError function returns false", async () => {
    renderWithProviders(<FailingQuery throwOnError={() => false} />);

    expect(
      await screen.findByText(QUERY_ERROR_MESSAGE, {
        selector: ".p-notification__message",
      }),
    ).toBeInTheDocument();
  });

  it("does not notify when a throwOnError function returns true", async () => {
    renderWithProviders(
      <AppErrorBoundary>
        <FailingQuery throwOnError={() => true} />
      </AppErrorBoundary>,
    );

    expect(await screen.findByText("Something went wrong")).toBeInTheDocument();
    expect(
      screen.queryByText(QUERY_ERROR_MESSAGE, {
        selector: ".p-notification__message",
      }),
    ).not.toBeInTheDocument();
  });

  it("does not notify when any observer of the query throws to a boundary", async () => {
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
    expect(
      screen.queryByText(QUERY_ERROR_MESSAGE, {
        selector: ".p-notification__message",
      }),
    ).not.toBeInTheDocument();
  });
});
