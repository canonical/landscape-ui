import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import { useActivities } from "@/features/activities";
import { useGetInstances } from "@/features/instances";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import type { Instance } from "@/types/Instance";
import type { NotificationMethodArgs } from "@/types/Notification";
import { getFormikError } from "@/utils/formikErrors";
import { ConfirmationModal, Form, Input } from "@canonical/react-components";
import { useFormik } from "formik";
import type { FC, ReactNode } from "react";
import { useState } from "react";
import * as Yup from "yup";
import useAttachToken from "../../api/useAttachToken";
import { classifyInstancesByToken } from "../../helpers";
import { pluralize } from "@/utils/_helpers";

interface TokenFormBaseProps {
  readonly children: ReactNode;
  readonly selectedInstances: Instance[];
  readonly submitButtonText: string;
  readonly notification: NotificationMethodArgs;
}

const TokenFormBase: FC<TokenFormBaseProps> = ({
  children,
  selectedInstances,
  submitButtonText,
  notification,
}) => {
  const [invalidInstancesCount, setInvalidInstancesCount] = useState<number>(0);

  const debug = useDebug();
  const { notify } = useNotify();
  const { closeSidePanel } = useSidePanel();
  const { openActivityDetails } = useActivities();
  const { attachToken, isAttachingToken } = useAttachToken();

  const idListQuery = selectedInstances.map((i) => `id:${i.id}`).join(" OR ");

  const query = `${idListQuery} has-pro-management:false`;

  const { refetchInstances: getInvalidInstances } = useGetInstances(
    {
      query,
      limit: selectedInstances.length,
    },
    { listenToUrlParams: false },
    { enabled: false },
  );

  const handleAttach = async (token: string) => {
    if (selectedInstances.length === 0) {
      notify.info({
        title: "No instances to attach",
        message: "No valid instances were selected for token attachment.",
      });
      return;
    }

    try {
      const {
        data: { activity },
      } = await attachToken({
        computer_ids: selectedInstances.map(({ id }) => id),
        token,
      });

      closeSidePanel();

      notify.success({
        ...notification,
        actions: [
          {
            label: "View details",
            onClick: () => {
              openActivityDetails(activity);
            },
          },
        ],
      });
    } catch (error) {
      debug(error);
    }
  };

  const formik = useFormik({
    initialValues: {
      token: "",
    },
    validationSchema: Yup.object({
      token: Yup.string().required("Token is required"),
    }),
    onSubmit: async (values) => {
      try {
        const { data: validationData } = await getInvalidInstances();
        setInvalidInstancesCount(validationData?.data.count ?? 0);

        if (validationData?.data.count === 0) {
          await handleAttach(values.token);
        }
      } catch (error) {
        debug(error);
      }
    },
  });

  const handleConfirmAttachment = async (): Promise<void> => {
    await handleAttach(formik.values.token);
  };

  const closeValidationModal = () => {
    setInvalidInstancesCount(0);
  };

  const { withToken, withoutToken } =
    classifyInstancesByToken(selectedInstances);

  return (
    <>
      <Form noValidate onSubmit={formik.handleSubmit}>
        <div>
          {children}

          <Input
            label="Token"
            type="text"
            placeholder="Your token"
            required
            {...formik.getFieldProps("token")}
            error={getFormikError(formik, "token")}
          />
        </div>

        <SidePanelFormButtons
          submitButtonText={submitButtonText}
          submitButtonDisabled={!formik.isValid || !formik.dirty}
          submitButtonLoading={formik.isSubmitting || isAttachingToken}
          onCancel={closeSidePanel}
        />
      </Form>

      {invalidInstancesCount ? (
        <ConfirmationModal
          title="Attach Ubuntu Pro token"
          confirmButtonLabel="Confirm"
          confirmButtonAppearance="positive"
          confirmButtonLoading={isAttachingToken}
          onConfirm={handleConfirmAttachment}
          close={closeValidationModal}
        >
          <p className="u-no-margin--bottom">Confirming this action means:</p>
          <ul>
            {invalidInstancesCount !== selectedInstances.length && (
              <>
                {withoutToken - invalidInstancesCount > 0 && (
                  <li>
                    <strong>{withoutToken - invalidInstancesCount}</strong>{" "}
                    {pluralize(
                      withoutToken - invalidInstancesCount,
                      "instance",
                    )}{" "}
                    will be attached to this token
                  </li>
                )}
                {withToken > 0 && (
                  <li>
                    <strong>{withToken}</strong>{" "}
                    {pluralize(withToken, "instance")} will override{" "}
                    {pluralize(withToken, "its", "their")} existing token
                  </li>
                )}
              </>
            )}
            {invalidInstancesCount > 0 && (
              <li>
                <strong>{invalidInstancesCount}</strong>{" "}
                {pluralize(invalidInstancesCount, "instance")} will be skipped
                as {pluralize(invalidInstancesCount, "it does", "they do")} not
                support Ubuntu Pro management
              </li>
            )}
          </ul>
        </ConfirmationModal>
      ) : null}
    </>
  );
};

export default TokenFormBase;
