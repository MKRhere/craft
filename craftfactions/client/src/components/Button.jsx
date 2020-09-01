import React from "react";
import { css } from "emotion";

const btn = css`
  background: gray;
  padding: 8px 12px;
  color: #fff;
  font: inherit;
  border: 2px outset #aaa;
  outline: 1px solid #000;
  text-shadow: 1px 1px 1px #111;
  margin-right: 3px;
  &:focus {
    outline: 2px solid #fff;
  }

  &:hover {
    outline: 2px solid #fff;
  }
`;

function Button(props) {
  return (
    <button {...props} className={`${btn} ${props.className}`}>
      {props.children}
    </button>
  );
}

export default Button;
