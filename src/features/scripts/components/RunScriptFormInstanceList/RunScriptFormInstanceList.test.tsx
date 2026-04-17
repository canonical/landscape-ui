import { instances } from "@/tests/mocks/instance";
import { renderWithProviders } from "@/tests/render";
import type { Instance } from "@/types/Instance";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import RunScriptFormInstanceList from "./RunScriptFormInstanceList";

const [firstInstance, secondInstance] = instances;

describe("RunScriptFormInstanceList", () => {
  it("should render the instance and associated tag columns", () => {
    renderWithProviders(
      <RunScriptFormInstanceList instances={[firstInstance]} tags={[]} />,
    );

    expect(
      screen.getByRole("columnheader", { name: /instance/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: /associated tag/i }),
    ).toBeInTheDocument();
  });

  it("should display instance titles", () => {
    renderWithProviders(
      <RunScriptFormInstanceList
        instances={[firstInstance, secondInstance]}
        tags={[]}
      />,
    );

    expect(screen.getByText(firstInstance.title)).toBeInTheDocument();
    expect(screen.getByText(secondInstance.title)).toBeInTheDocument();
  });

  it("should only show tags that match the provided tags prop", () => {
    const instanceWithTags: Instance = {
      ...firstInstance,
      tags: ["appservers", "webfarm"],
    };
    const nonMatchingTag = "non-existent-tag";

    renderWithProviders(
      <RunScriptFormInstanceList
        instances={[instanceWithTags]}
        tags={["appservers", nonMatchingTag]}
      />,
    );

    expect(screen.getByText("appservers")).toBeInTheDocument();
    expect(screen.queryByText("webfarm")).not.toBeInTheDocument();
    expect(screen.queryByText(nonMatchingTag)).not.toBeInTheDocument();
  });

  it("should not show tags that are not in the provided tags prop", () => {
    renderWithProviders(
      <RunScriptFormInstanceList instances={[firstInstance]} tags={[]} />,
    );

    firstInstance.tags.forEach((tag) => {
      expect(screen.queryByText(tag)).not.toBeInTheDocument();
    });
  });

  it("should not render pagination when instances fit on one page", () => {
    renderWithProviders(
      <RunScriptFormInstanceList
        instances={[firstInstance, secondInstance]}
        tags={[]}
      />,
    );

    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
  });

  it("should render pagination when instances exceed page size", () => {
    const manyInstances = Array.from({ length: 11 }, (_, i) => ({
      ...firstInstance,
      id: i + 100,
      title: `Instance ${i + 1}`,
    }));

    renderWithProviders(
      <RunScriptFormInstanceList instances={manyInstances} tags={[]} />,
    );

    expect(screen.getByText(/page 1 of/i)).toBeInTheDocument();
  });

  it("should navigate to the next page when next is clicked", async () => {
    const user = userEvent.setup();
    const manyInstances = Array.from({ length: 11 }, (_, i) => ({
      ...firstInstance,
      id: i + 100,
      title: `Instance ${i + 1}`,
    }));

    renderWithProviders(
      <RunScriptFormInstanceList instances={manyInstances} tags={[]} />,
    );

    expect(screen.getByText("Instance 1")).toBeInTheDocument();
    expect(screen.queryByText("Instance 11")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /next page/i }));

    expect(screen.queryByText("Instance 1")).not.toBeInTheDocument();
    expect(screen.getByText("Instance 11")).toBeInTheDocument();
  });

  it("should navigate back to the previous page when previous is clicked", async () => {
    const user = userEvent.setup();
    const manyInstances = Array.from({ length: 11 }, (_, i) => ({
      ...firstInstance,
      id: i + 100,
      title: `Instance ${i + 1}`,
    }));

    renderWithProviders(
      <RunScriptFormInstanceList instances={manyInstances} tags={[]} />,
    );

    await user.click(screen.getByRole("button", { name: /next page/i }));
    expect(screen.getByText("Instance 11")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /previous page/i }));
    expect(screen.getByText("Instance 1")).toBeInTheDocument();
    expect(screen.queryByText("Instance 11")).not.toBeInTheDocument();
  });
});
