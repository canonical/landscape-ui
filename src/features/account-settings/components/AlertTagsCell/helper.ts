export const findExclusiveTags = (
  sourceTags: string[],
  tagsToExclude: string[],
) => {
  const exclustionSet = new Set(tagsToExclude);
  return sourceTags.filter((tag) => !exclustionSet.has(tag));
};
