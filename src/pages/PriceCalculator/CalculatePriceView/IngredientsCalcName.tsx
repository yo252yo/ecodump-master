import Button from "../../../components/Button";
import Tooltip from "../../../components/Tooltip";
import { useMainContext } from "../../../hooks/MainContext";
import { getIngredientId } from "../../../utils/helpers";
import { useCalcContext } from "../context/CalcContext";

type Props = {
    ingredient: RecipeIngredient;
}
export default (props: Props) => {
    const { tagsResource } = useMainContext();
    const { priceCalcStore } = useCalcContext();
    const isCraftableProduct = (priceCalcStore.focusedNode()?.recipeVariants?.length ?? 0) > 0;
        
    if (!isCraftableProduct && props.ingredient.IsSpecificItem) {
        return <>{props.ingredient.Name}</>;
    }
    if (isCraftableProduct && props.ingredient.IsSpecificItem) {
        return (
            <Tooltip noStyle text={`Click to calculate price for ${props.ingredient.Name}`}>
                <Button onClick={() => priceCalcStore.update.focusChildProduct(getIngredientId(props.ingredient))}>
                    {props.ingredient.Name}
                </Button>
            </Tooltip>
        );
    }
    if (!isCraftableProduct && !props.ingredient.IsSpecificItem) {
        return (
            <Tooltip
                text={`One of: ${tagsResource()?.[props.ingredient.Tag]?.join(", ")}`}
                origin="NW"
                direction="NE"
            >
                <div class="inline-block px-2 py-1">{`Tag ${props.ingredient.Tag}`}</div>
            </Tooltip>
        );
    }
    return (
        <Tooltip 
            noStyle
            text={`Click to calculate price for one of: ${tagsResource()?.[props.ingredient.Tag]?.join(", ")}`}
            origin="NW"
            direction="NE"
        >
            <Button onClick={() => priceCalcStore.update.focusChildProduct(getIngredientId(props.ingredient))}>
                {`Tag ${props.ingredient.Tag}`}
            </Button>
        </Tooltip>
    );
};