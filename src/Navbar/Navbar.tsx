import { createSignal } from "solid-js";
import { NavLink } from "solid-app-router";
import classnames from "classnames";
import ecoIconUrl from "../assets/eco-icon.ico";

type Props = {
  routes: Array<{
    href: string;
    text: string;
    description: string;
    highlight: boolean;
  }>;
};
export default (props: Props) => {
  const [mobileMenuOpen, setMobileMenuOpen] = createSignal(false);
  return (
    <nav class="bg-gray-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <img class="h-8 w-8" src={ecoIconUrl} alt="Workflow" />
            </div>
            <div class="hidden md:block">
              <div class="ml-10 flex items-baseline space-x-4">
                {/* <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" --> */}
                {props.routes.map((route) => (
                  <NavLink
                    href={route.href}
                    end
                    class={classnames(
                      "px-3 py-2 rounded-md text-sm font-medium",
                      {
                        "bg-gray-900 text-white": route.highlight,
                        "text-gray-300 hover:bg-gray-700 hover:text-white":
                          !route.highlight,
                      }
                    )}
                    aria-current={route.highlight ? "page" : undefined}
                  >
                    {route.text}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>

          <div class="-mr-2 flex md:hidden">
            {/* <!-- Mobile menu button --> */}
            <button
              type="button"
              class="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
              onclick={() => setMobileMenuOpen((prev) => !prev)}
            >
              <span class="sr-only">Open main menu</span>
              {/* <!--
            Heroicon name: outline/menu

            Menu open: "hidden", Menu closed: "block"
          --> */}
              <svg
                class={classnames("h-6 w-6", {
                  block: !mobileMenuOpen(),
                  hidden: mobileMenuOpen(),
                })}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* <!--
            Heroicon name: outline/x

            Menu open: "block", Menu closed: "hidden"
          --> */}
              <svg
                class={classnames("h-6 w-6", {
                  block: mobileMenuOpen(),
                  hidden: !mobileMenuOpen(),
                })}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* <!-- Mobile menu, show/hide based on menu state. --> */}
      <div
        class={classnames("md:hidden", {
          block: mobileMenuOpen(),
          hidden: !mobileMenuOpen(),
        })}
        id="mobile-menu"
      >
        <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {/* <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" --> */}
          {props.routes.map((route) => (
            <NavLink
              href={route.href}
              end
              class={classnames(
                "block px-3 py-2 rounded-md text-base font-medium",
                {
                  "bg-gray-900 text-white": route.highlight,
                  "text-gray-300 hover:bg-gray-700 hover:text-white":
                    !route.highlight,
                }
              )}
              aria-current={route.highlight ? "page" : undefined}
            >
              {route.text}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};
