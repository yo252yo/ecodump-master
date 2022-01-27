import React from "react";
import PageHeader from "../../components/PageHeader";
import AllItemsTable from "./AllItemsTable";
import NameFilter from "../../components/NameFilter";
import ProfessionFilter from "../../components/ProfessionFilter";
import CraftingStationFilter from "../../components/CraftingStationFilter";
import RecipeFilter from "../../components/RecipeFilter";

export default () => (
  <>
    <PageHeader
      title="All items"
      subTitle="Here you can find all the items and their recipes"
    />
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.2rem",
      }}
    >
      <NameFilter />
      <RecipeFilter />
      <ProfessionFilter />
      <CraftingStationFilter />
    </div>
    {/* <div>
        <ModuleSelect
          value={upgrades.bu}
          setValue={(bu: number) => setUpgrades((prev) => ({ ...prev, bu }))}
          moduleName="Basic module"
        />
        &nbsp;
        <ModuleSelect
          value={upgrades.au}
          setValue={(au: number) => setUpgrades((prev) => ({ ...prev, au }))}
          moduleName="Advanced module"
        />
        &nbsp;
        <ModuleSelect
          value={upgrades.mu}
          setValue={(mu: number) => setUpgrades((prev) => ({ ...prev, mu }))}
          moduleName="Modern module"
        />
      </div> */}
    <AllItemsTable />
  </>
);
