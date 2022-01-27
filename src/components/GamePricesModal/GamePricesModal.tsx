import { createMemo, createSignal, For } from "solid-js";
import { useMainContext } from "../../hooks/MainContext";
import {
  calcTotalPages,
  filterByIncludesAny,
  paginateArray,
  getTagPersonalPriceId,
} from "../../utils/helpers";
import Table, {
  TableHeader,
  TableHeaderCol,
  TableBody,
} from "../../components/Table";
import Modal from "../Modal";
import ModalHeader from "../Modal/ModalHeader";
import Pagination from "../Pagination";
import Tooltip from "../Tooltip";
import { useCalcContext } from "../../pages/PriceCalculator/context/CalcContext";
import Button from "../Button";
const pageSize = 10;

export default () => {
  const {
    listProductsStore: {
      state,
      update: { hidePricesForProductsModal },
    },
  } = useCalcContext();

  const { allProductsInStores, mainState, update, tagsResource } =
    useMainContext();
  const [currentPage, setCurrentPage] = createSignal(1);
  const productNames = createMemo(() => {
    if (state.showPricesForProductsModal == undefined) return [];
    return state.showPricesForProductsModal.isSpecificProduct
      ? [state.showPricesForProductsModal.name]
      : tagsResource()?.[state.showPricesForProductsModal.name] ?? [];
  });
  const filteredProducts = createMemo(() =>
    allProductsInStores()
      ?.filter(
        (product) =>
          filterByIncludesAny(productNames(), [product.ItemName]) &&
          (!mainState.currency || product.CurrencyName === mainState.currency)
      )
      .sort((a, b) => {
        if (a.Buying === b.Buying) {
          return a.Price - b.Price;
        }
        return !a.Buying ? -1 : 1;
      })
  );
  const paginatedProducts = createMemo(() =>
    paginateArray(currentPage(), pageSize, filteredProducts())
  );
  const totalPages = createMemo(() =>
    calcTotalPages(pageSize, filteredProducts())
  );
  return (
    <>
      {state.showPricesForProductsModal && (
        <Modal onClose={hidePricesForProductsModal}>
          <div class="sm:flex sm:items-start">
            <div class="flex-grow mt-3 text-center sm:mt-0 sm:text-left">
              <ModalHeader>
                Ingame prices for product{productNames().length > 1 ? "s" : ""}:{" "}
                {productNames().join(", ")}
              </ModalHeader>
              <div class="mt-2">
                <Table>
                  <TableHeader>
                    <TableHeaderCol>Product Name</TableHeaderCol>
                    <TableHeaderCol>Store Name</TableHeaderCol>
                    <TableHeaderCol>Store Owner</TableHeaderCol>
                    <TableHeaderCol>Quantity</TableHeaderCol>
                    <TableHeaderCol>Price</TableHeaderCol>
                  </TableHeader>
                  <TableBody>
                    <For each={paginatedProducts()}>
                      {(product) => (
                        <tr>
                          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product.ItemName}
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product.StoreName}
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product.StoreOwner}
                          </td>

                          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                            {product.Buying
                              ? `Buying ${product.Limit} for`
                              : `Selling ${product.MaxNumWanted} for`}
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <Tooltip noStyle text="Click to set your personal price">
                              <Button
                                onClick={() => {
                                  //Updates both personal price for this product as well as tag price if !isSpecificProduct
                                  update.personalPrice(
                                    product.ItemName,
                                    product.CurrencyName,
                                    product.Price
                                  );
                                  if (
                                    state.showPricesForProductsModal !=
                                      undefined &&
                                    !state.showPricesForProductsModal
                                      .isSpecificProduct
                                  ) {
                                    update.personalPrice(
                                      getTagPersonalPriceId(
                                        state.showPricesForProductsModal.name
                                      ),
                                      product.CurrencyName,
                                      product.Price
                                    );
                                  }
                                }}
                              >
                                {`${product.Price} ${product.CurrencyName}`}
                              </Button>
                            </Tooltip>
                          </td>
                        </tr>
                      )}
                    </For>
                  </TableBody>
                </Table>
                <Pagination
                  currentPage={currentPage()}
                  totalPages={totalPages()}
                  onChange={setCurrentPage}
                />
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};
