import { createMemo } from "solid-js";
import { useMainContext } from "../../hooks/MainContext";
import Dropdown from "../Dropdown";

type Props = {
  tagName: string;
  selectedProduct?: string;
  onSelectProduct: (prod: string) => void;
};

export default (props: Props) => {
  const { tagsResource } = useMainContext();
  const tagValues = createMemo(
    () =>
      tagsResource()?.[props.tagName]?.map((prodName) => ({
        value: prodName,
        text: prodName,
      })) ?? []
  );
  return (
    <Dropdown
      value={props.selectedProduct ?? ""}
      values={[
        { text: `Select item in tag ${props.tagName}`, value: "" },
        ...tagValues(),
      ]}
      onChange={(newValue) => props.onSelectProduct(`${newValue}`)}
    />
  );
};
