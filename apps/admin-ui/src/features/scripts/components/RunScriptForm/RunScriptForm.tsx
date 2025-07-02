import MultiSelectField from "@/components/form/MultiSelectField";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import LoadingState from "@/components/layout/LoadingState";
import { currentInstanceCan } from "@/features/instances";
import useDebug from "@/hooks/useDebug";
import useInstances from "@/hooks/useInstances";
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
import { useState, type FC } from "react";
import { useRunScript } from "../../api";
import type { Script } from "../../types";
import DeliveryBlock from "../DeliveryBlock";
import RunScriptFormInstanceList from "../RunScriptFormInstanceList";
import { INITIAL_VALUES, VALIDATION_SCHEMA } from "./constants";
import classes from "./RunScriptForm.module.scss";
import type { FormProps } from "./types";

interface RunScriptFormProps {
  readonly script: Script;
}

const RunScriptForm: FC<RunScriptFormProps> = ({ script }) => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { closeSidePanel } = useSidePanel();
  const { getAllInstanceTagsQuery, getInstancesQuery } = useInstances();

  const { runScript } = useRunScript();

  const handleSubmit = async (values: FormProps) => {
    const valuesToSubmit = {
      query:
        values.queryType === "ids"
          ? `id:${values.instanceIds.join(" OR id:")}`
          : `tag:${values.tags.join(" OR tag:")}`,
      script_id: script.id,
      username: values.username,
      time_limit: Number(values.time_limit),
      deliver_after: values.deliverImmediately
        ? undefined
        : moment(values.deliver_after)
            .toISOString()
            .replace(/\.\d+(?=Z$)/, ""),
    };

    if (!values.deliverImmediately) {
      valuesToSubmit.deliver_after = moment(values.deliver_after)
        .toISOString()
        .replace(/\.\d+(?=Z$)/, "");
    }

    try {
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

  const formik = useFormik({
    initialValues: INITIAL_VALUES,
    onSubmit: handleSubmit,
    validateOnMount: true,
    validationSchema: VALIDATION_SCHEMA,
  });

  const [isModalVisible, setIsModalVisible] = useState(false);

  const { data: getAllInstanceTagsQueryResult, isLoading: isGettingTags } =
    getAllInstanceTagsQuery();

  const { data: getInstancesQueryResult, isLoading: isGettingInstances } =
    getInstancesQuery({
      query: `access-group-recursive:${script.access_group}`,
    });

  const {
    data: getTaggedInstancesQueryResult,
    isLoading: isGettingTaggedInstances,
    error: taggedInstancesQueryError,
  } = getInstancesQuery(
    {
      query: `access-group-recursive:${script.access_group} ${formik.values.tags.map((tag) => `tag:${tag}`).join(" OR ")}`,
    },
    {
      enabled: !!formik.values.tags.length,
    },
  );

  if (isGettingTags || isGettingInstances) {
    return <LoadingState />;
  }

  if (taggedInstancesQueryError) {
    debug(taggedInstancesQueryError);
  }

  const hideModal = () => {
    setIsModalVisible(false);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const tagOptions: MultiSelectItem[] =
    getAllInstanceTagsQueryResult?.data.results.map((tag) => ({
      label: tag,
      value: tag,
    })) ?? [];

  const instances =
    getInstancesQueryResult?.data.results.filter((instance) => {
      return currentInstanceCan("runScripts", instance);
    }) ?? [];

  const instanceOptions: MultiSelectItem[] = instances.map(({ title, id }) => ({
    label: title,
    value: id,
  }));

  const taggedInstances =
    getTaggedInstancesQueryResult?.data.results.filter((instance) => {
      return currentInstanceCan("runScripts", instance);
    }) ?? [];

  const trySubmit = () => {
    if (formik.values.queryType == "tags") {
      showModal();
    } else {
      formik.handleSubmit();
    }
  };

  return (
    <>
      <Form onSubmit={trySubmit} noValidate>
        <p className="u-no-margin--bottom">Select instances by:</p>
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

                    formik.setFieldTouched("tags", true, false);
                  }}
                  error={getFormikError(formik, "tags")}
                  scrollOverflow
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
                  scrollOverflow
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
        <DeliveryBlock formik={formik} />

        <SidePanelFormButtons
          submitButtonDisabled={formik.isSubmitting || !formik.isValid}
          submitButtonText="Run script"
          onSubmit={trySubmit}
        />
      </Form>

      {isModalVisible && (
        <ConfirmationModal
          title={`Run ${script.title} script on ${formik.values.tags.length > 1 ? `${formik.values.tags.length} tags` : `${formik.values.tags[0]} tag`}`}
          confirmButtonLabel="Run script"
          onConfirm={() => {
            formik.handleSubmit();
          }}
          confirmButtonDisabled={
            formik.isSubmitting ||
            !!taggedInstancesQueryError ||
            isGettingTaggedInstances
          }
          confirmButtonLoading={isGettingTaggedInstances}
          close={hideModal}
          confirmButtonAppearance="positive"
        >
          <p>
            This script will run on the following instances, which are
            associated with the selected{" "}
            {formik.values.tags.length == 1 ? "tag" : "tags"}.
          </p>

          <RunScriptFormInstanceList instances={taggedInstances} />
        </ConfirmationModal>
      )}
    </>
  );
};

export default RunScriptForm;
