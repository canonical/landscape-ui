import { ROOT_PATH } from "@/constants";
import { accessGroups } from "@/tests/mocks/accessGroup";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import type { ComponentProps } from "react";
import { describe, expect } from "vitest";
import AccessGroupInstanceCountCell from "./AccessGroupInstanceCountCell";

const props: ComponentProps<typeof AccessGroupInstanceCountCell> = {
  accessGroup: {
    ...accessGroups[0],
    instancesCount: 0,
  },
};

describe("AccessGroupInstanceCountCell", () => {
  it("renders AccessGroupInstanceCountCell", async () => {
    renderWithProviders(<AccessGroupInstanceCountCell {...props} />);
    const link = await screen.findByRole("link");
    expect(link).toBeInTheDocument();
    expect(link.getAttribute("href")).toBe(
      `${ROOT_PATH}instances?accessGroups=${props.accessGroup.name}`,
    );
  });
});
