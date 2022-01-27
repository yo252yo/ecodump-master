import classNames from "classnames";
import type { JSXElement } from "solid-js";

type Props = {
  text: string;
  vertical?: boolean;
  children: JSXElement;
};

export default (props: Props) => (
  <div
    class={classNames("flex", {
      "flex-row gap-2": !props.vertical,
      "flex-col gap-1": !!props.vertical,
    })}
  >
    <span>{props.text}</span>
    {props.children}
  </div>
);
