export const getPackageList = (output: string) => {
  const parsedOutput = output.replaceAll("Would add: ", "").trim().split("\n");
  const response = parsedOutput.slice(0, -1);
  const count = parsedOutput.at(-1);
  return {
    response: response ?? [],
    count: parseInt(count?.match(/\d+/)?.[0] ?? "0"),
  };
};
