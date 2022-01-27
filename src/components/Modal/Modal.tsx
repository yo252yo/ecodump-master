import classNames from "classnames";
import type { JSXElement } from "solid-js";

type Props = {
  children: JSXElement;
  onClose: () => void;
  class?: string;
};

export default (props: Props) => (
  <div
    class="fixed z-10 inset-0 overflow-y-auto modal-open"
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
  >
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      {/* <!--
    Background overlay, show/hide based on modal state.

    Entering: "ease-out duration-300"
      From: "opacity-0"
      To: "opacity-100"
    Leaving: "ease-in duration-200"
      From: "opacity-100"
      To: "opacity-0"
  --> */}
      <div
        class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        aria-hidden="true"
      ></div>

      {/* <!-- This element is to trick the browser into centering the modal contents. --> */}
      <span
        class="hidden sm:inline-block sm:align-middle sm:h-screen"
        aria-hidden="true"
      >
        &#8203;
      </span>
      {/* 
  <!--
    Modal panel, show/hide based on modal state.

    Entering: "ease-out duration-300"
      From: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
      To: "opacity-100 translate-y-0 sm:scale-100"
    Leaving: "ease-in duration-200"
      From: "opacity-100 translate-y-0 sm:scale-100"
      To: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
  --> */}
      <div
        class={classNames(
          "inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full md:max-w-2xl lg:max-w-4xl xl:max-w-5xl",
          {
            [props.class ?? ""]: (props.class ?? "").length > 0,
          }
        )}
      >
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 relative">
          <div class="absolute top-2 right-2 flex items-center justify-center h-8 w-8 rounded-full bg-gray-100">
            <button onClick={props.onClose}>
              {/* <!-- Heroicon name: cross solid --> */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>
          {props.children}
        </div>
      </div>
    </div>
  </div>
);
