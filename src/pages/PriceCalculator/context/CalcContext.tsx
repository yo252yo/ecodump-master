import { createContext, JSXElement, useContext } from "solid-js";
import createPriceCalculatorStore, {
  ListProductsStore,
} from "./createListProductsStore";
import createPriceCalcStore, { PriceCalcStore } from "./createPriceCalcStore";

type Store = {
  recipeKey?: string;
  craftAmmount: number;
  upgradeModule: number;
  recipeMargin: number;
};
type ContextType = {
  listProductsStore: ListProductsStore;
  priceCalcStore: PriceCalcStore;
};

const CalculatorContext = createContext<ContextType>({} as ContextType);
export const CalcContextProvider = (props: { children: JSXElement }) => {
  const listProductsStore = createPriceCalculatorStore();
  const priceCalcStore = createPriceCalcStore();

  const value = {
    listProductsStore,
    priceCalcStore,
  } as ContextType;
  return (
    <CalculatorContext.Provider value={value}>
      {props.children}
    </CalculatorContext.Provider>
  );
};

export const useCalcContext = () => useContext(CalculatorContext);
