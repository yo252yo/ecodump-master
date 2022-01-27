import classNames from "classnames";
import { formatNumber } from "../../utils/helpers";
import Styles from "./NumericInput.module.css";

type Props = {
  value?: number;
  onChange: (newValue: number) => void;
  class?: string;
};

export default (props: Props) => {
  return (
    <div
      class={classNames(
        Styles["custom-number-input"],
        "flex flex-row h-8 w-32 rounded-md",
        props.class
      )}
    >
      <button
        data-action="decrement"
        class="text-black border border-gray-300 hover:border-gray-400 w-20 rounded-l cursor-pointer outline-none"
        onClick={() => props.onChange(formatNumber((props.value ?? 0) - 1))}
      >
        <span class="m-auto text-1xl font-thin">−</span>
      </button>
      <input
        type="number"
        class="text-center w-full border-t border-b border-gray-300 font-semibold text-md text-black outline-none"
        name="custom-input-number"
        value={props.value ?? ""}
        onChange={(ev) =>
          props.onChange(formatNumber(Number(ev.currentTarget.value)))
        }
      ></input>
      <button
        data-action="increment"
        class="text-black border border-gray-300 hover:border-gray-400 w-20 rounded-r cursor-pointer outline-none"
        onClick={() => props.onChange(formatNumber((props.value ?? 0) + 1))}
      >
        <span class="m-auto text-1xl font-thin">+</span>
      </button>
    </div>
  );
};
