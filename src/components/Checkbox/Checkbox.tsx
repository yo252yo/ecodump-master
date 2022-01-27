import classNames from "classnames";

type Props = {
  fieldId?: string;
  label: string;
  checked: boolean;
  onChange: (isChecked: boolean) => void;
  class?: string;
  left?: boolean;
};

export default (props: Props) => {
  const fieldId = props.fieldId ?? props.label.replaceAll(" ", "_");
  return (
    <div
      class={classNames(
        "flex items-start",
        {
          "flex-row": !props.left,
          "flex-row-reverse": props.left,
        },
        props.class
      )}
    >
      <div class="flex items-center h-5">
        <input
          id={fieldId}
          aria-describedby={fieldId}
          type="checkbox"
          class="bg-gray-50 border border-gray-300 focus:ring-3 focus:ring-blue-300 h-4 w-4 rounded cursor-pointer"
          onChange={(ev) => props.onChange(ev.currentTarget.checked)}
          checked={props.checked}
        />
      </div>
      <div class="text-sm px-2">
        <label
          for={fieldId}
          class="font-medium text-gray-900 select-none cursor-pointer"
        >
          {props.label}
        </label>
      </div>
    </div>
  );
};
