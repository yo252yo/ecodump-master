import { removeXmlTags } from "./helpers";

const endpoints = {
  list: () => ".netlify/functions/filesDb",
  readDB: (fileName: string) => `.netlify/functions/filesDb?file=${fileName}`,
};

async function fetchAsync<T>(url: string): Promise<T | undefined> {
  try {
    const response = await fetch(url);
    return (await response.json()) as T;
  } catch (e) {
    console.log(`Could not fetch from ${url}`);
  }
  return undefined;
}

export const listDBs = () => fetchAsync<Config>(endpoints.list());
export const readDB = (fileName: string) =>
  fetchAsync(endpoints.readDB(fileName));

export const getStores = (): Promise<StoresResponse | undefined> =>
  fetchAsync<StoresResponse>(endpoints.readDB("Stores")).then((response) => response ? ({
    ...response,
    Stores: response?.Stores?.map((store) => ({
      ...store,
      Name: removeXmlTags(store.Name),
    })),
  }):undefined);

export const getRecipes = (): Promise<Recipe[] | undefined> =>
  fetchAsync<Recipe[]>(endpoints.readDB("Recipes"));

export const getTags = () =>
  fetchAsync<Record<string, string[]>>(endpoints.readDB("Tags"));
