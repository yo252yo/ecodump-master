import React from "react";
import Home from "./pages/Home";
import JsonViewer from "./pages/JsonViewer";
import AllItems from "./pages/AllItems";
import Currencies from "./pages/Currencies";
import Stores from "./pages/Stores";
import { Menu } from "antd";
import { ReactQueryDevtools } from "react-query/devtools";
import { QueryClient, QueryClientProvider } from "react-query";
import {
  HomeOutlined,
  FileOutlined,
  TableOutlined,
  EuroCircleOutlined,
  BankOutlined,
} from "@ant-design/icons";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { AppProvider } from "./AppContext";

import "./App.css";

const routes = {
  JsonViewer: "/jsonViewer",
  Recipes: "/recipes",
  Items: "/items",
  Currencies: "/currencies",
  Stores: "/stores",
  Home: "/",
};

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <Router>
          <Menu mode="horizontal" theme="dark">
            <Menu.Item key="home" icon={<HomeOutlined />}>
              <Link to={routes.Home}>Home</Link>
            </Menu.Item>
            <Menu.Item key="jsonViewer" icon={<FileOutlined />}>
              <Link to={routes.JsonViewer}>Json viewer</Link>
            </Menu.Item>
            <Menu.Item key="Items" icon={<TableOutlined />}>
              <Link to={routes.Items}>All items</Link>
            </Menu.Item>
            <Menu.Item key="Currencies" icon={<EuroCircleOutlined />}>
              <Link to={routes.Currencies}>Currencies</Link>
            </Menu.Item>
            <Menu.Item key="Stores" icon={<BankOutlined />}>
              <Link to={routes.Stores}>Stores</Link>
            </Menu.Item>
          </Menu>
          <Switch>
            <AppProvider>
              <Route path={routes.JsonViewer}>
                <JsonViewer />
              </Route>
              <Route path={routes.Items}>
                <AllItems />
              </Route>
              <Route path={routes.Currencies}>
                <Currencies />
              </Route>
              <Route path={routes.Stores}>
                <Stores />
              </Route>
              <Route exact path="/">
                <Home />
              </Route>
            </AppProvider>
          </Switch>
        </Router>
      </div>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
