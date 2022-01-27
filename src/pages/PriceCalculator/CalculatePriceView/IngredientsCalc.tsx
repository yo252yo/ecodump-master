import { For } from "solid-js";
import Accordion from "../../../components/Accordion/Accordion";
import AveragePrice from "../../../components/AveragePrice";
import Highlight from "../../../components/Highlight";
import LabeledField from "../../../components/LabeledField";
import PersonalPrice from "../../../components/PersonalPrice";
import RadioToggle from "../../../components/RadioToggle";
import Table, {
  TableBody,
  TableHeader,
  TableHeaderCol,
} from "../../../components/Table";
import { useMainContext } from "../../../hooks/MainContext";
import { formatNumber, getIngredientId } from "../../../utils/helpers";
import { useCalcContext } from "../context/CalcContext";
import IngredientsCalcName from "./IngredientsCalcName";
import RecipePicker from "./RecipePicker";

export default () => {
  const { get, update } = useMainContext();
  const { priceCalcStore, listProductsStore } = useCalcContext();

  return (
    <>
      <Accordion
        notCollapsible
        startsOpen
        class="mt-4"
        headerText={
          <span>
            <span class="font-medium">Ingredients</span>: Calculating costs for <Highlight text={priceCalcStore.focusedNode()?.productName} /> using recipe
            <RecipePicker
              selectedValue={
                priceCalcStore.focusedNode()?.selectedVariant?.Variant.Key ?? ""
              }
              recipeVariants={
                priceCalcStore.focusedNode()?.recipeVariants ?? []
              }
              setSelected={(selected: string) =>
                priceCalcStore.setSelectedRecipes((prev) => ({
                  ...prev,
                  [priceCalcStore.focusedNode()?.ingredientId ?? ""]: selected,
                }))
              }
            />
            {!!priceCalcStore.focusedNode()?.selectedVariant?.Variant.Key && (
              <>
                at table
                <Highlight text={priceCalcStore.selectedVariant()?.Recipe.CraftStation[0]} class="pl-2" />
              </>
            )}
          </span>
        }
      >
        { priceCalcStore.selectedVariant() && <>
          <div class="flex gap-5 flex-wrap">
            <LabeledField vertical text="Craft ammount:">
              <RadioToggle
                options={[
                  { text: "1", value: 1 },
                  { text: "10", value: 10 },
                  { text: "100", value: 100 },
                ]}
                onChange={(selected: string | number) =>
                  update.craftAmmount(
                    priceCalcStore.focusedNode()?.productName ?? "",
                    Number(selected)
                  )
                }
                selected={get.craftAmmount(
                  priceCalcStore.focusedNode()?.productName
                )}
              />
            </LabeledField>
            <LabeledField vertical text="Upgrade module in use:">
              <RadioToggle
                options={Array.from(new Array(6)).map((_, i) => ({
                  text: `M${i}`,
                  value: i,
                }))}
                onChange={(selected: string | number) =>
                  update.craftModule(
                    priceCalcStore.focusedNode()?.productName ?? "",
                    Number(selected)
                  )
                }
                selected={get.craftModule(priceCalcStore.focusedNode()?.productName)}
              />
            </LabeledField>
          </div>
          <div class="mt-8">
            <Table>
              <TableHeader>
                <TableHeaderCol>Ingredient name</TableHeaderCol>
                <TableHeaderCol>Quantity</TableHeaderCol>
                <TableHeaderCol>Average price</TableHeaderCol>
                <TableHeaderCol>Personal price</TableHeaderCol>
                <TableHeaderCol>Unit price</TableHeaderCol>
                <TableHeaderCol>Total price</TableHeaderCol>
              </TableHeader>
              <TableBody>
                <For each={priceCalcStore.recipeIngredients()}>
                  {(ingredient) => (
                    <tr>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <IngredientsCalcName ingredient={ingredient} />
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {ingredient.calcQuantity}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <AveragePrice
                          name={
                            ingredient.IsSpecificItem
                              ? ingredient.Name
                              : ingredient.Tag
                          }
                          isSpecificItem={ingredient.IsSpecificItem}
                          showPricesForProductsModal={
                            listProductsStore.update.showPricesForProductsModal
                          }
                        />
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <PersonalPrice
                          personalPriceId={getIngredientId(ingredient)}
                        />
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatNumber(ingredient.unitPrice)}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatNumber(ingredient.calcPrice)}
                      </td>
                    </tr>
                  )}
                </For>
              </TableBody>
            </Table>
          </div>

          <div class="flex items-center mt-8">
            Recipe production cost is
            <Highlight class="pl-1" text={`${priceCalcStore.totalIngredientCost()}`} />
            {priceCalcStore.craftAmmount() > 1 &&
              (priceCalcStore.totalIngredientCost() ?? 0) > 0 && (
                <>
                  , cost per repetition is
                  <Highlight class="pl-1" text={`${formatNumber(
                      (priceCalcStore.totalIngredientCost() ?? 0) /
                        priceCalcStore.craftAmmount()
                    )}`} />
                </>
              )}
          </div>
        </>
        }
      </Accordion>
    </>
  );
};
