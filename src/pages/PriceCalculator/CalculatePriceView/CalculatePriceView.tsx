import Button from "../../../components/Button";
import CalculatorRecipeTree from "./CalculatorRecipeTree";
import { useCalcContext } from "../context/CalcContext";
import IngredientsCalc from "./IngredientsCalc";
import ProductsCalc from "./ProductsCalc";
import CalculatorRecipeBreadcrumb from "./CalculatorRecipeBreadcrumb";
import RadioToggle from "../../../components/RadioToggle";

export default () => {
  const { priceCalcStore } = useCalcContext();

  return (
    <>
      {priceCalcStore.selectedProduct() !== undefined && (
        <>
          <div class="flex justify-between">
            <Button onClick={() => priceCalcStore.setSelectedProduct(undefined)}>
              Back
            </Button>
            <RadioToggle
              options={[
                { text: "Breadcrumb", value: "Breadcrumb" },
                { text: "Recipe tree", value: "RecipeTree" },
              ]}
              onChange={priceCalcStore.update.toggleShowRecipeTree}
              selected={priceCalcStore.state.showRecipeTree ? "RecipeTree" : "Breadcrumb"}
            />
          </div>
          {priceCalcStore.state.showRecipeTree && <CalculatorRecipeTree />}
          {!priceCalcStore.state.showRecipeTree && <CalculatorRecipeBreadcrumb />}
          <IngredientsCalc />
          <ProductsCalc />
        </>
      )}
    </>
  );
};
