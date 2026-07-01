interface OperationTypeTexts {
  inexistent: string;
  successful: string;
  failed: string;
  ongoing: string;
}

export const getOperationTypeTexts = (
  type: "publication" | "mirror" | "local",
): OperationTypeTexts => {
  switch (type) {
    case "publication":
      return {
        inexistent: "Not yet published",
        successful: "Published",
        failed: "Publishing failed",
        ongoing: "Publishing",
      };
    case "local":
      return {
        inexistent: "No packages have been imported",
        successful: "Packages imported",
        failed: "Import failed",
        ongoing: "Importing packages",
      };
    case "mirror":
      return {
        inexistent: "Not yet updated",
        successful: "Updated",
        failed: "Update failed",
        ongoing: "Updating",
      };
  }
};
