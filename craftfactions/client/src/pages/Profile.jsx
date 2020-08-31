import React from "react";
import { css } from "emotion";
import Button from "../components/Button";

const img = css`
  width: 200px;
  border-radius: 50%;
  border: 2px solid white;
`;
const mainDiv = css`
  display: flex;
  flex-flow: row wrap;
  width: 80%;
  margin: 10%;
  min-height: 500px;
`;
const rightDiv = css`
  margin-left: 20%;
  min-width: 400px;
  min-height: 400px;
`;

const List = css`
  color: gray;
  list-style: none;
  /* margin: 0; */
  padding: 0;
`;

function Profile() {
  const handleChange = (e) => e.preventDefault();
  return (
    <div className={`${mainDiv}`}>
      <div>
        <img src="#" className={`${img}`}></img>
      </div>
      <div className={`${rightDiv}`}>
        <div>
          <Button onClick={handleChange}>Stats</Button>
          <Button>Diplomacy</Button>
        </div>
        <ul className={`${List}`}>
          <li>Name: </li>
          <li>Location: </li>
          <li>Faction: </li>
          <li>Days on Server: </li>
        </ul>
      </div>
    </div>
  );
}

export default Profile;
