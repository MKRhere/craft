import React, { useState } from "react";
import { css } from "emotion";

import Button from "../components/Button";
import Input from "../components/Input";
import axios from "axios";
import { useEffect } from "react";

function Stats() {
const [statss,setStatss] = useState([]);

const container = css`
  
`;

const active = css`

`;

const mystyle = css`
	margin: auto;
	width: 50%;
	
  `;

const mystyle1 = css`
	
`;

const mystyle2 = css`
	color:  #aaa;
	text-indent: 50px;
	
`;

const mystyle3 = css`
color:  #aaa;
text-indent: 50px;
`;
	const callAPI = () => 
	   axios
	   .get('https://mkr.thefeathers.in/player/5f39b87881505ced8b9b8e92/stats')
	   .then(res => res.data)
			.then(res => {
				
				const stats = res.stats["minecraft:killed"]
				console.log(stats);
				const stats1 = res.stats["minecraft:killed_by"]
				console.log(stats1);
				
				//let merged = {...stats, ...stats1};
				//console.log (merged);
				const result={};

				Object.keys(stats).forEach(key => result[key] = stats[key]);
				Object.keys(stats1).forEach(key => result[key] = stats1[key]);
				console.log(result);
				const list =Object.keys(result).map((key, index) => (
					<div className={container}>
					<p className={mystyle}>
					  <div className={mystyle1}> {key}</div>
					  <div className={mystyle2}>you killed {stats[key]} {key}</div>
					  <div className={mystyle3}>{stats1[key]? key + " killed you " + stats1[key] + " times"
					  : "You have never been killed by " + key}</div>
					</p>
					</div>
				  ))
				
				setStatss(list);
			});
	  
	  useEffect(callAPI, []);
  
	
	return (
		<div className="wrapper">
			{statss}
		</div>
	);
}

export default Stats;
