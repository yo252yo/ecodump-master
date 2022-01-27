import {
  getIngredientId,
  getRecipeEvenPercentages,
} from "./../../../utils/helpers";
import {
  getFlatRecipeIngredients,
  RecipeNodeFlat,
} from "./../../../utils/recipeHelper";
import { useMainContext } from "./../../../hooks/MainContext/MainContext";
import { createLocalStore } from "../../../utils/createLocalStore";
import { Store } from "solid-js/store";
import { Accessor, createMemo, createSignal } from "solid-js";
import { getSelectedOrFirstRecipeVariant } from "../../../utils/recipeHelper";
import {
  calcAmmount,
  calcPrice,
  formatNumber,
  convertToMarginMultiplier,
} from "../../../utils/helpers";

type StoreType = {
  showRecipes: boolean;
  showPersonalPrices: boolean;
  showRecipeTree: boolean;
  focusedProdPath: string[];
};

type StoreUpdate = {
  setShowRecipes: (showRecipes: boolean) => void;
  setShowPersonalPrices: (showPersonalProces: boolean) => void;
  toggleShowRecipeTree: () => void;
  replaceFocusedProductPath: (focusedProductPath: string[]) => void;
  focusChildProduct: (focusedProd: string) => void;
};

type SelectedRecipes = {
  [key: string]: string;
};

export type PriceCalcStore = {
  state: Store<StoreType>;
  craftModule: Accessor<number>;
  craftAmmount: Accessor<number>;
  recipeMargin: Accessor<number>;
  focusedNode: Accessor<RecipeNodeFlat | undefined>;
  selectedVariant: Accessor<RecipeVariant | undefined>;
  recipeIngredients: Accessor<
    (RecipeIngredient & {
      calcQuantity: number;
      unitPrice: number;
      calcPrice: number;
    })[]
  >;
  totalIngredientCost: Accessor<number>;
  unitCostWithProfit: Accessor<number>;
  recipeProducts: Accessor<
    {
      costPercentage: number;
      productionCost: number;
      retailPrice: number;
      Name: string;
      Ammount: number;
    }[]
  >;
  costPercentages: Accessor<
    {
      prod: string;
      perc: number;
    }[]
  >;
  selectedProduct: Accessor<string | undefined>;
  selectedRecipes: Accessor<SelectedRecipes>;
  setSelectedProduct: (prod: string | undefined) => void;
  setSelectedRecipes: SetSignal<SelectedRecipes>;
  update: StoreUpdate;
};

const multipliers = [1, 0.9, 0.75, 0.6, 0.55, 0.5];
export default (): PriceCalcStore => {
  const { get, allCraftableProducts, tagsResource } = useMainContext();
  const [state, setState] = createLocalStore<StoreType>(
    {
      showRecipes: false,
      showPersonalPrices: false,
      showRecipeTree: false,
      focusedProdPath: [],
    },
    "PriceCalculatorPriceCalcStore"
  );

  const [selectedProduct, setSelectedProduct] = createSignal<string>();

  const [selectedRecipes, setSelectedRecipes] = createSignal<SelectedRecipes>(
    {}
  );

  // Ingredients for the selected product (NOT the focused product!)
  const flatRecipeIngredientsTree = createMemo(() =>
    getFlatRecipeIngredients(
      allCraftableProducts() ?? [],
      selectedRecipes(),
      tagsResource() ?? {},
      selectedProduct() ?? ""
    )
  );
  
  const focusedProd = createMemo(() => state.focusedProdPath.length === 0 ? undefined : state.focusedProdPath[state.focusedProdPath.length - 1]);

  const craftModule = createMemo(() =>
    get.craftModule(focusedProd())
  );
  const craftAmmount = createMemo(() =>
    get.craftAmmount(focusedProd())
  );

  const focusedNode = createMemo(() =>
    flatRecipeIngredientsTree().find(
      (t) => t.ingredientId == focusedProd()
    )
  );

  const selectedVariant = createMemo(() =>
    getSelectedOrFirstRecipeVariant(
      focusedNode()?.recipeVariants ?? [],
      selectedRecipes()[focusedProd() ?? ""]
    )
  );

  const recipeMargin = createMemo(() =>
    get.recipeMargin(selectedVariant()?.Recipe.Key)
  );

  const costPercentages = createMemo(() => {
    const variant = selectedVariant()?.Variant;
    if (variant == null) return [];
    return get.costPercentage(variant.Key) ?? getRecipeEvenPercentages(variant);
  });

  // This is the recipe ingredients for the focused product
  const recipeIngredients = createMemo(() => {
    const variant = selectedVariant();
    if (variant == undefined) return [];
    return variant.Variant.Ingredients.map((ingredient) => {
      const quantity = formatNumber(
        ingredient.Ammount *
          (ingredient.IsStatic ? 1 : multipliers[craftModule()])
      );
      const quantityBasedOnCraftAmmount = calcAmmount(quantity, craftAmmount());
      return {
        ...ingredient,
        calcQuantity: quantityBasedOnCraftAmmount,
        unitPrice: calcPrice(
          quantityBasedOnCraftAmmount / craftAmmount(),
          get.personalPrice(getIngredientId(ingredient))
        ),
        calcPrice: calcPrice(
          quantityBasedOnCraftAmmount,
          get.personalPrice(getIngredientId(ingredient))
        ),
      };
    });
  });

  const totalIngredientCost = createMemo(() =>
    formatNumber(
      recipeIngredients()?.reduce((prev, next) => prev + next.calcPrice, 0) ?? 0
    )
  );

  const unitCostWithProfit = createMemo(() =>
    formatNumber(
      (totalIngredientCost() / craftAmmount()) *
        convertToMarginMultiplier(recipeMargin())
    )
  );

  const recipeProducts = createMemo(() => {
    const variant = selectedVariant();
    if (variant == undefined) return [];
    return variant.Variant.Products.map((product) => {
      const costPercentage =
        costPercentages().find((t) => t.prod === product.Name)?.perc ?? 0;
      return {
        ...product,
        costPercentage,
        productionCost: formatNumber(
          ((totalIngredientCost() / craftAmmount()) * (costPercentage / 100)) /
            product.Ammount
        ),
        retailPrice: formatNumber(
          (unitCostWithProfit() * (costPercentage / 100)) / product.Ammount
        ),
      };
    });
  });

  return {
    state,
    craftModule,
    craftAmmount,
    recipeMargin,
    recipeIngredients,
    totalIngredientCost,
    unitCostWithProfit,
    recipeProducts,
    focusedNode,
    selectedVariant,
    selectedProduct,
    selectedRecipes,
    costPercentages,
    setSelectedProduct: (prod: string | undefined) => {
      setSelectedProduct(prod);
      if (prod != undefined)
        setState({ focusedProdPath: [prod] });
    },
    setSelectedRecipes,
    update: {
      setShowRecipes: (newValue: boolean) =>
        setState({ showRecipes: newValue }),
      setShowPersonalPrices: (newValue: boolean) =>
        setState({ showPersonalPrices: newValue }),
      toggleShowRecipeTree: () =>
        setState(prev => ({ showRecipeTree: !prev.showRecipeTree })),
      replaceFocusedProductPath: (focusedProductPath: string[]) => setState({focusedProdPath: focusedProductPath}),
      focusChildProduct: (focusedProd: string) => setState(prev => ({focusedProdPath: [...prev.focusedProdPath, focusedProd]})),
    } as StoreUpdate,
  };
};
