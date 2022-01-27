import { createEffect, createMemo } from "solid-js";
import { OrderTypes, Orderings } from "../../utils/constants";
import createDebounce from "../../hooks/createDebounce";
import { useMainContext } from "../../hooks/MainContext";
import { createLocalStore } from "../../utils/createLocalStore";
import { filterByText, sortByCustomOrdering } from "../../utils/helpers";

type Store = {
  search: string;
  isStoresTable: boolean;
  filterOrderType: OrderTypes;
  storesPage: number;
  productsPage: number;
  filterByOwner: boolean;
  showStoreModal: string | undefined;
  orderingType: Orderings | undefined;
  pageSize: number,
};
export default () => {
  const {
    storesResource,
    allProductsInStores,
    mainState,
    update,
  } = useMainContext();
  const [state, setState] = createLocalStore<Store>(
    {
      search: "",
      isStoresTable: true,
      filterOrderType: OrderTypes.BOTH,
      storesPage: 1,
      productsPage: 1,
      filterByOwner: false,
      showStoreModal: undefined,
      orderingType: undefined,
      pageSize: 100,
    },
    "MarketStore"
  );

  const stores = createMemo(
    () =>
      storesResource()
        ?.Stores.filter(
          (store) =>
            (filterByText(state.search, store.Name ?? "") ||
              filterByText(state.search, store.Owner ?? "")) &&
            filterByText(mainState.currency, store.CurrencyName ?? "") &&
            (!state.filterByOwner ||
              mainState.userName.length === 0 ||
              filterByText(mainState.userName, store.Owner ?? ""))
        )
        .sort((a, b) =>
          a.Name.toLowerCase().localeCompare(b.Name.toLowerCase())
        )
        .slice(
          (state.storesPage - 1) * state.pageSize,
          state.storesPage * state.pageSize
        ) as Stores[]
  );
  const storesTotalPages = createMemo(() =>
    Math.ceil((storesResource()?.Stores?.length ?? 0) / state.pageSize)
  );

  const filteredProducts = createMemo(() =>
    (allProductsInStores() ?? []).filter(
      (product) =>
        (filterByText(state.search, product.ItemName ?? "") ||
          filterByText(state.search, product.StoreName ?? "") ||
          filterByText(state.search, product.StoreOwner ?? "")) &&
        filterByText(mainState.currency, product.CurrencyName ?? "") &&
        (!state.filterByOwner ||
          mainState.userName.length === 0 ||
          filterByText(mainState.userName, product.StoreOwner ?? "")) &&
        (state.filterOrderType === OrderTypes.BOTH ||
          state.filterOrderType === OrderTypes.BUY && product.Buying || state.filterOrderType === OrderTypes.SELL && !product.Buying)
    )
  );
  const productsTotalPages = createMemo(() =>
    Math.ceil((filteredProducts()?.length ?? 0) / state.pageSize)
  );
  const products = createMemo(() =>
    filteredProducts()
      .sort((a, b) => sortByCustomOrdering(a, b, state.orderingType))
      .slice(
        (state.productsPage - 1) * state.pageSize,
        state.productsPage * state.pageSize
      )
  );
  const [setSearch] = createDebounce(
    (newValue: string) =>
      setState({ search: newValue, storesPage: 1, productsPage: 1 }),
    200
  );
  createEffect(() => {
    // We want to updated state when currency changes
    // TODO: is there a better way to do this?
    mainState.currency;
    setState({ storesPage: 1, productsPage: 1 });
  });
  return {
    state,
    stores,
    setSearch,
    setCurrencyFilter: (newValue: string) => update.currency(newValue),
    toggleTableType: () =>
      setState((prev) => ({ isStoresTable: !prev.isStoresTable })),
    setOrderType: (newType: OrderTypes) => setState({ filterOrderType: newType}),
    setStoresPage: (pageNum: number) => setState({ storesPage: pageNum }),
    setProductsPage: (pageNum: number) => setState({ productsPage: pageNum }),
    setPageSize: (newPageSize: number) => setState({ pageSize: newPageSize }),
    setFilterByOwner: (filterByOwner: boolean) =>
      setState({ filterByOwner: filterByOwner }),
    setShowStoreModal: (storeName: string | undefined) =>
      setState({showStoreModal: storeName}),
    setOrdering: (newOrderingType: Orderings | undefined) =>
      setState({orderingType: newOrderingType}),
    products,
    storesTotalPages,
    productsTotalPages,
    clearFilters: () => setState({
      search: "",
      storesPage: 1,
      productsPage: 1,
      pageSize: 100,
      filterByOwner:false
    })
  };
};
