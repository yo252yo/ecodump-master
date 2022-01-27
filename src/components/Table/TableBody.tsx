import type { JSXElement } from "solid-js";
type Props = {
  children: JSXElement;
};

export default (props: Props) => (
  <tbody class="bg-white divide-y divide-gray-200">{props.children}</tbody>
);
