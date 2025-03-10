export const pluralize = <S extends string, P extends string>(
  count: number,
  singularForm: S,
  pluralForm: P,
): S | P => {
  // eslint-disable-next-line no-magic-numbers
  return count === 1 ? singularForm : pluralForm;
};
