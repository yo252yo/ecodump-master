import { useMemo } from "react";
import { getStores, getStoresLastUpdate } from "../sdk/restDbSdk";
import { useQuery } from "react-query";
import { storesKey, storesLastUpdateKey } from "../utils/queryKeys";
import { GamePriceCurrencies } from "../types";
import { removeXmlTags } from "../utils/helpers";
import { min2, min30 } from "../utils/constants";

export default () => {
  const storesLastUpdateResponse = useQuery(
    storesLastUpdateKey,
    getStoresLastUpdate,
    {
      staleTime: min2,
      cacheTime: min2,
    }
  );

  const storesDbResponse = useQuery(
    [storesKey, storesLastUpdateResponse?.data?.data?.data],
    getStores,
    {
      staleTime: min30,
      cacheTime: min30,
    }
  );

  const storeData = storesDbResponse?.data?.data?.data;
  const storesDb = useMemo(() => {
    if (!storeData) return undefined;
    return {
      ...storeData,
      Stores: storeData.Stores.map((store) => ({
        ...store,
        Name: removeXmlTags(store.Name),
        CurrencyName: removeXmlTags(store.CurrencyName),
      })),
    };
  }, [storeData]);

  const fetchedGameCurrencies = useMemo(() => {
    return storesDb?.Stores.map((store) => ({
      currency: store.CurrencyName,
      items: store.AllOffers.map((offer) => ({
        ...offer,
        store: store.Name,
        storeOwner: store.Owner,
      })),
    })).reduce(
      (agg, t) => ({
        ...agg,
        [t.currency]: [...(agg[t.currency] ?? []), ...t.items],
      }),
      {} as GamePriceCurrencies
    );
  }, [storesDb]);

  return {
    storesLastUpdateResponse,
    storesDbResponse,
    fetchedGameCurrencies,
    storesDb,
  };
};
