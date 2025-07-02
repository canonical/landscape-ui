import type { RunInstanceScriptFormValues, Script } from "../../types";

export const getScriptOptions = (scripts: Script[] | undefined) => {
  const scriptOptions =
    scripts?.map(({ id, title }) => ({
      label: title,
      value: id,
    })) ?? [];

  scriptOptions.unshift({ label: "Select script", value: 0 });

  return scriptOptions;
};

export const getNotification = (
  values: RunInstanceScriptFormValues,
  options: ReturnType<typeof getScriptOptions>,
) => {
  return {
    message: `"${options.find(({ value }) => value === values.script_id)?.label}" script queued to execute successfully`,
    title: "Script execution queued",
  };
};
