import React from "react";
import SelectOptions from "./SelectOptions";

const Dropdown = props => {
  const words = [];
  for (let item of props.activites) {
    const multipleWords = [];
    const newItem = item.split("_");
    if (newItem.length > 1) {
      for (let item of newItem) {
        multipleWords.push(item[0].toUpperCase() + item.slice(1));
      }
    } else {
      multipleWords.push(item[0].toUpperCase() + item.slice(1));
    }
    words.push({ cleanWord: multipleWords.join(" "), dirtyWord: item });
  }
  const newWords = words.map(item => {
    if (item.dirtyWord === "what_to_do...") {
      return (
        <SelectOptions key={item.dirtyWord} value="" selected disabled hidden>
          {item.cleanWord}
        </SelectOptions>
      );
    }
    return (
      <SelectOptions key={item.dirtyWord} value={item.dirtyWord}>
        {item.cleanWord}
      </SelectOptions>
    );
  });

  return (
    <form>
      <select onChange={props.handleInputChange} name="typeOfActivity">
        {newWords}
      </select>
    </form>
  );
};

export default Dropdown;
