import axios from "axios";

const endpoints = {
  list: () => `${process.env.REACT_APP_DB}/operations/list`,
  readDB: (dbname: string, path: string = "/") =>
    `${process.env.REACT_APP_DB}/${dbname}?path=${path}`,
};

export const listDBs = () =>
  axios.get<Dictionary<Dictionary<number>>>(endpoints.list());

export const readDB = (dbname: string, path: string = "/") =>
  axios.get(endpoints.readDB(dbname, path));

export const getStoresLastUpdate = () =>
  axios.get<DbResponse<number>>(
    endpoints.readDB("stores", "/ExportedAt/Ticks")
  );

export const getStores = () =>
  axios.get<DbResponse<StoresHistV2>>(endpoints.readDB("stores"));

export const getRecipes = () =>
  axios.get<DbResponse<RecipeV1[]>>(endpoints.readDB("recipes"));

export const getTags = () =>
  axios.get<DbResponse<Record<string, string[]>>>(endpoints.readDB("tags"));
