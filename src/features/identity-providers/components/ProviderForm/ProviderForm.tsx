import { useFormik } from "formik";
import { FC, useEffect } from "react";
import { Form, Icon, Input } from "@canonical/react-components";
import useDebug from "@/hooks/useDebug";
import useSidePanel from "@/hooks/useSidePanel";
import { AddProviderParams, useIdentityProviders } from "../../hooks";
import { IdentityProvider, SupportedIdentityProvider } from "../../types";
import ProviderFormCta from "../ProviderFormCta";
import { INITIAL_VALUES, VALIDATION_SCHEMA } from "./constants";
import { ProviderFormValues } from "./types";
import classes from "./ProviderForm.module.scss";

type ProvideFormProps =
  | {
      action: "add";
      provider: SupportedIdentityProvider;
    }
  | {
      action: "edit";
      provider: IdentityProvider;
    };

const ProviderForm: FC<ProvideFormProps> = ({ action, provider }) => {
  const debug = useDebug();
  const { closeSidePanel } = useSidePanel();
  const { getSingleProviderQuery, addProviderQuery, updateProviderQuery } =
    useIdentityProviders();

  const { data: getSingleProviderQueryResult } = getSingleProviderQuery(
    { providerId: action === "edit" ? provider.id : 0 },
    { enabled: action === "edit" },
  );

  const { mutateAsync: addProvider } = addProviderQuery;
  const { mutateAsync: updateProvider } = updateProviderQuery;

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
      action === "add"
        ? await addProvider(commonValuesToSubmit)
        : await updateProvider({
            ...commonValuesToSubmit,
            providerId: provider.id,
          });

      closeSidePanel();
    } catch (error) {
      debug(error);
    }
  };

  const formik = useFormik({
    initialValues: INITIAL_VALUES,
    onSubmit: handleSubmit,
    validationSchema: VALIDATION_SCHEMA,
  });

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

  return (
    <Form onSubmit={formik.handleSubmit} noValidate>
      {action === "add" && (
        <div className={classes.urlContainer}>
          <span>Redirect URL </span>
          <Icon name="information" />
          <code className={classes.url}>{provider.redirect_uri}</code>
          <p className="p-text--small u-text--muted u-no-margin--bottom">
            You will need to set this in the configuration of your identity
            provider.
          </p>
        </div>
      )}

      <Input
        type="checkbox"
        label="Enabled"
        {...formik.getFieldProps("enabled")}
        checked={formik.values.enabled}
        help="If checked the identity provider will be enabled when it is created."
      />
      <Input
        type="text"
        label="Name"
        required
        disabled={
          getSingleProviderQueryResult?.data.configuration.provider ===
          "ubuntu-one"
        }
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
        disabled={
          getSingleProviderQueryResult?.data.configuration.provider ===
          "ubuntu-one"
        }
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
        disabled={
          getSingleProviderQueryResult?.data.configuration.provider ===
          "ubuntu-one"
        }
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
        disabled={
          getSingleProviderQueryResult?.data.configuration.provider ===
          "ubuntu-one"
        }
        {...formik.getFieldProps("issuer")}
        autoComplete="off"
        error={
          formik.touched.issuer && formik.errors.issuer
            ? formik.errors.issuer
            : undefined
        }
      />

      <ProviderFormCta action={action} />
    </Form>
  );
};

export default ProviderForm;
