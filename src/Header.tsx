import { createEffect } from "solid-js";
import Username from "./components/Username";
import Dropdown from "./components/Dropdown";
import { useMainContext } from "./hooks/MainContext";

type Props = {
    currentRoute: () => {text: string, description: string} | undefined;
};
export default (props: Props) => {
    const { mainState, update, allCurrencies } = useMainContext();
    return (
        <header class="bg-white shadow relative">
            <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div>
                    <h1 class="text-3xl font-bold text-gray-900">
                    {props.currentRoute()?.text}
                    </h1>
                    <span>{props.currentRoute()?.description}</span>
                </div>
                <div class="flex pt-3 gap-2">
                    <Username />
                    <Dropdown
                    value={mainState.currency}
                    values={[
                        { value: "", text: "Select a currency" },
                        ...(allCurrencies()?.map((name) => ({
                        value: name,
                        text: name,
                        })) ?? []),
                    ]}
                    onChange={(newValue) => update.currency(`${newValue}`)}
                    origin="SE"
                    direction="SW"
                    />
                </div>
            </div>
        </header>
    );
}