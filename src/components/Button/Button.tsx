import classNames from "classnames";
import type { JSXElement } from "solid-js";

type Props = {
  children: JSXElement;
  onClick: () => void;
  class?: string;
};
export default (props: Props) => (
  <button
    class={classNames(
      "bg-white text-black text-sm font-semibold py-1 px-2 border border-gray-300 rounded hover:bg-gray-100",
      props.class ?? ""
    )}
    onClick={props.onClick}
  >
    {props.children}
  </button>
);
