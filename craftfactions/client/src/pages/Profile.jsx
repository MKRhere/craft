import React from "react";
import { css } from "emotion";
import Button from "../components/Button";
import SkinView from "../components/SkinView";
import { navigate } from "@reach/router";

const values = css`
  color: #fff;
`;

const listprop = css`
  color: #aaa;
  margin-top: 20px;

  & p {
    margin: 0;
  }
`;

const link = css`
  color: #fff;
`;

function Value(props) {
  return <span className={values}>{props.children}</span>;
}

function ProfileDetails(props) {
  return (
    <div className={listprop}>
      <p>
        Name: <Value>{props.name}</Value>
      </p>
      <p>
        Location:{" "}
        <Value>
          <a className={link} href="#">
            {props.location.join(", ")}
          </a>
        </Value>
      </p>
      <p>
        Faction: <Value>{props.faction}</Value>
      </p>
      <p>
        Days on Server: <span className={values}>{props.days}</span>
      </p>
    </div>
  );
}

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
        <ProfileDetails
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
