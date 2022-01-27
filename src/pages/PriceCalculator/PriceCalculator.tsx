import GamePricesModal from "../../components/GamePricesModal";
import ListProductsView from "./ListProductsView";
import CalculatePriceView from "./CalculatePriceView/CalculatePriceView";
import { CalcContextProvider } from "./context/CalcContext";

export default () => {
  return (
    <CalcContextProvider>
      <ListProductsView />
      <GamePricesModal />
      <CalculatePriceView />
    </CalcContextProvider>
  );
};
