import { For } from "solid-js";
import { Survivalist } from "./context/createListProductsStore";
import Table, {
  TableHeader,
  TableHeaderCol,
  TableBody,
} from "../../components/Table";
import SearchInput from "../../components/SearchInput";
import Dropdown from "../../components/Dropdown";
import Tooltip from "../../components/Tooltip";
import Pagination from "../../components/Pagination";
import { filterByTextEqual } from "../../utils/helpers";
import Button from "../../components/Button";
import { useMainContext } from "../../hooks/MainContext";
import PersonalPrice from "../../components/PersonalPrice/PersonalPrice";
import AveragePrice from "../../components/AveragePrice";
import { useCalcContext } from "./context/CalcContext";
import classNames from "classnames";
import Checkbox from "../../components/Checkbox";

export default () => {
  const { mainState, allProfessions, allCraftStations } =
    useMainContext();
  const { listProductsStore: props, priceCalcStore } = useCalcContext();
  return (
    <>
      {priceCalcStore.selectedProduct() == undefined && (
        <>
          <div class="flex justify-between">
            <div>
              <Tooltip
                text="Click to filter items being sold by stores owned by you (set your name in the header above)"
                origin="NW"
                direction="NE"
              >
                <Checkbox
                  label="Only show what I'm selling"
                  checked={props.state.filterByOwner}
                  onChange={(checked) => props.update.setFilterByOwner(checked)}
                />
              </Tooltip>
            </div>
            <div class="flex gap-2 mb-2">
              <SearchInput
                value={props.state.search}
                onChange={props.update.setSearch}
              />
              <Dropdown
                value={props.state.filterProfession}
                values={[
                  { value: "", text: "Filter by Profession" },
                  ...(allProfessions()?.map((name) => ({
                    value: name,
                    text: name,
                  })) ?? []),
                ]}
                onChange={(newValue) =>
                  props.update.setFilterProfession(`${newValue}`)
                }
                origin="SE"
                direction="SW"
              />
              <Dropdown
                value={props.state.filterCraftStation}
                values={[
                  { value: "", text: "Filter by crafting station" },
                  ...(allCraftStations()?.map((name) => ({
                    value: name,
                    text: name,
                  })) ?? []),
                ]}
                onChange={(newValue) =>
                  props.update.setFilterCraftStation(`${newValue}`)
                }
                origin="SE"
                direction="SW"
              />
              <Button onClick={() => props.update.clearFilters()}>Clear filters</Button>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableHeaderCol>Product Name</TableHeaderCol>
              <TableHeaderCol>Profession/Craft Station</TableHeaderCol>
              <TableHeaderCol>Average price</TableHeaderCol>
              <TableHeaderCol>Personal price</TableHeaderCol>
            </TableHeader>
            <TableBody>
              <For each={props.paginatedProducts()}>
                {(product) => (
                  <tr>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <Tooltip noStyle
                        text="Click to calculate price for this item"
                        origin="NW"
                        direction="NE"
                      >
                        <Button
                          onClick={() => priceCalcStore.setSelectedProduct(product.Name)}
                        >
                          {product.Name}
                        </Button>
                      </Tooltip>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.RecipeVariants.map((recipeVariant) =>
                        recipeVariant.Recipe.CraftStation.map((craftStation) =>
                          (recipeVariant.Recipe.SkillNeeds.length > 0
                            ? recipeVariant.Recipe.SkillNeeds
                            : [{ Skill: Survivalist, Level: 0 }]
                          ).map((skillNeed) => ({
                            Skill: skillNeed.Skill,
                            SkillLevel: skillNeed.Level,
                            craftStation,
                          }))
                        ).flat()
                      )
                        .flat()
                        // Remove duplicates:
                        .filter(
                          (value, index, self) =>
                            self.findIndex(
                              (t) =>
                                t.Skill === value.Skill &&
                                t.SkillLevel === value.SkillLevel &&
                                t.craftStation === value.craftStation
                            ) === index
                        )
                        // Filter by profession and crafting station filters
                        .filter(
                          (t) =>
                            filterByTextEqual(
                              props.state.filterProfession,
                              t.Skill
                            ) &&
                            filterByTextEqual(
                              props.state.filterCraftStation,
                              t.craftStation
                            )
                        )
                        .map((recipe, index) => (
                          <div class={classNames({ "mt-1": index > 0 })}>
                            <>
                              <Tooltip noStyle text="Click to filter by profession">
                                <Button
                                  onClick={() =>
                                    props.update.setFilterProfession(
                                      recipe.Skill
                                    )
                                  }
                                >
                                  {recipe.Skill}
                                </Button>
                              </Tooltip>
                              {` lvl${recipe.SkillLevel}`}
                            </>
                            {recipe.Skill && ` @ `}
                            <Tooltip noStyle text="Click to filter by craft station">
                              <Button
                                onClick={() =>
                                  props.update.setFilterCraftStation(
                                    recipe.craftStation
                                  )
                                }
                              >
                                {recipe.craftStation}
                              </Button>
                            </Tooltip>
                          </div>
                        ))}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <AveragePrice
                        name={product.Name}
                        isSpecificItem={true}
                        showPricesForProductsModal={
                          props.update.showPricesForProductsModal
                        }
                      />
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {!mainState.currency && "select currency"}
                      {mainState.currency && (
                        <div class="flex">
                          <PersonalPrice personalPriceId={product.Name} />
                          <Button
                            class="ml-2"
                            onClick={() =>
                              priceCalcStore.setSelectedProduct(product.Name)
                            }
                          >
                            Calculate now
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </For>
            </TableBody>
          </Table>
          <Pagination
            currentPage={props.state.currentPage}
            totalPages={props.totalPages()}
            onChange={props.update.setCurrentPage}
          />
        </>
      )}
    </>
  );
};
