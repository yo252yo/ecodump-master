import classNames from "classnames";

type Props = {
    text?: string;
    class?: string;
};
export default (props: Props) => (
    props.text && <span class={classNames("font-semibold", {[props.class??""]: !!props.class})}>
        {props.text}
    </span>
);