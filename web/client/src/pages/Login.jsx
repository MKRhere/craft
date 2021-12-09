import React from "react";
import { css } from "emotion";

import Button from "../components/Button";
import Input from "../components/Input";

const container = css`
	display: flex;
	flex-direction: column;
	min-height: 100vh;
	width: 40%;
	margin: auto;
	align-items: center;
	justify-content: center;

	& * {
		margin: 10px auto;
		width: 100%;
		max-width: 400px;
	}

	@media screen and (max-width: 720px) {
		width: 80%;
	}
`;

const img = css`
	margin-bottom: 4rem;
`;

function Login({ login }) {
	const handleSubmit = e => (e.preventDefault(), login());

	return (
		<form className={container}>
			<img className={img} src="/assets/images/logo.png"></img>
			<Input
				type="text"
				placeholder="Enter username"
				spellCheck={false}></Input>
			<Button onClick={handleSubmit}>Login</Button>
		</form>
	);
}

export default Login;
