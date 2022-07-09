import React, { useState } from "react";

import "./RadioGroup.css";

const RadioGroup = ({ items, onChangevalue = (e) => {} }) => {
  const [active, setActive] = useState(1);
  const [custom, setCustom] = useState({
    isActive: false,
    value: 0,
  });

  const handleChange = (id, value) => {
    onChangevalue(value);
    setActive(id);

    // reset input field
    setCustom({
      isActive: false,
      value: 0,
    });
  };

  const customPagehandle = (value) => {
    setCustom({
      ...custom,
      value: value,
    });
  };

  const onInputFoucOut = () => {
    setCustom({
      ...custom,
      isActive: custom.value > 0 && true,
    });

    onChangevalue(custom.value);
  };

  return (
    <>
      {items.map((item) => (
        <span
          className={`${
            item.id === active && !custom.isActive ? "_active" : ""
          } ${
            item.type === "text" && "page_input"
          } custom__radio d-flex justify-content-center align-items-center flex-grow-1`}
          key={item.id}
          onClick={(e) =>
            item.type === "check" && handleChange(item.id, item.value)
          }
        >
          {item.type !== "check" ? (
            <input
              type={item.type}
              className={`${custom.value !== 0 && "act"} custom_page_input text-center`}
              placeholder="Custom"
              value={custom.value !== 0 ? custom.value : ""}
              onChange={(e) => customPagehandle(e.target.value)}
              onBlur={(e) => onInputFoucOut()}
            />
          ) : (
            item.value
          )}
        </span>
      ))}
    </>
  );
};

export default RadioGroup;
