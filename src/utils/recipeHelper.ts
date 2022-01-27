import { getTagPersonalPriceId } from "./helpers";
type SelectedRecipeVariants = { [key: string]: string };
type RecipeNode = {
  ingredientId: string;
  productName: string;
  recipeVariants: RecipeVariant[];
  selectedVariant?: RecipeVariant;
  isTag: boolean;
  quantity: number;
};
type RecipeNodeTree = RecipeNode & {
  ancestors?: RecipeNodeTree[];
};
export type RecipeNodeFlat = RecipeNode & {
  level: number;
  path: string[];
};

export const getSelectedRecipeVariant = (
  recipeVariants: RecipeVariant[],
  recipeVariantKey?: string
) =>
  recipeVariantKey
    ? recipeVariants.find((t) => t.Variant.Key === recipeVariantKey)
    : undefined;

export const getSelectedOrFirstRecipeVariant = (
  recipeVariants: RecipeVariant[],
  recipeVariantKey?: string
): RecipeVariant | undefined =>
  recipeVariants.length === 1 ? recipeVariants?.[0] : getSelectedRecipeVariant(recipeVariants, recipeVariantKey);

export const getRecipeTreeForProduct = (
  allCraftableProducts: CraftableProduct[],
  selectedVariants: SelectedRecipeVariants,
  allTags: Record<string, string[]>,
  productName: string,
  avoidLoop: string[],
  quantity: number
): RecipeNodeTree => {
  const craftableProduct = allCraftableProducts.find(
    (t) => t.Name === productName
  );
  if (craftableProduct == null)
    return {
      ingredientId: productName,
      productName,
      recipeVariants: [],
      isTag: false,
      quantity,
    };
  const selectedVariant = getSelectedOrFirstRecipeVariant(
    craftableProduct.RecipeVariants,
    selectedVariants[productName]
  );
  const ancestors = avoidLoop.includes(productName)
    ? []
    : selectedVariant?.Variant.Ingredients.map((t) =>
        getRecipeTreeForIngredient(
          allCraftableProducts,
          selectedVariants,
          allTags,
          t,
          [...avoidLoop, productName]
        )
      );

  return {
    ingredientId: productName,
    isTag: false,
    productName,
    recipeVariants: craftableProduct.RecipeVariants,
    selectedVariant,
    ancestors,
    quantity,
  };
};

const getRecipeTreeForTag = (
  allCraftableProducts: CraftableProduct[],
  selectedVariants: SelectedRecipeVariants,
  allTags: Record<string, string[]>,
  tagName: string,
  avoidLoop: string[],
  quantity: number
): RecipeNodeTree => {
  const ingredientId = getTagPersonalPriceId(tagName);
  const productsInTag = allTags[tagName] ?? [];
  const craftableProducts = allCraftableProducts.filter((t) =>
    productsInTag.includes(t.Name)
  );
  if (craftableProducts == null || craftableProducts.length == 0)
    return {
      ingredientId,
      productName: `Tag: ${tagName}`,
      recipeVariants: [],
      isTag: true,
      quantity,
    };
  const recipeVariants = craftableProducts.map((t) => t.RecipeVariants).flat();
  const selectedVariant = getSelectedRecipeVariant(
    recipeVariants,
    selectedVariants[ingredientId]
  );
  const ancestors =
    avoidLoop.includes(ingredientId) || selectedVariant == null
      ? []
      : selectedVariant.Variant.Ingredients.map((t) =>
          getRecipeTreeForIngredient(
            allCraftableProducts,
            selectedVariants,
            allTags,
            t,
            [...avoidLoop, ingredientId]
          )
        );

  return {
    ingredientId,
    isTag: true,
    productName: `Tag: ${tagName}`,
    recipeVariants: recipeVariants,
    selectedVariant,
    ancestors,
    quantity,
  };
};

export const getRecipeTreeForIngredient = (
  allCraftableProducts: CraftableProduct[],
  selectedVariants: SelectedRecipeVariants,
  allTags: Record<string, string[]>,
  ingredient: {
    IsSpecificItem: boolean;
    Tag: string;
    Name: string;
    Ammount: number;
  },
  avoidLoop: string[]
) =>
  ingredient.IsSpecificItem
    ? getRecipeTreeForProduct(
        allCraftableProducts,
        selectedVariants,
        allTags,
        ingredient.Name,
        avoidLoop,
        ingredient.Ammount
      )
    : getRecipeTreeForTag(
        allCraftableProducts,
        selectedVariants,
        allTags,
        ingredient.Tag,
        avoidLoop,
        ingredient.Ammount
      );

const createFlatNode = (
  node: RecipeNodeTree,
  level: number,
  path: string[]) => ({
    ingredientId: node.ingredientId,
    isTag: node.isTag,
    productName: node.productName,
    recipeVariants: node.recipeVariants,
    selectedVariant: node.selectedVariant,
    level,
    path,
    quantity: node.quantity,
  } as RecipeNodeFlat);

const flattenRecipeTreeNode = (
  node: RecipeNodeTree,
  level = 0,
  prevPath = [] as string[]
): RecipeNodeFlat[] => {
  const path = [...prevPath, node.ingredientId];
  return [
    createFlatNode(node, level, path),
    ...(
      node.ancestors?.map((t) => flattenRecipeTreeNode(t, level + 1, path)) ?? []
    ).flat(),
  ];
};

const isolateBreadcrumbPath = (
  node: RecipeNodeTree,
  breadcrumbIngredientIds: string[],
  prevPath = [] as string[]): RecipeNodeFlat[] => {
    const path = [...prevPath, node.ingredientId];
    // Should hit on last ancestor
    if (breadcrumbIngredientIds.length <= 1 || node.ingredientId !== breadcrumbIngredientIds[0]) {
      return [createFlatNode(node, 0, path)];
    }
    // Should not hit, just a failsafe
    const ancestor = node.ancestors?.find(t => t.ingredientId === breadcrumbIngredientIds[1]);
    if (ancestor == null) {
      return [createFlatNode(node, 0, path)];
    }
    return [createFlatNode(node, 0, path), ...isolateBreadcrumbPath(ancestor, breadcrumbIngredientIds.slice(1), [...prevPath, node.ingredientId])];
  };

export const getFlatRecipeIngredients = (
  allCraftableProducts: CraftableProduct[],
  selectedRecipes: SelectedRecipeVariants,
  allTags: Record<string, string[]>,
  productName: string
) => {
  const result = getRecipeTreeForProduct(
    allCraftableProducts,
    selectedRecipes,
    allTags,
    productName,
    [],
    1
  );
  return flattenRecipeTreeNode(result);
};

export const getRecipeBreadcrumb = (
  allCraftableProducts: CraftableProduct[],
  selectedRecipes: SelectedRecipeVariants,
  allTags: Record<string, string[]>,
  productName: string,
  breadcrumbIngredientIds: string[]
) => {
  const result = getRecipeTreeForProduct(
    allCraftableProducts,
    selectedRecipes,
    allTags,
    productName,
    [],
    1
  );
  return isolateBreadcrumbPath(result, breadcrumbIngredientIds);
};

export const joinPath = (path: string[]) => path.join('=>');