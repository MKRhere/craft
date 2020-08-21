import React, { useState } from "react";
import { css } from "emotion";

import Button from "../components/Button";
import Input from "../components/Input";
import axios from "axios";
import { useEffect } from "react";

function Stats() {
const [statss,setStatss] = useState([]);

	const callAPI = () => 
	   axios
	   .get('https://mkr.thefeathers.in/player/5f39b87881505ced8b9b8e92/stats')
	   .then(res => res.data)
			.then(res => {
				const stats = res.stats["minecraft:custom"];
				
				//const listItems = stats.map((key) => <li key={key}>{stats[key]}</li>);
				{stats.map((key, i) => (
					<p key={i}>
					  <span>Key Name: {key}</span>
					  <span>Value: {stats[key]}</span>
					</p>
					  
				  ))}
				setStatss(stats);
			});
	  
	  useEffect(callAPI, []);
  
	
	return (
		<div className="wrapper">
			{statss}
		</div>
	);
}

export default Stats;
