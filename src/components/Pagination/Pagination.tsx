import { Show } from "solid-js";
import RadioToggle from "../RadioToggle";
type Props = {
  totalPages: number;
  currentPage: number;
  onChange: (page: number) => void;
};
export default (props: Props) => (
  <div class="flex justify-center mt-2">
    <RadioToggle
      options={Array.from(new Array(Math.min(props.totalPages, 20))).map(
        (_, i) => ({ value: i + 1, text: `${i + 1}` })
      )}
      onChange={(selected: string | number) =>
        props.onChange(Number(selected))
      }
      selected={`${props.currentPage}`}
    />
  </div>
);
