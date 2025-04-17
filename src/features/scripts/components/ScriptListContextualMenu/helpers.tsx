import type { ScriptProfile } from "@/features/script-profiles";
import type { ReactNode } from "react";

export const getDeleteModalBody = (
  associatedProfiles: ScriptProfile[],
): {
  buttonLabel: string;
  body: ReactNode;
} => {
  if (associatedProfiles.length === 0) {
    return {
      buttonLabel: "Delete",
      body: "Deleting the script will remove the contents from Landscape. This action is irreversible.",
    };
  }

  return {
    buttonLabel: "Delete script and archive profiles",
    body: (
      <>
        Archiving the script will prevent it from running in the future. The
        script is associated with the following profiles:
        <ul>
          {associatedProfiles.map((profile) => (
            <li key={profile.id}>{profile.title}</li>
          ))}
        </ul>
        If you delete the script, the script and its profiles won’t be able to
        run in the future. This action is irreversible.
      </>
    ),
  };
};

export const getArchiveModalBody = (
  associatedProfiles: ScriptProfile[],
): {
  buttonLabel: string;
  body: ReactNode;
} => {
  if (associatedProfiles.length === 0) {
    return {
      buttonLabel: "Archive",
      body: (
        <p>
          Archiving the script will prevent it from running in the future. This
          action is irreversible.
        </p>
      ),
    };
  }

  return {
    buttonLabel: "Archive both script and profiles",
    body: (
      <>
        <p>
          Archiving the script will prevent it from running in the future. The
          script is associated with the following profiles:
        </p>
        <ul>
          {associatedProfiles.map((profile) => (
            <li key={profile.id}>{profile.title}</li>
          ))}
        </ul>
        <p>
          If you archive the script and the profiles, they won’t be able to run
          in the future. This action is irreversible.
        </p>
      </>
    ),
  };
};
