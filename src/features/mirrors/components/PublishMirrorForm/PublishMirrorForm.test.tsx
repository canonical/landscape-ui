import LoadingState from "@/components/layout/LoadingState";
import usePageParams from "@/hooks/usePageParams";
import { mirrors } from "@/tests/mocks/mirrors";
import { renderWithProviders } from "@/tests/render";
import { describe, expect, it } from "vitest";
import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/react";
import { Suspense } from "react";
import PublishMirrorForm from "./PublishMirrorForm";

const TestComponent = () => {
  const { lastSidePathSegment } = usePageParams();

  if (lastSidePathSegment === "publish") {
    return <PublishMirrorForm />;
  }
};

describe("PublishMirrorForm", () => {
  const user = userEvent.setup();

  it("publishes to a new publication", async () => {
    renderWithProviders(
      <Suspense fallback={<LoadingState />}>
        <TestComponent />
      </Suspense>,
      undefined,
      `?sidePath=publish&name=${mirrors[0].name}`,
    );

    await user.type(
      await screen.findByRole("textbox", { name: "Publication name" }),
      "My publication",
    );
    await user.click(screen.getByRole("button", { name: "Publish mirror" }));

    expect(
      await screen.findByText(
        `You have marked ${mirrors[0].displayName} to be published`,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "A publication has been created and an activity has been queued to publish it to the designated target.",
      ),
    ).toBeInTheDocument();
  });

  it("publishes to an existing publication", async () => {
    renderWithProviders(
      <Suspense fallback={<LoadingState />}>
        <TestComponent />
      </Suspense>,
      undefined,
      `?sidePath=publish&name=${mirrors[0].name}`,
    );

    await user.click(
      await screen.findByRole("radio", { name: "Existing publication" }),
    );
    await user.click(screen.getByRole("button", { name: "Publish mirror" }));

    expect(
      await screen.findByText(
        `You have marked ${mirrors[0].displayName} to be published`,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "An activity has been queued to publish the selected publication to the designated target.",
      ),
    ).toBeInTheDocument();
  });
});
