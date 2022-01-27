import { Accessor, createMemo } from "solid-js";
import createDebounce from "../../../hooks/createDebounce";
import { useMainContext } from "../../../hooks/MainContext";
import { createLocalStore } from "../../../utils/createLocalStore";
import { filterByIncludesAny, filterByText } from "../../../utils/helpers";
import { Store } from "solid-js/store";

const pageSize = 100;
export type StoreType = {
  search: string;
  filterProfession: string;
  filterCraftStation: string;
  currentPage: number;
  showPricesForProductsModal?: { name: string; isSpecificProduct: boolean };
  filterByOwner: boolean;
};
export type StoreUpdate = {
  setSearch: (newSearch: string) => void;
  setFilterProfession: (newSearch: string) => void;
  setFilterCraftStation: (newSearch: string) => void;
  setCurrentPage: (newPage: number) => void;
  showPricesForProductsModal: (
    name: string,
    isSpecificProduct: boolean
  ) => void;
  hidePricesForProductsModal: () => void;
  setFilterByOwner: (filterByOwner: boolean) => void;
  clearFilters: () => void;
};
export type ListProductsStore = {
  state: Store<StoreType>;
  paginatedProducts: Accessor<CraftableProduct[] | undefined>;
  totalPages: Accessor<number>;
  update: StoreUpdate;
};
export const Survivalist = "Survivalist";
export default (): ListProductsStore => {
  const { allCraftableProducts, allProductsInStores, mainState } =
    useMainContext();
  const [state, setState] = createLocalStore<StoreType>(
    {
      search: "",
      filterProfession: "",
      filterCraftStation: "",
      currentPage: 1,
      showPricesForProductsModal: undefined,
      filterByOwner: false,
    },
    "PriceCalculatorListProductsStore"
  );

  const mySellingProducts = createMemo(() => {
    if (!state.filterByOwner || mainState.userName.length === 0) return [];
    return (
      allProductsInStores()
        ?.filter((t) => t.StoreOwner === mainState.userName && !t.Buying)
        .map((t) => t.ItemName) ?? []
    );
  });

  const filteredProducts = createMemo(() =>
    allCraftableProducts()?.filter(
      (product) =>
        filterByText(state.search, product.Name ?? "") &&
        filterByIncludesAny(
          [state.filterProfession],
          product.RecipeVariants.map((variant) =>
            variant.Recipe.SkillNeeds.map((t) => t.Skill)
          ).flat()
        ) &&
        filterByIncludesAny(
          [state.filterCraftStation],
          product.RecipeVariants.map(
            (variant) => variant.Recipe.CraftStation
          ).flat()
        ) &&
        (!state.filterByOwner ||
          mainState.userName.length === 0 ||
          filterByIncludesAny(mySellingProducts(), [product.Name]))
    )
  );

  const paginatedProducts = createMemo(() =>
    filteredProducts()?.slice(
      (state.currentPage - 1) * pageSize,
      state.currentPage * pageSize
    )
  );

  const totalPages = createMemo(() =>
    Math.ceil((filteredProducts()?.length ?? 0) / pageSize)
  );
  const [setSearch] = createDebounce(
    (newSearch: string) => setState({ search: newSearch, currentPage: 1 }),
    200
  );
  return {
    state,
    paginatedProducts,
    totalPages,
    update: {
      setSearch,
      setFilterProfession: (newSearch: string) =>
        setState({
          filterProfession: newSearch === Survivalist ? "" : newSearch,
          currentPage: 1,
        }),
      setFilterCraftStation: (newSearch: string) =>
        setState({ filterCraftStation: newSearch, currentPage: 1 }),
      setCurrentPage: (newPage: number) => setState({ currentPage: newPage }),
      showPricesForProductsModal: (name: string, isSpecificProduct: boolean) =>
        setState({ showPricesForProductsModal: { name, isSpecificProduct } }),
      hidePricesForProductsModal: () =>
        setState({ showPricesForProductsModal: undefined }),
      setFilterByOwner: (filterByOwner: boolean) => setState({ filterByOwner }),
      clearFilters: () => 
        setState({search: "", currentPage: 1, filterProfession: "", filterCraftStation: "", filterByOwner: false}),
    },
  };
};
