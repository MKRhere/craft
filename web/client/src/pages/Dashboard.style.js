import { css } from "emotion";

export const container = css`
	display: flex;
	width: 100%;
	min-height: 100vh;
	max-width: 1400px;
	margin: auto;
	padding-top: 5rem;

	& > * {
		padding: 0.5rem;
	}
`;

export const leftPane = css`
	flex: 8;
`;

export const rightPane = css`
	flex: 2;

	hr {
		width: 50%;
		margin: 0;
		padding: 0;
	}

	input {
		width: 100%;
	}
`;

export const listStyle = css`
	padding: 0;

	h3 {
		padding: 0;
		margin: 0.8rem 0;
		font-weight: 500;
		font-size: 1rem;
	}

	ul {
		list-style: none;
		margin: 0;
		padding: 0;
	}
`;

export const listItemStyle = css`
	margin: 1rem 0;
	padding: 0;
	display: flex;
	background: #222;
	cursor: default;
	height: 40px;
	line-height: 1.1rem;

	&:hover {
		background: #333;
	}

	div,
	h5,
	h6 {
		margin: 0;
		padding: 0;
		font-weight: 500;
	}

	div {
		width: 100%;
		padding: 2px;
	}

	h6 {
		color: #888;
	}

	img {
		padding: 0;
		height: 40px;
		margin-right: 0.5rem;
	}
`;
