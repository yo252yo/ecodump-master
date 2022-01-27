import { For } from "solid-js";
import Accordion from "../../../components/Accordion/Accordion";
import Button from "../../../components/Button";
import Highlight from "../../../components/Highlight";
import LabeledField from "../../../components/LabeledField";
import NumericInput from "../../../components/NumericInput";
import PersonalPrice from "../../../components/PersonalPrice";
import RadioToggle from "../../../components/RadioToggle";
import Table, {
  TableBody,
  TableHeader,
  TableHeaderCol,
} from "../../../components/Table";
import Tooltip from "../../../components/Tooltip";
import { useMainContext } from "../../../hooks/MainContext";
import { fixPercentages } from "../../../utils/helpers";
import { useCalcContext } from "../context/CalcContext";

const recipeMargins = [0, 5, 10, 15, 20, 25, 30, 40, 50, 75, 100].map((t) => ({
  value: t,
  text: `${t} %`,
}));

export default () => {
  const { mainState, update } = useMainContext();
  const { priceCalcStore } = useCalcContext();
  return (
    <Accordion
      notCollapsible
      startsOpen
      class="mt-6"
      headerText={
        <span>
          <span class="font-medium">Products</span>: Distribute recipe costs
          between resulting products
        </span>
      }
    >
      {priceCalcStore.selectedVariant() && <>
        <div class="flex gap-5 flex-wrap">
          <LabeledField vertical text="Recipe margin:">
            <RadioToggle
              options={recipeMargins}
              onChange={(selected: string | number) =>
                update.recipeMargin(
                  priceCalcStore.selectedVariant()?.Recipe.Key ?? "",
                  Number(selected)
                )
              }
              selected={priceCalcStore.recipeMargin()}
            />
          </LabeledField>
        </div>
        <div class="flex items-center mt-2">
          Cost per recipe with margin applied is <Highlight class="px-1" text={`${priceCalcStore.unitCostWithProfit()}`} />
          {mainState.currency}
        </div>
        <div class="mt-8">
          <Table>
            <TableHeader>
              <TableHeaderCol>Product name</TableHeaderCol>
              <TableHeaderCol>Ammount</TableHeaderCol>
              <TableHeaderCol>Cost Percentage</TableHeaderCol>
              <TableHeaderCol>Production cost</TableHeaderCol>
              <TableHeaderCol>Retail price</TableHeaderCol>
              <TableHeaderCol>Personal price</TableHeaderCol>
            </TableHeader>
            <TableBody>
              <For each={priceCalcStore.recipeProducts()}>
                {(product) => (
                  <tr>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.Name}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.Ammount}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <NumericInput
                        value={product.costPercentage}
                        onChange={(newValue) =>
                          update.costPercentage(
                            priceCalcStore.selectedVariant()?.Variant.Key ?? "",
                            fixPercentages(
                              priceCalcStore.costPercentages(),
                              product.Name,
                              newValue
                            )
                          )
                        }
                      />
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <Tooltip noStyle text="Click to set your personal price">
                        <Button
                          onClick={() =>
                            update.personalPrice(
                              product.Name,
                              mainState.currency,
                              product.productionCost
                            )
                          }
                        >
                          {`${product.productionCost} ${mainState.currency}`}
                        </Button>
                      </Tooltip>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <Tooltip noStyle text="Click to set your personal price">
                        <Button
                          class="px-2 py-1"
                          onClick={() =>
                            update.personalPrice(
                              product.Name,
                              mainState.currency,
                              product.retailPrice
                            )
                          }
                        >
                          {`${product.retailPrice} ${mainState.currency}`}
                        </Button>
                      </Tooltip>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <PersonalPrice personalPriceId={product.Name} />
                    </td>
                  </tr>
                )}
              </For>
            </TableBody>
          </Table>
        </div>
      </>}
    </Accordion>
  );
};
