import { InstanceWithoutRelation } from "@/types/Instance";
import { Action } from "./types";

export const getModalBody = (
  instance: InstanceWithoutRelation,
  action: Action,
) => {
  if (action === "remove") {
    return {
      title: "Remove instance from Landscape",
      label: "Remove",
      appearance: "negative",
      body: (
        <>
          <p>
            This will remove the instance <b>{instance.title}</b> from
            Landscape.
            <br />
            <br />
            It will remain on the parent machine. You can re-register it to
            Landscape at any time.
          </p>
        </>
      ),
    };
  } else if (action === "delete") {
    return {
      title: "Delete instance",
      label: "Delete",
      appearance: "negative",
      body: (
        <p>
          This will permanently delete the instance <b>{instance.title}</b> from
          both the Windows host machine and Landscape.
        </p>
      ),
    };
  } else {
    return {
      title: "Set default instance",
      label: "Set default",
      appearance: "positive",
      body: (
        <p>
          Are you sure you want to set {instance.title} as default instance?
        </p>
      ),
    };
  }
};
