import { createMemo, For } from "solid-js";
import Button from "../../../components/Button";
import Tooltip from "../../../components/Tooltip";
import { useMainContext } from "../../../hooks/MainContext";
import { getRecipeBreadcrumb } from "../../../utils/recipeHelper";
import { useCalcContext } from "../context/CalcContext";

export default () => {
  const { allCraftableProducts, tagsResource, mainState } = useMainContext();
  const { priceCalcStore } = useCalcContext();
  const breadcrumb = createMemo(() =>
  getRecipeBreadcrumb(
      allCraftableProducts() ?? [],
      priceCalcStore.selectedRecipes(),
      tagsResource() ?? {},
      priceCalcStore.selectedProduct() ?? "",
      priceCalcStore.state.focusedProdPath
    )
  );
  return (
    <div class="border rounded px-8 py-3 bg-gray-50 mt-4">
      <div class="font-semibold text-sm">Calculating price for: </div>
      <div class="flex items-center gap-2">
        <For each={breadcrumb()}>
          {(node, index) => (
            <>
              {index() < breadcrumb().length - 1 && (
                <Tooltip noStyle text="Click to calculate price">
                  <Button
                    class="inline-block py-1 px-4"
                    onClick={() =>
                      priceCalcStore.update.replaceFocusedProductPath(node.path)
                    }
                  >
                      {node.productName}
                  </Button>
                </Tooltip>
              )}
              { index() < breadcrumb().length - 1 && (<div>&gt;</div>)}
              {index() === breadcrumb().length - 1 && (
                <div class="inline-block py-1 px-1 font-semibold">
                  {node.productName}
                </div>
              )}
            </>
          )}
        </For>
      </div>
    </div>
  );
};
