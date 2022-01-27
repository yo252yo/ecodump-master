import { Dispatch, SetStateAction, useCallback, useMemo } from "react";
import {
  Currency,
  CurrencyList,
  GamePrice,
  GamePriceCurrencies,
  ItemPrice,
} from "../types";
import { currencyListKey } from "../utils/queryKeys";
import useLocalStorage from "./useLocalStorage";

const getNewPriceArray = (
  prevPrices: ItemPrice[],
  itemPriceIndex: number,
  itemName: string,
  newPrice: number | undefined
) => {
  // Delete itemPrice if newPrice is undefined
  if (newPrice === undefined && itemPriceIndex >= 0) {
    return [
      ...prevPrices.slice(0, itemPriceIndex),
      ...prevPrices.slice(itemPriceIndex + 1),
    ];
  }

  // Update itemPrice if it exists in array
  if (newPrice !== undefined && itemPriceIndex >= 0) {
    return [
      ...prevPrices.slice(0, itemPriceIndex),
      { ...prevPrices[itemPriceIndex], price: newPrice },
      ...prevPrices.slice(itemPriceIndex + 1),
    ];
  }

  // Add new itemPrice if it doesn't exist in array yet
  if (newPrice !== undefined && itemPriceIndex < 0) {
    return [
      ...prevPrices,
      {
        itemName: itemName,
        price: newPrice,
      },
    ];
  }

  // just a failsafe, all cases that matter are covered
  return prevPrices;
};

// Updates user price on a currency
const updatePrice = (
  setCurrencies: Dispatch<SetStateAction<CurrencyList>>,
  itemName: string,
  newPrice: number | undefined,
  currencyName?: string
) => {
  if (newPrice !== undefined && Number.isNaN(newPrice)) return;
  setCurrencies((prevCurrencies) => {
    // Currency to update
    const prevSelectedCurrencyIndex = prevCurrencies.currencies.findIndex(
      (t) => t.name === (currencyName ?? prevCurrencies.selectedCurrency)
    );
    // Currency prices to update
    const prevPrices =
      prevCurrencies.currencies[prevSelectedCurrencyIndex]?.itemPrices ?? [];

    // Item to update
    const index = prevPrices.findIndex((t) => t.itemName === itemName);

    // Return new currency list object with updated price
    return {
      ...prevCurrencies,
      currencies: [
        ...prevCurrencies.currencies.slice(0, prevSelectedCurrencyIndex),
        {
          ...prevCurrencies.currencies[prevSelectedCurrencyIndex],
          itemPrices: getNewPriceArray(prevPrices, index, itemName, newPrice),
        },
        ...prevCurrencies.currencies.slice(prevSelectedCurrencyIndex + 1),
      ],
    };
  });
};

export default () => {
  const [currencyList, setCurrencyList] = useLocalStorage<CurrencyList>(
    currencyListKey,
    {
      selectedCurrency: "default",
      currencies: [
        { name: "default", symbol: "$", itemPrices: [], gamePrices: [] },
      ],
    }
  );

  // Symbol of currently selected currency
  const currencySymbol = useMemo(
    () =>
      currencyList.currencies.find(
        (t) => t.name === currencyList.selectedCurrency
      )?.symbol ?? "$",
    [currencyList.currencies, currencyList.selectedCurrency]
  );

  // Updates the personal item price in the given currency
  const updatePriceCallback = useCallback(
    (itemName: string, newPrice: number | undefined, currencyName?: string) =>
      updatePrice(setCurrencyList, itemName, newPrice, currencyName),
    [setCurrencyList]
  );

  // User personal prices for the given currency
  const personalPrices = useMemo(() => {
    return (
      currencyList.currencies.find(
        (t) => t.name === currencyList.selectedCurrency
      )?.itemPrices ?? []
    );
  }, [currencyList.currencies, currencyList.selectedCurrency]);

  // Prices for the current currency imported from game
  const gamePrices = useMemo(() => {
    return (
      currencyList.currencies.find(
        (t) => t.name === currencyList.selectedCurrency
      )?.gamePrices ?? []
    ).reduce(
      (agg, next) => ({
        ...agg,
        [next.ItemName]: [...(agg[next.ItemName] ?? []), next],
      }),
      {} as { [key: string]: GamePrice[] }
    );
  }, [currencyList.currencies, currencyList.selectedCurrency]);

  const setSelectedCurrency = useCallback(
    (currencyName: string) =>
      setCurrencyList((prev) => ({
        ...prev,
        selectedCurrency: currencyName,
      })),
    [setCurrencyList]
  );

  const addNewCurrency = useCallback(
    (currencyName: string, symbol: string, currencyToCopy: string) =>
      setCurrencyList((prev) => ({
        ...prev,
        currencies: [
          ...prev.currencies,
          {
            name: currencyName,
            symbol: symbol,
            itemPrices:
              prev.currencies.find((t) => t.name === currencyToCopy)
                ?.itemPrices ?? [],
            gamePrices: [],
          },
        ],
      })),
    [setCurrencyList]
  );

  const deleteCurrency = useCallback(
    (currencyName: string) =>
      setCurrencyList((prev) => {
        const index = prev.currencies.findIndex((t) => t.name === currencyName);
        return {
          ...prev,
          currencies: [
            ...prev.currencies.slice(0, index),
            ...prev.currencies.slice(index + 1),
          ],
        };
      }),
    [setCurrencyList]
  );

  const resetCurrency = useCallback(
    (currencyName: string) =>
      setCurrencyList((prev) => {
        const index = prev.currencies.findIndex((t) => t.name === currencyName);
        return {
          ...prev,
          currencies: [
            ...prev.currencies.slice(0, index),
            {
              ...prev.currencies[index],
              itemPrices: [],
            },
            ...prev.currencies.slice(index + 1),
          ],
        };
      }),
    [setCurrencyList]
  );

  const updateWithGameCurrencies = (gameCurrencies: GamePriceCurrencies) => {
    const newCurrencies = [
      // Update gamePrices on existing currencies
      ...currencyList.currencies.map((currency) => ({
        ...currency,
        gamePrices: gameCurrencies[currency.name],
      })),
      // Creates new currencies from gamePrices
      ...Object.keys(gameCurrencies)
        .filter((currencyName) =>
          currencyList.currencies.every(
            (currency) => currency.name !== currencyName
          )
        )
        .map((currencyName) => ({
          name: currencyName,
          symbol: currencyName.substr(0, 2),
          itemPrices: [],
          gamePrices: gameCurrencies[currencyName],
        })),
    ] as Currency[];

    setCurrencyList((prev) => ({
      ...prev,
      currencies: newCurrencies,
    }));
  };

  return {
    currencyList,
    updatePrice: updatePriceCallback,
    currencySymbol,
    personalPrices,
    gamePrices,
    setSelectedCurrency,
    addNewCurrency,
    deleteCurrency,
    resetCurrency,
    updateWithGameCurrencies,
  };
};
