import type { AssociationBlockFormProps } from "@/components/form/AssociationBlock";
import AssociationBlock from "@/components/form/AssociationBlock";
import useInstances from "@/hooks/useInstances";
import { Notification } from "@canonical/react-components";
import type { FormikContextType } from "formik";
import { useEffect, useState } from "react";
import { ASSOCIATED_INSTANCES_LIMIT } from "../components/SecurityProfileAddForm/constants";

export default function useSecurityProfileFormAssociationStep<
  T extends AssociationBlockFormProps,
>(formik: FormikContextType<T>) {
  const { getInstancesQuery } = useInstances();

  const { data: getInstancesQueryResult, isLoading: isInstancesPending } =
    getInstancesQuery({
      query: formik.values.all_computers
        ? undefined
        : formik.values.tags.map((tag) => `tag:${tag}`).join(" OR "),
    });

  const [isAssociationLimitReached, setIsAssociationLimitReached] =
    useState(false);

  useEffect(() => {
    if (!getInstancesQueryResult) {
      return;
    }

    if (!formik.values.tags.length && !formik.values.all_computers) {
      setIsAssociationLimitReached(false);
      return;
    }

    setIsAssociationLimitReached(
      getInstancesQueryResult.data.count >= ASSOCIATED_INSTANCES_LIMIT,
    );
  }, [getInstancesQueryResult]);

  return {
    isLoading: isInstancesPending,
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
            <strong>{ASSOCIATED_INSTANCES_LIMIT} associated instances</strong>.
            Decrease the number of associated instances.
          </Notification>
        )}

        <AssociationBlock formik={formik} />
      </>
    ),
    submitButtonText: "Next",
  };
}
