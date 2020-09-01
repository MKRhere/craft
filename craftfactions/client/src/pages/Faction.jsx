import React, { useRef, useEffect } from "react";
import { css } from "emotion";
import { useState } from 'react';

const wrapper = css`
display: flex;
`;

const Flag = css`
flex:1;
`;

const Faction_details = css`

`;

const Faction_name = css`

`;

const Faction_members = css`

`;

const Faction_text = css`

`;

function Faction(){
   
   
    return(
        <div className = {wrapper}>
        <div className={Flag}>
            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAoCAYAAAD+MdrbAAABVUlEQVRIicWWQXLDIAxFcxizCmt74el1A8yUo3jfGxhu4GxKF7U8iioJ4iHNQuPMRDzrS/Dx5fvro/SMy8uAKU4lxank/QmxLfORfF/mh/9wsEBvh3K7Dg9PnJz3HIjb9TdEoENJAMwMMFjzHBCSgzV9KgzWsJJTnI7qqsCMeqgBvR2Ks3Kf/wzF7dEKVCWDlC5A3HA8ZQ0Iv7sCqxXCQGARBTrU5y5AfwaIF5wGJtJDaDY2h22ZS0aym4H0yNGAXlaBkJQVGCefBW7I67BMKaT81zl2d2B3yXgo2oS5XZFrU65BaW4TkNvYcOvhjR2saQdytx49mirQvwNIzUEFwtslYDpTITg1LJIkw3VKjUQFan4IQNEc6CXOJdOd0Ax0QnJGwGDNIV8FYpgExEqcdlJ8RQ6V/FSFnL1joKsB18/xmHCXoaxxrH4Sb8In8RrHf3DsXvEDJHc7yyzB7JgAAAAASUVORK5CYII="
            ></img>
        </div>
        <div className={Faction_details}>
           <div className={Faction_name}> Fireborn Clan </div>
           <div className={Faction_members}>
           <svg height="100" width="100">
  <circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" />
</svg>
<svg height="100" width="100">
  <circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" />
</svg>
<svg height="100" width="100">
  <circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" />
</svg>
           </div>
           <div className={Faction_text}>* Fireborn Clan declared war on EmeraldBlood
             * Fireborn Clan entered a peace treaty with SitiSchu </div>
        </div>
        </div>
    );
}

export default Faction;
