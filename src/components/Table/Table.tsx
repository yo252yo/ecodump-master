import type { JSXElement } from "solid-js";

type Props = {
  children: JSXElement;
};

export default (props: Props) => (
  <div class="flex flex-col flex-grow">
    <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
        <div class="shadow overflow-hidden border border-gray-200 sm:rounded-lg">
          <table class="min-w-full divide-y divide-gray-200">
            {props.children}
          </table>
        </div>
      </div>
    </div>
  </div>
);
