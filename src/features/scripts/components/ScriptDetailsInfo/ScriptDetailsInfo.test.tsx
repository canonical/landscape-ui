import { scriptDetails } from "@/tests/mocks/script";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, it } from "vitest";
import { formatTitleCase, getAuthorInfo } from "../../helpers";
import ScriptDetailsInfo from "./ScriptDetailsInfo";

describe("ScriptDetailsInfo", () => {
  it("should display correct information for a script", async () => {
    const { container } = renderWithProviders(
      <ScriptDetailsInfo script={scriptDetails} />,
    );

    const fieldsToCheck = [
      { label: "Name", value: scriptDetails.title },
      { label: "Version", value: scriptDetails.version_number.toString() },
      { label: "Status", value: formatTitleCase(scriptDetails.status) },
      { label: "Access group", value: scriptDetails.access_group },
      {
        label: "Date created",
        value: getAuthorInfo({
          author: scriptDetails.created_by.name,
          date: scriptDetails.created_at,
        }),
      },
      {
        label: "Last modified",
        value: getAuthorInfo({
          author: scriptDetails.last_edited_by.name,
          date: scriptDetails.last_edited_at,
        }),
      },
    ];

    fieldsToCheck.forEach((field) => {
      expect(container).toHaveInfoItem(field.label, field.value);
    });

    scriptDetails.script_profiles.forEach((profile, index) => {
      const profileLink = screen.getByRole("link", {
        name: `${profile.title}${index < scriptDetails.script_profiles.length - 1 ? "," : ""}`,
      });
      expect(profileLink).toBeInTheDocument();
    });

    scriptDetails.attachments.forEach((attachment) => {
      const attachmentFile = screen.getByText(attachment.filename);
      expect(attachmentFile).toBeInTheDocument();
    });
  });
});
