import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import { useActivities } from "@/features/activities";
import { useGetInstances } from "@/features/instances";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import type { Instance } from "@/types/Instance";
import type { NotificationMethodArgs } from "@/types/Notification";
import { getFormikError } from "@/utils/formikErrors";
import {
  Button,
  ConfirmationModal,
  Form,
  Input,
  Modal,
} from "@canonical/react-components";
import { useFormik } from "formik";
import type { FC, ReactNode } from "react";
import { useState } from "react";
import * as Yup from "yup";
import useAttachToken from "../../api/useAttachToken";
import { classifyInstancesByToken } from "../../helpers";
import { pluralize } from "@/utils/_helpers";
import type { FormProps } from "./types";

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
  const [invalidInstanceIds, setInvalidInstanceIds] = useState<number[]>([]);

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

  const onSubmit = async (values: FormProps) => {
    try {
      const { data: validationData } = await getInvalidInstances();
      const invalid = validationData?.data?.results ?? [];
      setInvalidInstanceIds(invalid.map((i: Instance) => i.id));

      if (invalid.length === 0) {
        await handleAttach(values.token);
      }
    } catch (error) {
      debug(error);
    }
  };

  const validInstances = selectedInstances.filter(
    (instance) => !invalidInstanceIds.includes(instance.id),
  );

  const { withToken, withoutToken } = classifyInstancesByToken(validInstances);

  const formik = useFormik<FormProps>({
    initialValues: {
      token: "",
    },
    validationSchema: Yup.object({
      token: Yup.string().required("Token is required"),
    }),
    onSubmit: onSubmit,
  });

  const handleConfirmAttachment = async (): Promise<void> => {
    await handleAttach(formik.values.token);
  };

  const closeValidationModal = () => {
    setInvalidInstanceIds([]);
  };

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

      {!!invalidInstanceIds.length &&
        (invalidInstanceIds.length === selectedInstances.length ? (
          <Modal
            title={`Token attachment unavailable for the selected ${pluralize(selectedInstances.length, "instance", "instances")}`}
            close={closeValidationModal}
            buttonRow={
              <Button
                type="button"
                className="u-no-margin--bottom"
                onClick={closeValidationModal}
              >
                Close
              </Button>
            }
          >
            <p>
              Your Ubuntu Pro token can&apos;t be attached to the selected{" "}
              {pluralize(selectedInstances.length, "instance")} because{" "}
              {pluralize(selectedInstances.length, "it doesn't", "they don't")}{" "}
              support this feature. This could be because the Landscape Client
              is out of date.
            </p>
          </Modal>
        ) : (
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
              {withoutToken > 0 && (
                <li>
                  <strong>{withoutToken}</strong>{" "}
                  {pluralize(withoutToken, "instance")} will be attached to this
                  token
                </li>
              )}
              {withToken > 0 && (
                <li>
                  <strong>{withToken}</strong>{" "}
                  {pluralize(withToken, "instance")} will override{" "}
                  {pluralize(withToken, "its", "their")} existing token
                </li>
              )}
              <li>
                <strong>{invalidInstanceIds.length}</strong>{" "}
                {pluralize(invalidInstanceIds.length, "instance")} will be
                skipped as{" "}
                {pluralize(invalidInstanceIds.length, "it does", "they do")} not
                support Ubuntu Pro management
              </li>
            </ul>
          </ConfirmationModal>
        ))}
    </>
  );
};

export default TokenFormBase;
