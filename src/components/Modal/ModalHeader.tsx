import type { JSXElement } from "solid-js";

type Props = {
  children: JSXElement;
};
export default (props: Props) => (
  <h3 class="text-lg leading-6 font-medium text-gray-900 md-2" id="modal-title">
    {props.children}
  </h3>
);
