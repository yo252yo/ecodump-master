export interface RecipesFile {
  recipes: {
    [key: string]: {
      defaultVariant: string;
      craftStn: string[];
      skillNeeds: string[][];
      numberOfVariants: string;
      variants: {
        [key: string]: {
          untranslated: string;
          ingredients: string[][];
          products: string[][];
        };
      };
    };
  };
}

export interface RecipeCostProdPercentage {
  productName: string;
  percentage: number;
}

export interface RecipeCostPercentage {
  recipeKey: string;
  percentages: RecipeCostProdPercentage[];
}

export interface SelectedVariants {
  [item: string]: string;
}

export interface RecipeCraftAmmount {
  [recipeName: string]: number;
}

export interface RecipeMargin {
  [recipeName: string]: number;
}

export type RecipeVariant = {
  untranslated: string;
  ingredients: string[][];
  products: string[][];
};

export type Recipe = {
  key: string;
  name: string;
  profession: string;
  numberOfProfessions: number;
  craftStation: string;
  numberOfCraftStations: number;
  numberOfVariants: number;
  variants: {
    [key: string]: RecipeVariant;
  };
};

export type Item = {
  key: string;
  name: string;
  profession: string;
  numberOfProfessions: number;
  craftStation: string;
  numberOfCraftStations: number;
  numberOfVariants: number;
  variants: string[];
  ingredients: string[][];
  products: string[][];
};

export interface ItemPrice {
  itemName: string;
  price: number;
}

export interface GamePrice extends OffersV1 {
  store: string;
  storeOwner: string;
}

export type Currency = {
  name: string;
  symbol: string;
  itemPrices: ItemPrice[];
  gamePrices: GamePrice[];
};

export type CurrencyList = {
  selectedCurrency: string;
  currencies: Currency[];
};

export type GamePriceCurrencies = { [key: string]: Array<GamePrice> };
