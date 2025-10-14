import { NO_DATA_TEXT } from "@/components/layout/NoData";
import { ROUTES } from "@/libs/routes";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ProfileAssociatedInstancesLink from "./ProfileAssociatedInstancesLink";

describe("ProfileAssociatedInstancesLink", () => {
  it("renders empty data for a profile without tags or all computers", () => {
    renderWithProviders(
      <ProfileAssociatedInstancesLink
        count={0}
        profile={{
          tags: [],
        }}
        query=""
      />,
    );

    expect(screen.getByText(NO_DATA_TEXT)).toBeInTheDocument();
  });

  it("renders plain text for a profile with zero instances", () => {
    renderWithProviders(
      <ProfileAssociatedInstancesLink
        count={0}
        profile={{ tags: ["tag"] }}
        query=""
      />,
    );

    expect(screen.getByText("0 instances")).toBeInTheDocument();
  });

  it("renders a link for a profile with instances", () => {
    const query = "query";

    renderWithProviders(
      <ProfileAssociatedInstancesLink
        count={1}
        profile={{ tags: ["tag"] }}
        query={query}
      />,
    );

    const link = screen.getByRole("link", { name: "1 instance" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute(
      "href",
      ROUTES.instances.root({ query: `profile:${query}` }),
    );
  });
});
