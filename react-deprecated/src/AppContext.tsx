import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
} from "react";
import useGetCurrencies from "./context/useGetCurrencies";
import useGetFilters from "./context/useGetFilters";
import useGetStores from "./context/useGetStores";
import useGetRecipes from "./context/useGetRecipes";
import useLocalStorage from "./context/useLocalStorage";
import useRecipeCostPercentage from "./context/useRecipeCostPercentage";
import {
  CurrencyList,
  GamePrice,
  ItemPrice,
  RecipeCostPercentage,
  RecipeCraftAmmount,
  RecipeMargin,
  SelectedVariants,
} from "./types";
import { Items, RecipeVariant } from "./utils/typedData";
import useGetTags from "./context/useGetTags";
import { RecipeCraftSchemaEnum } from "./utils/constants";
const emptyStoresDb = {
  Version: 2,
  Stores: [],
  ExportedAt: {
    Year: 0,
    Month: 0,
    Day: 0,
    Hour: 0,
    Min: 0,
    Sec: 0,
    StringRepresentation: "",
    Ticks: 0,
  },
};
const AppContext = React.createContext<{
  storesDb: StoresHistV2;

  filterProfessions: string[];
  setFilterProfessions: Dispatch<SetStateAction<string[]>>;
  filterCraftStations: string[];
  setFilterCraftStations: Dispatch<SetStateAction<string[]>>;
  filterName: string;
  setFilterName: Dispatch<SetStateAction<string>>;
  filterWithRecipe: boolean;
  setFilterWithRecipe: Dispatch<SetStateAction<boolean>>;
  filterCredits: boolean;
  setFilterCredits: Dispatch<SetStateAction<boolean>>;

  currencyList: CurrencyList;
  setSelectedCurrency: (currencyName: string) => void;
  addNewCurrency: (
    currencyName: string,
    symbol: string,
    currencyToCopy: string
  ) => void;
  deleteCurrency: (currencyName: string) => void;
  resetCurrency: (currencyName: string) => void;
  updatePrice: (
    itemName: string,
    newPrice: number | undefined,
    currencyName?: string
  ) => void;
  currencySymbol: string;
  personalPrices: ItemPrice[];
  gamePrices: { [key: string]: GamePrice[] };

  selectedVariants: SelectedVariants;
  setSelectedVariants: Dispatch<SetStateAction<SelectedVariants>>;
  getRecipeCraftAmmount: (recipeName: string) => number;
  updateRecipeCraftAmmount: (recipeName: string, newAmmount: number) => void;
  getRecipeCraftModule: (recipeName: string) => number;
  updateRecipeCraftModule: (recipeName: string, newModule: number) => void;
  recipeCraftSchema: RecipeCraftSchemaEnum;
  setRecipeCraftSchema: (schema: RecipeCraftSchemaEnum) => void;
  getRecipeMargin: (recipeName: string) => number;
  updateRecipeMargin: (recipeName: string, newMargin: number) => void;

  getRecipeCostPercentage: (recipe: RecipeVariant) => RecipeCostPercentage;
  updateRecipeCostPercentage: (
    recipe: RecipeVariant,
    prodName: string,
    newPercentage: number
  ) => void;
  allItems: Items;
  allCraftStations: string[];
  allProfessions: string[];
  allTags: Record<string, string[]>;
}>({
  storesDb: emptyStoresDb,

  filterProfessions: [],
  setFilterProfessions: () => undefined,
  filterCraftStations: [],
  setFilterCraftStations: () => undefined,
  filterName: "",
  setFilterName: () => undefined,
  filterWithRecipe: true,
  setFilterWithRecipe: () => undefined,
  filterCredits: true,
  setFilterCredits: () => undefined,

  currencyList: { selectedCurrency: "", currencies: [] },
  setSelectedCurrency: () => undefined,
  addNewCurrency: () => undefined,
  deleteCurrency: () => undefined,
  resetCurrency: () => undefined,
  updatePrice: () => undefined,
  currencySymbol: "",
  personalPrices: [],
  gamePrices: {},

  selectedVariants: {},
  setSelectedVariants: () => undefined,
  getRecipeCraftAmmount: () => 0,
  updateRecipeCraftAmmount: () => undefined,
  getRecipeCraftModule: () => 0,
  updateRecipeCraftModule: () => undefined,
  recipeCraftSchema: RecipeCraftSchemaEnum.SIMPLE,
  setRecipeCraftSchema: () => undefined,
  getRecipeMargin: () => 0,
  updateRecipeMargin: () => undefined,

  getRecipeCostPercentage: () => ({ recipeKey: "", percentages: [] }),
  updateRecipeCostPercentage: () => undefined,

  allItems: {} as Items,
  allCraftStations: [] as string[],
  allProfessions: [] as string[],
  allTags: {},
});

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const { allItems, allCraftStations, allProfessions } = useGetRecipes();
  const allTags = useGetTags();
  const { storesDb, fetchedGameCurrencies } = useGetStores();
  const {
    currencyList,
    setSelectedCurrency,
    addNewCurrency,
    deleteCurrency,
    resetCurrency,
    updatePrice,
    currencySymbol,
    personalPrices,
    gamePrices,
    updateWithGameCurrencies,
  } = useGetCurrencies();
  const filters = useGetFilters();

  const { getRecipeCostPercentage, updateRecipeCostPercentage } =
    useRecipeCostPercentage();

  const [selectedVariants, setSelectedVariants] =
    useLocalStorage<SelectedVariants>("selectedVariant", {});

  const [recipeCraftAmmounts, setRecipeCraftAmmounts] =
    useLocalStorage<RecipeCraftAmmount>("RecipeCraftAmmount", {});

  const [recipeCraftModules, setRecipeCraftModules] =
    useLocalStorage<RecipeCraftAmmount>("RecipeCraftModules", {});

  const [recipeCraftSchema, setRecipeCraftSchema] =
    useLocalStorage<RecipeCraftSchemaEnum>(
      "recipeCraftSchema",
      RecipeCraftSchemaEnum.SIMPLE
    );

  const getRecipeCraftAmmount = useCallback(
    (recipeName: string) => recipeCraftAmmounts[recipeName] ?? 10,
    [recipeCraftAmmounts]
  );

  const updateRecipeCraftAmmount = useCallback(
    (recipeName: string, newAmmount: number) => {
      setRecipeCraftAmmounts((prev) => ({ ...prev, [recipeName]: newAmmount }));
    },
    [setRecipeCraftAmmounts]
  );

  const getRecipeCraftModule = useCallback(
    (recipeName: string) => recipeCraftModules[recipeName] ?? 0,
    [recipeCraftModules]
  );

  const updateRecipeCraftModule = useCallback(
    (recipeName: string, newModule: number) => {
      setRecipeCraftModules((prev) => ({ ...prev, [recipeName]: newModule }));
    },
    [setRecipeCraftModules]
  );

  const [recipeMargins, setRecipeMargins] = useLocalStorage<RecipeMargin>(
    "RecipeMargins",
    {}
  );

  const getRecipeMargin = useCallback(
    (recipeName: string) => recipeMargins[recipeName] ?? 5,
    [recipeMargins]
  );

  const updateRecipeMargin = useCallback(
    (recipeName: string, newMargin: number) => {
      setRecipeMargins((prev) => ({ ...prev, [recipeName]: newMargin }));
    },
    [setRecipeMargins]
  );

  // Update currency list with fetchedGameCurrencies
  useEffect(() => {
    fetchedGameCurrencies != null &&
      updateWithGameCurrencies(fetchedGameCurrencies);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchedGameCurrencies]);

  const filteredCurrencyList = {
    ...currencyList,
    currencies: !filters.filterCredits
      ? currencyList.currencies
      : currencyList.currencies.filter(
          (currency) => currency.name.indexOf("Credit") < 0
        ),
  };

  return (
    <AppContext.Provider
      value={{
        storesDb: storesDb ?? emptyStoresDb,
        ...filters,

        currencyList: filteredCurrencyList,
        setSelectedCurrency,
        addNewCurrency,
        deleteCurrency,
        resetCurrency,
        updatePrice,
        currencySymbol,
        personalPrices,
        gamePrices,

        selectedVariants,
        setSelectedVariants,
        getRecipeCraftAmmount,
        updateRecipeCraftAmmount,
        getRecipeCraftModule,
        updateRecipeCraftModule,
        recipeCraftSchema,
        setRecipeCraftSchema,
        getRecipeMargin,
        updateRecipeMargin,

        getRecipeCostPercentage,
        updateRecipeCostPercentage,

        allItems,
        allCraftStations,
        allProfessions,
        allTags,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
