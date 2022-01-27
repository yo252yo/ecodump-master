import { Accessor, createEffect, createSignal } from "solid-js";

export default (handler: () => void, mounted: Accessor<boolean>) => {
  const [isClicked, setIsClicked] = createSignal(false);

  const handleEvent = () => {
    if (isClicked()) {
      setIsClicked(false);
      return;
    }

    handler();
  };

  createEffect(() => {
    if (mounted()) {
      document.addEventListener("click", handleEvent);
      window.addEventListener("blur", handleEvent);
    } else {
      document.removeEventListener("click", handleEvent);
      window.removeEventListener("blur", handleEvent);
    }
  });

  return { onClickCapture: () => setIsClicked(true) };
};
