import Table, {
  TableHeader,
  TableHeaderCol,
  TableBody,
} from "../../components/Table";
import { Accessor, For } from "solid-js";
import Tooltip from "../../components/Tooltip";
import Button from "../../components/Button";

type Props = {
  stores: Accessor<Stores[]>;
  setSearch: (search: string) => void;
  setCurrencyFilter: (currency: string) => void;
  setShowStoreModal: (storeName: string) => void;
};
export default (props: Props) => (
  <Table>
    <TableHeader>
      <TableHeaderCol>Store Name</TableHeaderCol>
      <TableHeaderCol>Store Owner</TableHeaderCol>
      <TableHeaderCol>Currency</TableHeaderCol>
      <TableHeaderCol>Balance</TableHeaderCol>
      <TableHeaderCol>Offers</TableHeaderCol>
    </TableHeader>
    <TableBody>
      <For each={props.stores()}>
        {(store) => (
          <tr>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <Tooltip noStyle text="Click to show store orders">
                <Button
                  onClick={() => props.setShowStoreModal(store.Name)}
                >
                  {store.Name}
                </Button>
              </Tooltip>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <Tooltip noStyle text="Click to filter by store owner">
                <Button
                  onClick={() => props.setSearch(store.Owner)}
                >
                  {store.Owner}
                </Button>
              </Tooltip>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <Tooltip noStyle text="Click to select this currency">
                <Button
                  onClick={() => props.setCurrencyFilter(store.CurrencyName)}
                >
                  {store.CurrencyName}
                </Button>
              </Tooltip>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {store.Balance}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {store.AllOffers.length}
            </td>
          </tr>
        )}
      </For>
    </TableBody>
  </Table>
);
