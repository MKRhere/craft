import React from "react";
import { css } from "emotion";
import Button from "../components/Button";
import SkinView from "../components/SkinView";
import { navigate } from "@reach/router";
import List from "../components/List";

const skinDiv = css`
  max-width: 200px;
  height: 200px;
  border-radius: 50%;
  border: 2px solid white;
  overflow: hidden;
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

const Listvalue = css`
  color: gray;
  list-style: none;
  padding: 0;
`;
const values = css`
  color: white;
`;
function Profile() {
  const handleChange = (e) => {
    e.preventDefault();
    navigate("/stats");
  };
  return (
    <div className={`${mainDiv}`}>
      <div className={`${skinDiv}`}>
        <SkinView skin="/assets/images/skin.png" width={200} height={200} />
      </div>
      <div className={`${rightDiv}`}>
        <div>
          <Button onClick={handleChange}>Stats</Button>
          <Button>Diplomacy</Button>
        </div>
        {/* <ul className={`${Listvalue}`}>
          <li>
            Name: <span className={`${values}`}>MKRhere</span>
          </li>
          <li>
            Location:{" "}
            <a href="#" className={`${values}`}>
              {" "}
              120,64,1203
            </a>
          </li>
          <li>
            Faction: <span className={`${values}`}>Fireborn Clan</span>
          </li>
          <li>
            Days on Server: <span className={`${values}`}>300</span>
          </li>
        </ul> */}
        <List
          name="MKRhere"
          faction="Fireborn Clan"
          location={[120, 64, 1203]}
          days={300}
        />
      </div>
    </div>
  );
}

export default Profile;
