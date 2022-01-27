import { Component, createEffect } from "solid-js";
import { lazy, createMemo } from "solid-js";
import { Routes, Route, useLocation } from "solid-app-router";
import Navbar from "./Navbar/Navbar";
import PriceCalculator from "./pages/PriceCalculator";
import { MainContextProvider } from "./hooks/MainContext";
import Header from "./Header";

const Market = lazy(() => import("./pages/Market"));
const RawData = lazy(() => import("./pages/RawData"));
const Home = lazy(() => import("./pages/Home"));

const routes = {
  PriceCalculator: {
    text: "Price Calculator",
    description:
      "Allows calculation of price for products in a recipe based on all ingredients / raw materials necessary",
    href: "/",
  },
  Market: {
    text: "Ingame market",
    description: "Buy/sell orders of all stores ingame",
    href: "/market",
  },
  RawData: {
    text: "Raw data",
    description:
      "Download the raw files that this app uses for your own personal uses",
    href: "/rawData",
  },
  Home: { text: "About", description: "", href: "/about" },
  // Items: { text: "Items", description: "", href: "/items" },
  // Currencies: { text: "Currencies", description: "", href: "/currencies" },
  // Stores: { text: "Stores", description: "", href: "/stores" },
} as { [key: string]: { text: string; description: string; href: string } };

const App: Component = () => {
  const location = useLocation();

  const routesConfig = createMemo(() =>
    Object.keys(routes).map((key) => ({
      ...routes[key],
      highlight: location.pathname === routes[key].href,
    }))
  );

  const currentRoute = createMemo(() =>
    routesConfig().find((t) => t.highlight)
  );


  return (
    <MainContextProvider>
      <div class="min-h-full">
        <Navbar routes={routesConfig()} />
        <Header currentRoute={currentRoute} />
        <main class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <Routes>
            <Route path={routes.Market.href} element={<Market />} />
            <Route path={routes.RawData.href} element={<RawData />} />
            <Route path={routes.Home.href} element={<Home />} />
            <Route path="/" element={<PriceCalculator />} />
            <Route path="/*all" element={<PriceCalculator />} />
          </Routes>
        </main>
      </div>
    </MainContextProvider>
  );
};

export default App;
