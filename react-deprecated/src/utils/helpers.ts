export const filterUnique = <T>(value: T, index: number, self: T[]) =>
  self.indexOf(value) === index;

export const filterByIncludes = (valuesToFilter: string[], value: string) =>
  valuesToFilter.length === 0 ||
  valuesToFilter[0].length === 0 ||
  valuesToFilter.includes(value);

export const filterByIncludesAny = (
  valuesToFilter: string[],
  values: string[]
) =>
  valuesToFilter.length === 0 ||
  valuesToFilter[0].length === 0 ||
  valuesToFilter.some((t) => values.includes(t));

export const filterByText = (valueFilter: string, value: string) =>
  valueFilter.length === 0 ||
  value.toLowerCase().indexOf(valueFilter.toLowerCase()) >= 0;

export const getColumn = (name: string, title?: string) => ({
  title:
    title !== undefined ? title : name.charAt(0).toUpperCase() + name.slice(1),
  dataIndex: name,
  key: name,
});

const removeTagsRegex = /(<([^>]+)>)/gi;
export const removeXmlTags = (name: string) =>
  name.replace(removeTagsRegex, "");

export const convertToMultiplier = (margin: number) => margin / 100 + 1;
