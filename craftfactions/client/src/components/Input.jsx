import React from "react";
import { css } from "emotion";

const input = css`
	background: #111;
	padding: 8px 12px;
	color: #fff;
	border: none;
	font: inherit;
	outline: 2px solid #aaa;
	text-align: center;

	&:focus {
		outline: 2px solid #fff;
	}

	&:hover {
		outline: 2px solid #fff;
	}
`;

function Input(props) {
	return (
		<input {...props} className={`${input} ${props.className}`}>
			{props.children}
		</input>
	);
}

export default Input;
