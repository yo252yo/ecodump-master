import React from "react";
import PageHeader from "../../components/PageHeader";
import CurrenciesTable from "./CurrenciesTable";
import AddCurrencyModal from "./AddCurrencyModal";
import CreditsFilter from "../../components/CreditsFilter";

export default () => (
  <>
    <PageHeader
      title="Currencies"
      subTitle="Here you can list your personal saved currencies. Selected one currency and set it's prices on the other tabs."
    />
    <CreditsFilter />
    <AddCurrencyModal />
    <CurrenciesTable />
  </>
);
