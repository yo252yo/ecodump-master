import type { JSXElement } from "solid-js";

type Props = {
  children: JSXElement;
};

export default (props: Props) => (
  <th
    scope="col"
    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
  >
    {props.children}
  </th>
);
