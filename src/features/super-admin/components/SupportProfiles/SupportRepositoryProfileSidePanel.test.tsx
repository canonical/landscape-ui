import SidePanel from "@/components/layout/SidePanel";
import { NO_DATA_TEXT } from "@/components/layout/NoData";
import type { RepositoryProfile } from "@/features/repository-profiles";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { aptSources } from "@/tests/mocks/apt-sources";
import { repositoryProfiles } from "@/tests/mocks/repositoryProfiles";
import { renderWithProviders } from "@/tests/render";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Suspense } from "react";
import { describe, expect, it } from "vitest";
import SupportRepositoryProfileSidePanel from "./SupportRepositoryProfileSidePanel";

const [baseProfile] = repositoryProfiles;

const serveProfile = (apt_sources: RepositoryProfile["apt_sources"]) => {
  assert(baseProfile);

  const profile: RepositoryProfile = { ...baseProfile, apt_sources };

  setEndpointStatus({
    status: "variant",
    path: "repositoryprofiles",
    response: {
      results: [profile],
      count: 1,
      next: null,
      previous: null,
    },
  });

  return profile;
};

const renderPanel = (name: string) =>
  renderWithProviders(
    <Suspense fallback={<SidePanel.LoadingState />}>
      <SupportRepositoryProfileSidePanel />
    </Suspense>,
    undefined,
    `/?sidePath=view&name=${name}`,
  );

const findSourcesTable = async () => {
  const heading = await screen.findByRole("heading", { name: "Sources" });
  const block = heading.closest("section");

  assert(block);

  return within(block);
};

const getSourceNames = (table: ReturnType<typeof within>) =>
  table
    .getAllByRole("row")
    .slice(1)
    .map((row: HTMLElement) => row.querySelector("td")?.textContent);

describe("SupportRepositoryProfileSidePanel", () => {
  const user = userEvent.setup();

  it("pages through more than ten sources", async () => {
    const profile = serveProfile([...aptSources]);

    renderPanel(profile.name);

    expect(
      await screen.findByRole("heading", { name: profile.title }),
    ).toBeInTheDocument();

    const sources = await findSourcesTable();

    expect(getSourceNames(sources)).toEqual(
      aptSources.slice(0, 10).map(({ name }) => name),
    );
    expect(sources.getByText("Page 1 of 2")).toBeInTheDocument();

    await user.click(sources.getByRole("button", { name: /next page/i }));

    expect(getSourceNames(sources)).toEqual(
      aptSources.slice(10).map(({ name }) => name),
    );
    expect(sources.getByText("Page 2 of 2")).toBeInTheDocument();

    await user.click(sources.getByRole("button", { name: /previous page/i }));

    expect(sources.getByText("Page 1 of 2")).toBeInTheDocument();
  });

  it("shows ten sources or fewer on a single page", async () => {
    const profile = serveProfile(aptSources.slice(0, 10));

    renderPanel(profile.name);

    const sources = await findSourcesTable();

    expect(getSourceNames(sources)).toHaveLength(10);
    expect(sources.queryByText(/^Page /)).not.toBeInTheDocument();
  });

  it("says when a profile has no sources", async () => {
    const profile = serveProfile([]);

    renderPanel(profile.name);

    const sources = await findSourcesTable();

    expect(
      sources.getByText("No sources have been added yet."),
    ).toBeInTheDocument();
  });

  it("shows a source without a GPG key as having no fingerprint", async () => {
    const [source] = aptSources;
    assert(source);

    const profile = serveProfile([{ ...source, gpg_key: null }]);

    renderPanel(profile.name);

    const sources = await findSourcesTable();

    expect(sources.getAllByText(NO_DATA_TEXT).length).toBeGreaterThan(0);
    expect(
      sources.queryByText(source.gpg_key.fingerprint),
    ).not.toBeInTheDocument();
  });
});
