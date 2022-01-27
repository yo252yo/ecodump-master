declare interface DbResponse<T> {
  success: boolean;
  data: T;
}

declare interface Dictionary<T> {
  [key: string]: T;
}

declare interface ExportedAtV2 {
  Year: number;
  Month: number;
  Day: number;
  Hour: number;
  Min: number;
  Sec: number;
  StringRepresentation: string;
  Ticks: number;
}

declare interface StoresHistV2 {
  Version: number;
  Stores: StoresV1[];
  ExportedAt: ExportedAtV2;
}

declare interface OffersV1 {
  ItemName: string;
  Buying: boolean;
  Price: number;
  Quantity: number;
  Limit: number;
  MaxNumWanted: number;
  MinDurability: number;
}

declare interface StoresV1 {
  Name: string;
  Owner: string;
  Balance: number;
  CurrencyName: string;
  Enabled: boolean;
  AllOffers: OffersV1[];
}

declare interface StoresHistV1 {
  Version: number;
  Stores: StoresV1[];
  ExportedAtYear: number;
  ExportedAtMonth: number;
  ExportedAtDay: number;
  ExportedAtHour: number;
  ExportedAtMin: number;
  ExportedAt: string;
}

declare interface RecipeV1 {
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
  Variants: {
    Key: string;
    Name: string;
    Ingredients: RecipeV1Ingredient[];
    Products: {
      Name: string;
      Ammount: number;
    }[];
  }[];
}

declare interface RecipeV1Ingredient {
  IsSpecificItem: boolean;
  Tag: string;
  Name: string;
  Ammount: number;
  IsStatic: boolean;
}
