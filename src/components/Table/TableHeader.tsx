import type { JSXElement } from "solid-js";
type Props = {
  children: JSXElement;
};

export default (props: Props) => (
  <thead class="bg-gray-50">
    <tr>{props.children}</tr>
  </thead>
);
