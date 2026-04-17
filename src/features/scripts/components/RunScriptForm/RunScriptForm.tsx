import CodeEditor from "@/components/form/CodeEditor";
import { DeliveryBlock } from "@/components/form/DeliveryScheduling";
import MultiSelectField from "@/components/form/MultiSelectField";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import LoadingState from "@/components/layout/LoadingState";
import { getFeatures, useGetInstances } from "@/features/instances";
import { useGetTags } from "@/features/tags";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import { getFormikError } from "@/utils/formikErrors";
import type { MultiSelectItem } from "@canonical/react-components";
import {
  Col,
  ConfirmationModal,
  Form,
  Input,
  Row,
} from "@canonical/react-components";
import { useFormik } from "formik";
import moment from "moment/moment";
import { type FC, useState } from "react";
import { useBoolean } from "usehooks-ts";
import { useEditScript, useRunScript } from "../../api";
import { getCode, getEncodedCode } from "../../helpers";
import type { Script } from "../../types";
import EditScriptConfirmationModal from "../EditScriptConfirmationModal";
import RunScriptFormInstanceList from "../RunScriptFormInstanceList";
import {
  INITIAL_VALUES,
  NO_TAGGED_FEATURED_INSTANCES_WARNING_MESSAGE,
  VALIDATION_SCHEMA,
} from "./constants";
import classes from "./RunScriptForm.module.scss";
import type { FormProps } from "./types";
import { pluralize } from "@/utils/_helpers";

interface RunScriptFormProps {
  readonly script: Script;
  readonly submittedCode?: string;
  readonly onBack?: () => void;
}

const RunScriptForm: FC<RunScriptFormProps> = ({
  script,
  submittedCode,
  onBack,
}) => {
  const {
    value: isRunConfirmVisible,
    setTrue: showRunConfirm,
    setFalse: hideRunConfirm,
  } = useBoolean();

  const {
    value: isEditConfirmVisible,
    setTrue: showEditConfirm,
    setFalse: hideEditConfirm,
  } = useBoolean();

  const debug = useDebug();
  const { notify } = useNotify();
  const { closeSidePanel } = useSidePanel();

  const { runScript } = useRunScript();
  const { editScript } = useEditScript();
  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false);
  const [hasClosedTagDropdown, setHasClosedTagDropdown] = useState(false);

  const originalCode =
    submittedCode ??
    getCode({
      code: script.code,
      interpreter: script.interpreter,
    });

  const submitRun = async (values: FormProps) => {
    const valuesToSubmit = {
      query:
        values.queryType === "ids"
          ? `id:${values.instanceIds.join(" OR id:")}`
          : `tag:${values.tags.join(" OR tag:")}`,
      script_id: script.id,
      username: values.username,
      time_limit: Number(values.time_limit),
      deliver_after: values.deliver_immediately
        ? undefined
        : moment(values.deliver_after)
            .toISOString()
            .replace(/\.\d+(?=Z$)/, ""),
    };

    if (!values.deliver_immediately) {
      valuesToSubmit.deliver_after = moment(values.deliver_after)
        .toISOString()
        .replace(/\.\d+(?=Z$)/, "");
    }

    try {
      if (values.code !== originalCode) {
        await editScript({
          script_id: script.id,
          code: getEncodedCode(values.code),
        });
      }

      await runScript(valuesToSubmit);

      closeSidePanel();

      notify.success({
        message: `"${script.title}" script queued to execute successfully`,
        title: "Script execution queued",
      });
    } catch (error) {
      debug(error);
    }
  };

  const handleSubmit = async (values: FormProps) => {
    if (values.code !== originalCode) {
      showEditConfirm();
      return;
    }

    if (values.queryType === "tags") {
      showRunConfirm();
      return;
    }

    await submitRun(values);
  };

  const formik = useFormik({
    initialValues: { ...INITIAL_VALUES, code: originalCode },
    onSubmit: handleSubmit,
    validateOnMount: true,
    validationSchema: VALIDATION_SCHEMA,
  });

  const codeChanged = formik.values.code !== originalCode;

  const { tags, isGettingTags } = useGetTags();

  const { instances, isGettingInstances } = useGetInstances({
    query: `access-group-recursive:${script.access_group}`,
  });

  const {
    instances: taggedInstances,
    isGettingInstances: isGettingTaggedInstances,
    instancesError: taggedInstancesError,
  } = useGetInstances(
    {
      query: `access-group-recursive:${script.access_group} ${formik.values.tags.map((tag) => `tag:${tag}`).join(" OR ")}`,
    },
    undefined,
    {
      enabled: !!formik.values.tags.length,
    },
  );

  const tagOptions: MultiSelectItem[] =
    tags.map((tag) => ({
      label: tag,
      value: tag,
    })) ?? [];

  const instancesWithScriptsFeature =
    instances.filter((instance) => {
      return getFeatures(instance).scripts;
    }) ?? [];

  const instanceOptions: MultiSelectItem[] = instancesWithScriptsFeature.map(
    ({ title, id }) => ({
      label: title,
      value: id,
    }),
  );

  const taggedInstancesWithScriptsFeature =
    taggedInstances.filter((instance) => {
      return getFeatures(instance).scripts;
    }) ?? [];

  const shouldShowNoTaggedInstancesWarning =
    hasClosedTagDropdown &&
    !isTagDropdownOpen &&
    formik.values.queryType === "tags" &&
    formik.values.tags.length > 0 &&
    !isGettingTaggedInstances &&
    !taggedInstancesError &&
    !taggedInstancesWithScriptsFeature.length;

  const proceedWithRun = () => {
    if (formik.values.queryType === "tags") {
      showRunConfirm();
    } else {
      submitRun(formik.values);
    }
  };

  if (isGettingTags || isGettingInstances) {
    return <LoadingState />;
  }

  if (taggedInstancesError) {
    debug(taggedInstancesError);
  }

  return (
    <>
      <Form onSubmit={formik.handleSubmit} noValidate>
        <p className="u-no-margin--bottom">* Select instances by:</p>
        <div className="is-required">
          <div>
            <div className={classes.radioGroup}>
              <Input
                type="radio"
                label="Tags"
                {...formik.getFieldProps("queryType")}
                onChange={async (event) => {
                  formik.getFieldProps("queryType").onChange(event);

                  await Promise.all([
                    formik.setFieldValue("tags", []),
                    formik.setFieldTouched("tags", false),

                    formik.setFieldValue("instanceIds", []),
                    formik.setFieldTouched("instanceIds", false),
                  ]);

                  setIsTagDropdownOpen(false);
                  setHasClosedTagDropdown(false);
                }}
                value="tags"
                checked={formik.values.queryType === "tags"}
              />

              <Input
                type="radio"
                label="Instance names"
                {...formik.getFieldProps("queryType")}
                value="ids"
                checked={formik.values.queryType === "ids"}
                disabled={!instanceOptions.length}
                help={
                  !instanceOptions.length &&
                  "There are no available instances in this script's access group."
                }
              />
            </div>
            <div className={classes.instanceSelectionContainer}>
              {formik.values.queryType === "tags" && (
                <MultiSelectField
                  placeholder="Select tags"
                  variant="condensed"
                  label="Tags"
                  labelClassName="u-off-screen"
                  required
                  {...formik.getFieldProps("tags")}
                  items={tagOptions}
                  selectedItems={tagOptions.filter(({ value }) =>
                    formik.values.tags.includes(value as string),
                  )}
                  onItemsUpdate={async (items) => {
                    formik.setFieldValue(
                      "tags",
                      items.map(({ value }) => value),
                    );
                  }}
                  onOpen={() => {
                    setIsTagDropdownOpen(true);
                  }}
                  onClose={() => {
                    setIsTagDropdownOpen(false);
                    setHasClosedTagDropdown(true);
                    formik.setFieldTouched("tags", true, false);
                  }}
                  error={getFormikError(formik, "tags")}
                  warning={
                    shouldShowNoTaggedInstancesWarning &&
                    NO_TAGGED_FEATURED_INSTANCES_WARNING_MESSAGE
                  }
                />
              )}

              {formik.values.queryType === "ids" && (
                <MultiSelectField
                  placeholder="Select instances"
                  variant="condensed"
                  label="Instances"
                  labelClassName="u-off-screen"
                  required
                  {...formik.getFieldProps("instanceIds")}
                  items={instanceOptions}
                  selectedItems={instanceOptions.filter(({ value }) =>
                    formik.values.instanceIds.includes(value as number),
                  )}
                  onItemsUpdate={async (items) => {
                    formik.setFieldValue(
                      "instanceIds",
                      items.map(({ value }) => value),
                    );

                    formik.setFieldTouched("instanceIds", true, false);
                  }}
                  error={getFormikError(formik, "instanceIds")}
                />
              )}
            </div>
          </div>
        </div>

        <Row className="u-no-padding--left u-no-padding--right">
          <Col size={6}>
            <Input
              type="text"
              label="Run as user"
              autoComplete="off"
              required
              {...formik.getFieldProps("username")}
              error={getFormikError(formik, "username")}
            />
          </Col>
          <Col size={6}>
            <Input
              type="text"
              label="Time limit (seconds)"
              autoComplete="off"
              required
              {...formik.getFieldProps("time_limit")}
              error={getFormikError(formik, "time_limit")}
            />
          </Col>
        </Row>

        <CodeEditor
          label="Script code"
          value={formik.values.code}
          onChange={async (value) => {
            await formik.setFieldValue("code", value ?? "");
          }}
          error={getFormikError(formik, "code")}
          required
        />

        <DeliveryBlock formik={formik} />

        <SidePanelFormButtons
          submitButtonDisabled={formik.isSubmitting}
          onBackButtonPress={onBack}
          hasBackButton={!!onBack}
          submitButtonText={codeChanged ? "Save and run" : "Run script"}
          onSubmit={formik.submitForm}
        />
      </Form>

      {isEditConfirmVisible && (
        <EditScriptConfirmationModal
          script={script}
          confirmButtonLabel="Submit and run"
          isConfirming={formik.isSubmitting}
          onConfirm={() => {
            hideEditConfirm();
            proceedWithRun();
          }}
          onClose={hideEditConfirm}
        />
      )}

      {isRunConfirmVisible &&
        taggedInstancesWithScriptsFeature.length === 0 && (
          <ConfirmationModal
            renderInPortal
            confirmButtonLabel="OK"
            confirmButtonAppearance="positive"
            onConfirm={hideRunConfirm}
            cancelButtonProps={{ style: { display: "none" } }}
            title="No instances to run script on"
            close={hideRunConfirm}
          >
            <p>
              {NO_TAGGED_FEATURED_INSTANCES_WARNING_MESSAGE} Select different
              tags and try again.
            </p>
          </ConfirmationModal>
        )}

      {isRunConfirmVisible && taggedInstancesWithScriptsFeature.length > 0 && (
        <ConfirmationModal
          renderInPortal
          title={`Run "${script.title}" script on ${formik.values.tags.length > 1 ? `${formik.values.tags.length} tags` : `${formik.values.tags[0]} tag`}`}
          confirmButtonLabel="Run script"
          onConfirm={() => {
            hideRunConfirm();
            submitRun(formik.values);
          }}
          confirmButtonDisabled={
            formik.isSubmitting ||
            !!taggedInstancesError ||
            isGettingTaggedInstances ||
            !taggedInstancesWithScriptsFeature.length
          }
          confirmButtonLoading={isGettingTaggedInstances}
          close={hideRunConfirm}
          confirmButtonAppearance="positive"
        >
          <p>
            This script will run on the following instances, which are
            associated with the selected{" "}
            {pluralize(formik.values.tags.length, "tag")}.
          </p>
          <RunScriptFormInstanceList
            instances={taggedInstancesWithScriptsFeature}
            tags={formik.values.tags}
          />
        </ConfirmationModal>
      )}
    </>
  );
};

export default RunScriptForm;
