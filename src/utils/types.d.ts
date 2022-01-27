declare interface Config {
  Dbs: DB[];
}

declare interface DB {
  Name: string;
  ExportedAt: ExportedAt;
}

declare interface Dictionary<T> {
  [key: string]: T;
}

declare interface ExportedAt {
  Year: number;
  Month: number;
  Day: number;
  Hour: number;
  Min: number;
  Sec: number;
  StringRepresentation: string;
  Ticks: number;
}

declare interface StoresResponse {
  Version: number;
  Stores: Stores[];
  ExportedAt: ExportedAt;
}

declare interface Stores {
  Name: string;
  Owner: string;
  Balance: number;
  CurrencyName: string;
  Enabled: boolean;
  AllOffers: Offers[];
}

declare interface Offers {
  ItemName: string;
  Buying: boolean;
  Price: number;
  Quantity: number;
  Limit: number;
  MaxNumWanted: number;
  MinDurability: number;
}

declare interface ProductOffer extends Offers {
  StoreName: string;
  StoreOwner: string;
  CurrencyName: string;
}

declare interface Recipe {
  Key: string;
  Untranslated: string;
  BaseCraftTime: number;
  BaseLaborCost: number;
  BaseXPGain: number;
  CraftStation: string[];
  DefaultVariant: string;
  NumberOfVariants: number;
  SkillNeeds: {
    Skill: string;
    Level: number;
  }[];
  Variants: Variant[];
}

declare interface Variant {
  Key: string;
  Name: string;
  Ingredients: RecipeIngredient[];
  Products: {
    Name: string;
    Ammount: number;
  }[];
}

declare interface RecipeIngredient {
  IsSpecificItem: boolean;
  Tag: string;
  Name: string;
  Ammount: number;
  IsStatic: boolean;
}

declare interface RecipeVariant {
  Recipe: Recipe;
  Variant: Variant;
}

declare interface CraftableProduct {
  Name: string;
  RecipeVariants: RecipeVariant[];
  Offers: ProductOffer[];
}

declare interface SetSignal<T> {
  (t: T | ((prev: T) => T)): void;
}
