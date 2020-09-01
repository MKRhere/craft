import React, { useEffect, useState } from "react";
import { css } from "emotion";
import axios from "axios";
//import Button from "../components/Button";
//import Input from "../components/Input";

const defaultStatistics = {
  "minecraft:mined": {},
  "minecraft:broken": {},
  "minecraft:crafted": {},
  "minecraft:used": {},
  "minecraft:picked_up": {},
  "minecraft:dropped": {},
};
const keyMap = {
  "minecraft:mined": "Times Mined",
  "minecraft:broken": "Times Broken",
  "minecraft:crafted": "Times Crafted",
  "minecraft:used": "Times Used",
  "minecraft:picked_up": "Picked Up",
  "minecraft:dropped": "Dropped",
};
const keys = Object.keys(defaultStatistics);
//const a = keyMap["minecraft:mined"];

const img = css`
  height: 16px;
  width: 16px;
  object-fit: cover;
`;

const Div = css`
  display: flex;
  align-items: center;
  justify-content: center;
`;
const tooltip = css`
  position: relative;
  display: inline-block;
  & .tooltiptext {
    visibility: hidden;
    background: black;
    color: white;
    text-align: center;
    padding: 5px;
    position: absolute;
    z-index: 1;
    top: -15px;
  }
  &:hover .tooltiptext {
    visibility: visible;
  }
`;
let colorvalue = 0;
function Stats() {
  const [statistics, setStatistics] = useState(defaultStatistics);
  useEffect(() => {
    axios({
      method: "GET",
      url: "https://mkr.thefeathers.in/player/5f39b87881505ced8b9b8e92/stats",
    })
      .then((res) => res.data)
      .then((res) => setStatistics(res.stats))
      .catch((err) => console.log(err));
  }, []);

  //   const items = details.map((detail) => Object.keys(statistics[detail]));
  const items = [
    ...new Set(keys.flatMap((titleKey) => Object.keys(statistics[titleKey]))),
  ];
  //   console.log(items);
  //console.log(keys);
  //   console.log(keyMap);
  //   console.log(statistics);

  return (
    <div className={`${Div}`}>
      <table>
        <tbody>
          <tr>
            <th>items</th>
            {keys.map((titleKey) => (
              <th>{keyMap[titleKey]}</th>
            ))}
          </tr>
          {items.map((item) => {
            const itemName = item.split(":");
            return (
              <tr>
                <td>
                  <div className={`${tooltip}`}>
                    <img
                      src={`/assets/minecraft/${itemName[1]}.png`}
                      alt={`${itemName[1]}`}
                      className={img}
                    ></img>
                    <span className="tooltiptext">{itemName[1]}</span>
                  </div>
                </td>
                {keys.map((key, index) => {
                  if (index % 6 === 0) {
                    if (colorvalue) {
                      colorvalue--;
                    } else {
                      colorvalue++;
                    }
                  }
                  if (colorvalue) {
                    return statistics[key][item] ? (
                      <td>{statistics[key][item]}</td>
                    ) : (
                      <td>0</td>
                    );
                  } else {
                    return statistics[key][item] ? (
                      <td style={{ color: "grey" }}>{statistics[key][item]}</td>
                    ) : (
                      <td style={{ color: "grey" }}>0</td>
                    );
                  }
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Stats;
