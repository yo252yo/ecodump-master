import Table, {
  TableHeader,
  TableHeaderCol,
  TableBody,
} from "../../components/Table";
import { Accessor, For } from "solid-js";
import Tooltip from "../../components/Tooltip";
import Button from "../../components/Button";
import Highlight from "../../components/Highlight";

type Props = {
  products: Accessor<ProductOffer[] | undefined>;
  setSearch: (search: string) => void;
  setCurrencyFilter: (currency: string) => void;
  setShowStoreModal: (storeName: string) => void;
};
export default (props: Props) => (
  <Table>
    <TableHeader>
      <TableHeaderCol>Product Name</TableHeaderCol>
      <TableHeaderCol>Store Name</TableHeaderCol>
      <TableHeaderCol>Store Owner</TableHeaderCol>
      <TableHeaderCol>Quantity</TableHeaderCol>
      <TableHeaderCol>Price</TableHeaderCol>
    </TableHeader>
    <TableBody>
      <For each={props.products()}>
        {(product) => (
          <tr>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <Tooltip noStyle text="Click to filter by product name">
                <Button
                  onClick={() => props.setSearch(product.ItemName)}
                >
                  {product.ItemName}
                </Button>
              </Tooltip>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <Tooltip noStyle text="Click to show store orders">
                <Button
                  onClick={() => props.setShowStoreModal(product.StoreName)}
                >
                  {product.StoreName}
                </Button>
              </Tooltip>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <Tooltip noStyle text="Click to filter by store owner">
                <Button
                  onClick={() => props.setSearch(product.StoreOwner)}
                >
                  {product.StoreOwner}
                </Button>
              </Tooltip>
            </td>

            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
              {product.Buying
                ? <>Buying <Highlight text={`${product.Limit}`} /> for</>
                : <>Selling <Highlight text={`${product.MaxNumWanted}`} /> for</>}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <Highlight text={`${product.Price}`} />
              &nbsp;
              {product.CurrencyName}
            </td>
          </tr>
        )}
      </For>
    </TableBody>
  </Table>
);
