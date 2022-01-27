import { createEffect } from "solid-js";
import { createStore, SetStoreFunction, Store } from "solid-js/store";
import { render } from "solid-js/web";

export function createLocalStore<T>(
  initState: T,
  storeName: string
): [Store<T>, SetStoreFunction<T>] {
  const [state, setState] = createStore(initState);
  if (localStorage[storeName]) setState(JSON.parse(localStorage[storeName]));
  createEffect(() => (localStorage[storeName] = JSON.stringify(state)));
  return [state, setState];
}
