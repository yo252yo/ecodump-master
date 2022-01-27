import classNames from "classnames";
import { createSignal, JSXElement } from "solid-js";

type Props = {
  children: JSXElement;
  startsOpen?: boolean;
  headerText: JSXElement;
  class?: string;
  notCollapsible?: boolean;
};
export default (props: Props) => {
  const [isOpen, setIsOpen] = createSignal(props.startsOpen ?? false);
  return (
    <div class={classNames("border rounded", props.class)}>
      <button
        class={classNames(
          "px-8 py-5 bg-gray-50 px-5 py-3 flex w-full justify-between",
          {
            "border-b": isOpen(),
            "cursor-default": props.notCollapsible
          }
        )}
        onclick={() => !props.notCollapsible && setIsOpen((prev) => !prev)}
      >
        {props.headerText}
        <div>
          {!props.notCollapsible && isOpen() && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 15l7-7 7 7"
              />
            </svg>
          )}
          {!props.notCollapsible && !isOpen() && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          )}
        </div>
      </button>
      <div class={classNames("px-8 py-5", { hidden: !isOpen() })}>
        {props.children}
      </div>
    </div>
  );
};
