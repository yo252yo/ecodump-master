import {
  Accessor,
  createMemo,
  JSXElement,
  createContext,
  useContext,
  createResource,
  Resource,
} from "solid-js";
import { Store } from "solid-js/store";
import { createLocalStore } from "../../utils/createLocalStore";
import {
  filterUnique,
  sortByText,
  sortByTextExcludingWord,
} from "../../utils/helpers";
import { getRecipes, getStores, getTags, listDBs } from "../../utils/restDbSdk";

type MainContextType = {
  config: Resource<Config | undefined>;
  storesResource: Resource<StoresResponse | undefined>;
  recipesResource: Resource<Recipe[] | undefined>;
  tagsResource: Resource<Record<string, string[]> | undefined>;
  dbs: Accessor<DB[] | undefined>;
  allCurrencies: Accessor<string[] | undefined>;
  allProfessions: Accessor<string[] | undefined>;
  allCraftStations: Accessor<string[] | undefined>;
  allProductsInStores: Accessor<ProductOffer[] | undefined>;
  allCraftableProducts: Accessor<CraftableProduct[] | undefined>;
  mainState: Store<MainStore>;
  get: {
    personalPrice: (productName?: string) => number;
    craftAmmount: (productName?: string) => number;
    craftModule: (productName?: string) => number;
    recipeMargin: (recipeKey?: string) => number;
    costPercentage: (variantKey?: string) => {
      prod: string;
      perc: number;
    }[];
  };
  update: {
    currency: (newCurrency: string) => void;
    userName: (username: string) => void;
    personalPrice: (
      product: string,
      currency: string,
      newPrice: number
    ) => void;
    craftAmmount: (product: string, ammount: number) => void;
    craftModule: (product: string, module: number) => void;
    recipeMargin: (recipeKey: string, margin: number) => void;
    costPercentage: (
      variantKey: string,
      percentages: {
        prod: string;
        perc: number;
      }[]
    ) => void;
  };
};

const [config] = createResource(listDBs);
const [storesResource] = createResource(getStores);
const [recipesResource] = createResource(getRecipes);
const [tagsResource] = createResource(getTags);

const MainContext = createContext<MainContextType>({
  config,
  storesResource,
  recipesResource,
  tagsResource,
  dbs: () => [],
  allCurrencies: () => [],
  allProfessions: () => [],
  allCraftStations: () => [],
  allProductsInStores: () => [],
  allCraftableProducts: () => [],
  mainState: {
    currency: "",
    userName: "",
  },
  get: {
    personalPrice: (productName?: string) => 0,
    craftAmmount: (productName?: string) => 1,
    craftModule: (productName?: string) => 0,
    recipeMargin: (recipeKey?: string) => 0,
    costPercentage: (variantKey?: string) => [],
  },
  update: {
    currency: () => undefined,
    userName: () => undefined,
    personalPrice: (product: string, currency: string, newPrice: number) =>
      undefined,
    craftAmmount: (product: string, ammount: number) => undefined,
    craftModule: (product: string, module: number) => undefined,
    recipeMargin: (recipeKey: string, module: number) => undefined,
    costPercentage: () => undefined,
  },
});
type Props = {
  children: JSXElement;
};
type MainStore = {
  currency: string;
  userName: string;
};

type PersonalPricesStore = {
  [productName: string]: { [currency: string]: number };
};

type ProdNumberStore = {
  [productName: string]: number;
};

type CostPercentagesStore = {
  [variantKey: string]: { prod: string; perc: number }[];
};

export const MainContextProvider = (props: Props) => {
  const [personalPricesState, setPersonalPricesState] =
    createLocalStore<PersonalPricesStore>({}, "PersonalPricesStore");
  const [craftAmmoutState, setCraftAmmoutState] =
    createLocalStore<ProdNumberStore>({}, "craftAmmountStore");
  const [craftModuleState, setCraftModuleState] =
    createLocalStore<ProdNumberStore>({}, "craftModuleStore");
  const [recipeMarginState, setRecipeMarginState] =
    createLocalStore<ProdNumberStore>({}, "recipeMarginStore");
  const [CostPercentagesState, setCostPercentagesState] =
    createLocalStore<CostPercentagesStore>({}, "CostPercentagesStore");

  const [mainState, setState] = createLocalStore<MainStore>(
    {
      currency: "",
      userName: "",
    },
    "MainStore"
  );

  const dbs = createMemo(() => config()?.Dbs);

  const allCurrencies = createMemo(() =>
    storesResource()
      ?.Stores?.map((store) => store.CurrencyName)
      .filter(filterUnique)
      .sort(sortByTextExcludingWord("Credit"))
  );
  const allProductsInStores = createMemo(() =>
    storesResource()
      ?.Stores?.map((store) =>
        store.AllOffers.map(
          (offer) =>
            ({
              ...offer,
              StoreName: store.Name,
              StoreOwner: store.Owner,
              CurrencyName: store.CurrencyName,
            } as ProductOffer)
        )
      )
      .flat()
      .sort((a, b) => {
        const nameSort = a.ItemName?.toLowerCase().localeCompare(
          b.ItemName?.toLowerCase()
        );
        if (nameSort !== 0) {
          return nameSort;
        }
        return a.Buying ? 1 : -1;
      })
  );
  const allCraftableProducts = createMemo(() => {
    const CraftableProductsDict =
      recipesResource()
        ?.map((recipe) =>
          recipe.Variants.map((variant) =>
            variant.Products.map((prod) => ({
              Name: prod.Name,
              Recipe: recipe,
              Variant: variant,
            }))
          )?.flat()
        )
        ?.flat()
        ?.reduce(
          (prev, next) => ({
            ...prev,
            [next.Name]: {
              Name: next.Name,
              RecipeVariants: [
                ...(prev[next.Name]?.RecipeVariants ?? []),
                { Recipe: next.Recipe, Variant: next.Variant },
              ],
            } as CraftableProduct,
          }),
          {} as { [name: string]: CraftableProduct }
        ) ?? {};

    return Object.values(CraftableProductsDict)
      .map(
        (prod) =>
          ({
            ...prod,
            Offers: allProductsInStores()?.filter(
              (t) => t.ItemName === prod.Name
            ),
          } as CraftableProduct)
      )
      .sort(
        (a, b) =>
          a.Name?.toLowerCase()?.localeCompare(b.Name?.toLowerCase() ?? "") ?? 0
      );
  });

  const allProfessions = createMemo(() =>
    recipesResource()
      ?.map((recipe) => recipe.SkillNeeds.map((t) => t.Skill))
      .flat()
      .filter(filterUnique)
      .sort(sortByText)
  );

  const allCraftStations = createMemo(() =>
    recipesResource()
      ?.map((recipe) => recipe.CraftStation)
      .flat()
      .filter(filterUnique)
      .sort(sortByText)
  );

  const value = {
    config,
    storesResource,
    recipesResource,
    tagsResource,
    dbs,
    allCurrencies,
    allProfessions,
    allCraftStations,
    allProductsInStores,
    allCraftableProducts,
    mainState,
    get: {
      personalPrice: (productName?: string) =>
        personalPricesState[productName ?? ""]?.[mainState.currency],
      craftAmmount: (productName?: string) =>
        craftAmmoutState[productName ?? ""] ?? 1,
      craftModule: (productName?: string) =>
        craftModuleState[productName ?? ""] ?? 0,
      recipeMargin: (recipeKey?: string) =>
        recipeMarginState[recipeKey ?? ""] ?? 0,
      costPercentage: (variantKey?: string) =>
        CostPercentagesState[variantKey ?? ""],
    },
    update: {
      currency: (newCurrency: string) => setState({ currency: newCurrency }),
      userName: (username: string) => {
        // If no currency is selected, select the user's currency
        if (mainState.currency.length == 0 || allCurrencies()?.filter(t => t === mainState.currency).length === 0){
          const userPersonalCurrency = allCurrencies()?.find(t => t.indexOf(username) === 1);
          if (userPersonalCurrency) {
            setState({currency: userPersonalCurrency});
          }
        }
        setState({ userName: username });
      },
      personalPrice: (product: string, currency: string, newPrice: number) =>
        setPersonalPricesState((prev) => ({
          [product]: { ...(prev[product] ?? {}), [currency]: newPrice },
        })),
      craftAmmount: (product: string, ammount: number) =>
        setCraftAmmoutState({ [product]: ammount }),
      craftModule: (product: string, module: number) =>
        setCraftModuleState({ [product]: module }),
      recipeMargin: (recipeKey: string, margin: number) =>
        setRecipeMarginState({ [recipeKey]: margin }),
      costPercentage: (
        variantKey: string,
        percentages: {
          prod: string;
          perc: number;
        }[]
      ) =>
        setCostPercentagesState((prev) => ({
          ...prev,
          [variantKey]: percentages,
        })),
    },
  } as MainContextType;

  return (
    <MainContext.Provider value={value}>{props.children}</MainContext.Provider>
  );
};

export const useMainContext = () => useContext(MainContext);
