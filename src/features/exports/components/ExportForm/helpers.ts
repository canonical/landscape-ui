import type { ExportFieldGroup } from "../../types/ExportForm";

const getLabelSearchRank = (label: string, needle: string): number => {
  const haystack = label.toLowerCase();

  if (haystack === needle) {
    return 0;
  }

  if (haystack.startsWith(needle)) {
    return 1;
  }

  return 2;
};

export const getFilteredFieldGroups = (
  fieldGroups: readonly ExportFieldGroup[],
  attributeSearch: string,
): readonly ExportFieldGroup[] => {
  const normalizedSearch = attributeSearch.trim().toLowerCase();

  if (!normalizedSearch) {
    return fieldGroups;
  }

  return fieldGroups.flatMap((group) => {
    const matchingFields = group.fields.filter((field) =>
      field.label.toLowerCase().includes(normalizedSearch),
    );

    if (!matchingFields.length) {
      return [];
    }

    return [{ ...group, fields: matchingFields }];
  });
};

export const getGroupSearchRank = (
  groupKey: string,
  fieldGroups: readonly ExportFieldGroup[],
  attributeSearch: string,
): number => {
  const normalizedSearch = attributeSearch.trim().toLowerCase();

  if (!normalizedSearch) {
    return 2;
  }

  const group = fieldGroups.find(({ key }) => key === groupKey);

  if (!group) {
    return 2;
  }

  return Math.min(
    ...group.fields.map((field) =>
      getLabelSearchRank(field.label, normalizedSearch),
    ),
  );
};
