import { useFormik } from "formik";
import { FC, useEffect } from "react";
import { Form, Icon, Input, Tooltip } from "@canonical/react-components";
import useDebug from "@/hooks/useDebug";
import useSidePanel from "@/hooks/useSidePanel";
import { AddProviderParams, useAuthHandle } from "../../hooks";
import { IdentityProvider, SupportedIdentityProvider } from "../../types";
import ProviderFormCta from "../ProviderFormCta";
import { INITIAL_VALUES } from "./constants";
import { getValidationSchema } from "./helpers";
import { ProviderFormValues } from "./types";
import classes from "./ProviderForm.module.scss";

type ProvideFormProps =
  | {
      action: "add";
      provider: SupportedIdentityProvider;
    }
  | {
      action: "edit";
      canBeDisabled: boolean;
      provider: IdentityProvider;
    };

const ProviderForm: FC<ProvideFormProps> = (props) => {
  const { action, provider } = props;

  const debug = useDebug();
  const { closeSidePanel } = useSidePanel();
  const {
    getSingleProviderQuery,
    addProviderQuery,
    updateProviderQuery,
    toggleUbuntuOneQuery,
  } = useAuthHandle();

  const { data: getSingleProviderQueryResult } = getSingleProviderQuery(
    { providerId: action === "edit" ? provider.id : 0 },
    { enabled: action === "edit" && provider.provider !== "ubuntu-one" },
  );

  const { mutateAsync: addProvider } = addProviderQuery;
  const { mutateAsync: updateProvider } = updateProviderQuery;
  const { mutateAsync: toggleUbuntuOne } = toggleUbuntuOneQuery;

  const handleSubmit = async (values: ProviderFormValues) => {
    const commonValuesToSubmit: AddProviderParams = {
      configuration: {
        issuer: values.issuer,
        client_id: values.client_id,
        client_secret: values.client_secret,
        name: values.name,
        provider: action === "add" ? provider.provider_slug : provider.provider,
      },
      enabled: values.enabled,
    };

    try {
      if (action === "add") {
        await addProvider(commonValuesToSubmit);
      } else {
        if (provider.provider === "ubuntu-one") {
          await toggleUbuntuOne({
            ubuntu_one: values.enabled,
          });
        } else {
          await updateProvider({
            ...commonValuesToSubmit,
            providerId: provider.id,
          });
        }
      }

      closeSidePanel();
    } catch (error) {
      debug(error);
    }
  };

  const formik = useFormik({
    initialValues: INITIAL_VALUES,
    onSubmit: handleSubmit,
    validationSchema: getValidationSchema(action === "edit" ? provider : null),
  });

  useEffect(() => {
    if (action !== "edit" || provider.provider !== "ubuntu-one") {
      return;
    }

    formik.setFieldValue("enabled", provider.enabled);
  }, [action, provider]);

  useEffect(() => {
    if (!getSingleProviderQueryResult) {
      return;
    }

    formik.setValues({
      client_id: getSingleProviderQueryResult.data.configuration.client_id,
      client_secret:
        getSingleProviderQueryResult.data.configuration.client_secret,
      enabled: getSingleProviderQueryResult.data.enabled,
      issuer: getSingleProviderQueryResult.data.configuration.issuer,
      name: getSingleProviderQueryResult.data.configuration.name,
    });
  }, [getSingleProviderQueryResult]);

  const disabled =
    action === "edit" &&
    !props.canBeDisabled &&
    getSingleProviderQueryResult?.data.enabled;

  return (
    <Form onSubmit={formik.handleSubmit} noValidate>
      {(action !== "edit" || provider.provider !== "ubuntu-one") && (
        <div className={classes.urlContainer}>
          <span>Redirect URL </span>
          <Icon name="information" />
          <code className={classes.url}>
            {action === "add"
              ? provider.redirect_uri
              : getSingleProviderQueryResult?.data.redirect_uri}
          </code>
          <p className="p-text--small u-text--muted u-no-margin--bottom">
            You will need to set this in the configuration of your identity
            provider.
          </p>
        </div>
      )}

      <Tooltip
        message={
          disabled &&
          "At least one identity provider must be active on the Landscape account."
        }
      >
        <Input
          type="checkbox"
          label="Enabled"
          {...formik.getFieldProps("enabled")}
          checked={formik.values.enabled}
          disabled={disabled}
          help={`If checked the identity provider will be enabled ${
            action === "add" ? "when it is created." : "for logging in."
          }`}
        />
      </Tooltip>

      {(action !== "edit" || provider.provider !== "ubuntu-one") && (
        <>
          <Input
            type="text"
            label="Name"
            required
            {...formik.getFieldProps("name")}
            autoComplete="off"
            error={
              formik.touched.name && formik.errors.name
                ? formik.errors.name
                : undefined
            }
          />
          <Input
            type="text"
            label="Client ID"
            required
            {...formik.getFieldProps("client_id")}
            autoComplete="off"
            error={
              formik.touched.client_id && formik.errors.client_id
                ? formik.errors.client_id
                : undefined
            }
          />
          <Input
            type="text"
            label="Client Secret"
            required
            {...formik.getFieldProps("client_secret")}
            autoComplete="off"
            error={
              formik.touched.client_secret && formik.errors.client_secret
                ? formik.errors.client_secret
                : undefined
            }
          />
          <Input
            type="url"
            label="Issuer"
            required
            {...formik.getFieldProps("issuer")}
            autoComplete="off"
            error={
              formik.touched.issuer && formik.errors.issuer
                ? formik.errors.issuer
                : undefined
            }
          />
        </>
      )}

      <ProviderFormCta action={action} />
    </Form>
  );
};

export default ProviderForm;
