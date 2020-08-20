import React, { useState } from "react";
import { css } from "emotion";

import Button from "../components/Button";
import Input from "../components/Input";
import Axios from "axios";

function Stats() {
const [statss,setStatss] = useState([]);

	const callAPI = () => 
	   axios
	   .get('https://mkr.thefeathers.in/player/5f39b87881505ced8b9b8e92/stats')
	   .then(res => res.data)
			.then(res => {
				const stats = res.stats["minecraft:custom"]
				Object.keys(stats).forEach(function(key) {
					console.table('Key : ' + key + ', Value : ' + stats[key])
				  })

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
