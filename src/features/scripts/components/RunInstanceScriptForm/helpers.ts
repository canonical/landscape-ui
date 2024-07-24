import { RunInstanceScriptFormValues, Script } from "../../types";

export const getNotification = (
  values: RunInstanceScriptFormValues,
  options: ReturnType<typeof getScriptOptions>,
) => {
  return {
    message: `"${values.type === "new" ? values.title : options.find(({ value }) => value === values.script_id)?.label}" script queued to execute successfully`,
    title: "Script execution queued",
  };
};

export const getScriptOptions = (scripts: Script[] | undefined) => {
  const scriptOptions =
    scripts?.map(({ id, title }) => ({
      label: title,
      value: id,
    })) ?? [];

  scriptOptions.unshift({ label: "Select script", value: 0 });

  return scriptOptions;
};
