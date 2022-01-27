import type { JSXElement } from "solid-js";

type Props = {
  children: JSXElement;
};

export default (props: Props) => (
  <th scope="col" class="relative px-6 py-3">
    <span class="sr-only">{props.children}</span>
  </th>
);
