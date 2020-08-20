import React from "react";
import { css } from "emotion";

import Button from "../components/Button";
import Input from "../components/Input";
import Axios from "axios";

function Stats() {

	const callAPI = () => 
	   axios
	   .get('https://mkr.thefeathers.in/player/5f39b87881505ced8b9b8e92/stats')
	   .then(res => {
        const statss = res.stats["minecraft:custom"]
        
      })
  
	
	return (
		<div className="wrapper">
			{callAPI()}
		</div>
	);
}

export default Stats;
