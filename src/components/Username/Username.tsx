import { useMainContext } from "../../hooks/MainContext";

export default () => {
  const { mainState, update } = useMainContext();
  return (
      <input
        class="rounded-md border border-gray-300 h-8 px-2 rounded-md text-sm font-small focus:outline-none text-black"
        type="search"
        placeholder="User name"
        value={mainState.userName}
        onChange={(ev) => update.userName(ev.currentTarget.value)}
      />
  );
};
