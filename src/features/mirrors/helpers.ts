export const pluralize = <S extends string, P extends string>(
  count: number,
  singularForm: S,
  pluralForm: P,
): S | P => {
  return count === 1 ? singularForm : pluralForm;
};
