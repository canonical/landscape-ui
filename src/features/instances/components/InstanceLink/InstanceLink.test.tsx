import { renderWithProviders } from "@/tests/render";
import { describe, expect, it } from "vitest";
import InstanceLink from "./InstanceLink";
import { instances } from "@/tests/mocks/instance";
import { screen } from "@testing-library/react";
import { NO_DATA_TEXT } from "@/components/layout/NoData";

describe("InstanceLink", () => {
  it("renders an instance title", async () => {
    renderWithProviders(<InstanceLink instanceId={instances[0].id} />);

    expect(
      await screen.findByRole("link", { name: instances[0].title }),
    ).toBeInTheDocument();
  });

  it("renders no data", async () => {
    renderWithProviders(<InstanceLink instanceId={-1} />);

    expect(await screen.findByText(NO_DATA_TEXT)).toBeInTheDocument();
  });
});
