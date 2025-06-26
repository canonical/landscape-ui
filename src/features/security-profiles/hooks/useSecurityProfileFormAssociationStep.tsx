import type { AssociationBlockFormProps } from "@/components/form/AssociationBlock";
import AssociationBlock from "@/components/form/AssociationBlock";
import { useGetInstances } from "@/features/instances";
import { Notification } from "@canonical/react-components";
import type { FormikContextType } from "formik";
import { useEffect, useState } from "react";
import { SECURITY_PROFILE_ASSOCIATED_INSTANCES_LIMIT } from "../constants";

export default function useSecurityProfileFormAssociationStep<
  T extends AssociationBlockFormProps,
>(formik: FormikContextType<T>) {
  const { instancesCount, isGettingInstances } = useGetInstances({
    query: formik.values.all_computers
      ? undefined
      : formik.values.tags.map((tag) => `tag:${tag}`).join(" OR "),
    limit: 1,
  });

  const [isAssociationLimitReached, setIsAssociationLimitReached] =
    useState(false);

  useEffect(() => {
    if (instancesCount === undefined) {
      return;
    }

    if (!formik.values.tags.length && !formik.values.all_computers) {
      setIsAssociationLimitReached(false);
      return;
    }

    setIsAssociationLimitReached(
      instancesCount > SECURITY_PROFILE_ASSOCIATED_INSTANCES_LIMIT,
    );
  }, [instancesCount]);

  return {
    isLoading: isGettingInstances,
    isValid: !isAssociationLimitReached,
    description:
      "Associate the security profile. Apply it to all instances or limit it to specific instances using a tag.",
    content: (
      <>
        {isAssociationLimitReached && (
          <Notification
            severity="negative"
            inline
            title="Associated instances limit reached:"
          >
            You&apos;ve reached the limit of{" "}
            <strong>
              {SECURITY_PROFILE_ASSOCIATED_INSTANCES_LIMIT} associated instances
            </strong>
            . Decrease the number of associated instances.
          </Notification>
        )}

        <AssociationBlock formik={formik} />
      </>
    ),
    submitButtonText: "Next",
  };
}
