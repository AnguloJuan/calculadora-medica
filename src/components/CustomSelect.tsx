import Select, { Props } from "react-select";

export const ReactSelect = ({
  value,
  options,
  ...props
}: Props) => {
  return (
    <Select
      value={value}
      options={options}
      {...props}
    />
  );
};