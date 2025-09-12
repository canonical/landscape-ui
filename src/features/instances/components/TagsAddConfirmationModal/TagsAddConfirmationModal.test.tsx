/* eslint @typescript-eslint/prefer-readonly-parameter-types: 0 */

import { renderWithProviders } from "@/tests/render";
import TagsAddConfirmationModal from "./TagsAddConfirmationModal";
import { screen } from "@testing-library/react";
import { instances } from "@/tests/mocks/instance";
import type { ComponentProps } from "react";
import { profileChanges, tags } from "@/tests/mocks/tag";
import { pluralize } from "@/utils/_helpers";
import { expectLoadingState } from "@/tests/helpers";

const props: ComponentProps<typeof TagsAddConfirmationModal> = {
  instances: instances.slice(0, 2),
  profileChangesCount: 11,
  tags: tags,
  onConfirm: vi.fn(),
};

describe("TagsAddConfirmationModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it.each([{ testTags: [tags[0]] }, { testTags: tags }])(
    "renders modal with correct title and content for %p tags",
    ({ testTags }) => {
      renderWithProviders(
        <TagsAddConfirmationModal {...props} tags={testTags} />,
      );

      const title = `Add ${pluralize(testTags.length, `"${testTags[0]}" tag`, `${testTags.length} tags`)} to ${pluralize(props.instances.length, `"${props.instances[0].title}"`, `${props.instances.length} instances`)}`;
      expect(screen.getByText(title)).toBeInTheDocument();
    },
  );

  it("does not render the tag column when only one tag is added", async () => {
    renderWithProviders(
      <TagsAddConfirmationModal {...props} tags={[tags[0]]} />,
    );

    await expectLoadingState();

    expect(
      screen.queryByRole("columnheader", { name: /tag/i }),
    ).not.toBeInTheDocument();
  });

  it("renders the tag column when multiple tags are added", async () => {
    renderWithProviders(<TagsAddConfirmationModal {...props} />);

    await expectLoadingState();

    expect(
      screen.getByRole("columnheader", { name: /tag/i }),
    ).toBeInTheDocument();
  });

  it("shows the exceed limit warning for profiles that will exceed instance limits", async () => {
    renderWithProviders(<TagsAddConfirmationModal {...props} />);

    await expectLoadingState();

    const profileWithExceedLimit = profileChanges.find(
      (profileChange) => profileChange.profile.will_exceed_limit,
    );
    assert(profileWithExceedLimit);

    const profileWithExceedLimitRow = screen.getByRole("row", {
      name: `${profileWithExceedLimit.profile.name} profile change row`,
    });

    expect(profileWithExceedLimitRow).toBeInTheDocument();
    expect(profileWithExceedLimitRow).toHaveIcon("warning");
  });

  it("shows the pagination component", async () => {
    renderWithProviders(<TagsAddConfirmationModal {...props} />);

    await expectLoadingState();

    const nextButton = screen.getByRole("button", { name: /next/i });
    expect(nextButton).toBeInTheDocument();
  });
});
