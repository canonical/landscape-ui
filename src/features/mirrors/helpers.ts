const ONE = 1;

export const pluralize = <S extends string, P extends string>(
  count: number,
  singularForm: S,
  pluralForm: P,
): S | P => {
  return count === ONE ? singularForm : pluralForm;
};
