import Checkbox from "../../../components/Checkbox";
import { useCalcContext } from "../context/CalcContext";

export default () => {
  const { priceCalcStore } = useCalcContext();
  return (
    <div class="absolute p-2 border rounded top-0 right-0">
      <Checkbox
        label="show recipes"
        checked={priceCalcStore.state.showRecipes}
        onChange={(checked) => priceCalcStore.update.setShowRecipes(checked)}
        left
      />
      <Checkbox
        label="show personal price"
        checked={priceCalcStore.state.showPersonalPrices}
        onChange={(checked) =>
          priceCalcStore.update.setShowPersonalPrices(checked)
        }
        left
      />
    </div>
  );
};
