import React from "react";

const SelectOptions = props => {
  return <option value={props.value}>{props.children}</option>;
};

export default SelectOptions;
