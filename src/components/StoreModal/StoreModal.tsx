import { createMemo, For } from "solid-js";
import { useMainContext } from "../../hooks/MainContext";
import Modal from "../Modal";
import ModalHeader from "../Modal/ModalHeader";
import Table, { TableBody, TableHeader, TableHeaderCol } from "../Table";

type Props = {
    storeName?: string;
    hideModal: () => void;
}
export default (props: Props) => {
    const {
      allProductsInStores,
    } = useMainContext();
    const allProductsInStore = createMemo(() => allProductsInStores()?.filter(t => t.StoreName === props.storeName));
    const allProductsForSaleInStore = createMemo(() => allProductsInStore()?.filter(t => !t.Buying));
    const allProductsForBuyInStore = createMemo(() => allProductsInStore()?.filter(t => t.Buying));
    return (
        <>
            {props.storeName &&
                <Modal onClose={props.hideModal}>
                <div class="sm:flex sm:items-start">
                    <div class="flex-grow mt-3 text-center sm:mt-0 sm:text-left">
                        <ModalHeader>
                            Ingame orders for store {props.storeName}
                        </ModalHeader>
                        <div class="mt-2 flex lg:flex-row gap-2 sm:flex-col">
                            <Table>
                                <TableHeader>
                                    <TableHeaderCol>Selling</TableHeaderCol>
                                    <TableHeaderCol>Price</TableHeaderCol>
                                    <TableHeaderCol>Quantity</TableHeaderCol>
                                </TableHeader>
                                <TableBody>
                                    <For each={allProductsForSaleInStore()}>
                                    {(product) => (
                                        <tr>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {product.ItemName}
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {product.Price}
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                                                {product.MaxNumWanted}
                                            </td>
                                        </tr>
                                    )}
                                    </For>
                                </TableBody>
                            </Table>
                            <Table>
                                <TableHeader>
                                    <TableHeaderCol>Purchasing</TableHeaderCol>
                                    <TableHeaderCol>Price</TableHeaderCol>
                                    <TableHeaderCol>Max wanted</TableHeaderCol>
                                </TableHeader>
                                <TableBody>
                                    <For each={allProductsForBuyInStore()}>
                                    {(product) => (
                                        <tr>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {product.ItemName}
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {product.Price}
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                                                {product.Limit}
                                            </td>
                                        </tr>
                                    )}
                                    </For>
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
                </Modal>
            }
        </>
    )
}