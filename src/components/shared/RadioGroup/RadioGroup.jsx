import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

import "./RadioGroup.css";

let previousValue;

const RadioGroup = ({ items, onChangevalue = (e) => {}, value }) => {
  const [active, setActive] = useState("Last");
  const [inputValue, setInputvalue] = useState("");

  useEffect(() => {
    const itemIs =
      value === "First"
        ? "First"
        : value === "Last"
        ? "Last"
        : value === "All"
        ? "All"
        : "custom";
    setActive(itemIs);
    itemIs === "custom" && setInputvalue(value);
  }, [value]);

  const valueSave = (itemType, elValue) => {
    console.log({itemType, elValue});
    switch (itemType) {
      case "check":
        previousValue = elValue;
        setActive(elValue);
        inputValue !== "" && setInputvalue("");

        // Saving data to the database
        onChangevalue(elValue);
        break;
      case "custom":
        previousValue = active;
        elValue <= 0 || elValue === ""
          ? setActive(previousValue)
          : setActive(itemType);

        // Saving data to the database
        onChangevalue(elValue);
        break;

      default:
        break;
    }
  };

  return (
    <>
      {items.map((item) =>
        item.type === "check" ? (
          <span
            className={`${
              active === item.value ? "radio_active" : ""
            } check_box d-flex w-100 justify-content-center align-items-center rounded`}
            key={item.value}
            onClick={() => valueSave(item.type, item.value)}
          >
            {item.value}
          </span>
        ) : (
          item.type === "text" && (
            <input
              className={`${
                active === "custom" ? "radio_active" : ""
              } input_radio text-center rounded`}
              placeholder="Custome"
              key={item.type}
              type="text"
              value={inputValue}
              onChange={(e) => {
                const inputVal = e.target.value;
                !isNaN(inputVal) && setInputvalue(inputVal); // Character is not allowed
              }}
              onBlur={(e) => {
                const target = e.target;
                !+target.value <= 0 // ZERO and EMPTY is not allowed
                  ? valueSave(item.value, +target.value)
                  : toast.error("[ ZERO or EMPTY ] not allowed.");
              }}
            />
          )
        )
      )}
    </>
  );
};

export default RadioGroup;
