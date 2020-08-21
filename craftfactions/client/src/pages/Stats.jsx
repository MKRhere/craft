import React, { useState } from "react";
import { css } from "emotion";

import Button from "../components/Button";
import Input from "../components/Input";
import axios from "axios";
import { useEffect } from "react";

function Stats() {
const [statss,setStatss] = useState([]);

const mystyle = {
	margin: "auto",
	width: "50%",
	display: "flex"
  };

const mystyle1 = {
	flex: "1",
};

const mystyle2 = {
	textAlign: "right"	
};
	const callAPI = () => 
	   axios
	   .get('https://mkr.thefeathers.in/player/5f39b87881505ced8b9b8e92/stats')
	   .then(res => res.data)
			.then(res => {
				console.log(res);
				const stats = res.stats["minecraft:custom"];
				console.log(stats);
				const list =Object.keys(stats).map((key, i) => (
					<p key={i} style={mystyle}>
					  <div style={mystyle1}> {key}</div>
					  <div style={mystyle2}> {stats[key]}</div>
					</p>
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
