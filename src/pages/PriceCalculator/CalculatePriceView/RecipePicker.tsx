import Dropdown from "../../../components/Dropdown";
import Highlight from "../../../components/Highlight";
import { sortByTextFn } from "../../../utils/helpers";

type Props = {
  selectedValue: string;
  recipeVariants: RecipeVariant[];
  setSelected: (selected: string) => void;
};

export default (props: Props) => {
  return (
    <>
      {(props.recipeVariants?.length ?? 0) === 1 && (
        <Highlight class="px-2" text={props.recipeVariants?.[0].Recipe.Untranslated} />
      )}
      {(props.recipeVariants?.length ?? 0) > 1 && (
        <div class="inline-block mx-2">
          <Dropdown
            value={props.selectedValue}
            values={[
              { value: "", text: "No recipe" },
              ...(
                props.recipeVariants?.map((t) => ({
                  text: t.Variant.Name,
                  value: t.Variant.Key,
                })) ?? []
              ).sort(sortByTextFn((t) => t.text)),
            ]}
            onChange={(newValue) => props.setSelected(`${newValue}`)}
          />
        </div>
      )}
    </>
  );
};
