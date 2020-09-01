import React from "react";
import { css } from "emotion";

const values = css`
  color: white;
`;
const listprop = css`
  color: gray;
  list-style: none;
  padding: 0;
`;
function List(props) {
  return (
    <ul className={`${listprop}`}>
      <li>
        Name: <span className={`${values}`}>{props.name}</span>
      </li>
      <li>
        Location:{" "}
        <a href="#" className={`${values}`}>
          {" "}
          {props.location}
        </a>
      </li>
      <li>
        Faction: <span className={`${values}`}>{props.faction}</span>
      </li>
      <li>
        Days on Server: <span className={`${values}`}>{props.days}</span>
      </li>
    </ul>
  );
}

export default List;
