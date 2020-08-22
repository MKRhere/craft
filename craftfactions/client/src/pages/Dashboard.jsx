import React from "react";
import { css } from "emotion";
import axios from "axios";

import Input from "../components/Input";
import { useState } from "react";
import { useEffect } from "react";

const container = css`
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

const leftPane = css`
	flex: 8;
`;

const rightPane = css`
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

const listStyle = css`
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

		& li {
			margin: 1rem 0;
			padding: 0;
			display: flex;
			background: #222;
			cursor: default;

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
		}
	}
`;

function List({ title, list }) {
	return list.length ? (
		<div className={listStyle}>
			<h3>{title} ▾</h3>
			<ul>
				{list.map(item => (
					<li key={item._id}>
						<img src={item.flag}></img>
						<div>
							<h5>{item.memberName}</h5>
							{item.type === "PLAYER" && item.faction && (
								<h6>{item.faction}</h6>
							)}
						</div>
					</li>
				))}
			</ul>
		</div>
	) : (
		""
	);
}

function Dashboard() {
	const [all, setAll] = useState([]);
	const [factions, setFactions] = useState([]);
	const [players, setPlayers] = useState([]);

	const getAll = () =>
		axios
			.get(process.env.REACT_APP_API_ROOT + "/member")
			.then(res => res.data)
			.then(list => {
				const everyone = list.map(x => ({
					...x,
					faction:
						x.type === "PLAYER" &&
						x.faction &&
						list.find(y => y._id === x.faction).memberName,
				}));
				setAll(everyone);
				setFactions(everyone.filter(x => x.type === "FACTION"));
				setPlayers(everyone.filter(x => x.type === "PLAYER"));
			});

	useEffect(getAll, []);

	const doSearch = e => {
		let search = e.target.value;

		if (!search) getAll();
		else search = search.toLowerCase();

		setFactions(
			all.filter(
				x =>
					x.type === "FACTION" &&
					x.memberName.toLowerCase().includes(search),
			),
		);
		setPlayers(
			all.filter(
				x =>
					x.type === "PLAYER" &&
					(x.memberName.toLowerCase().includes(search) ||
						(x.faction &&
							x.faction.toLowerCase().includes(search))),
			),
		);
	};

	return (
		<main className={container}>
			<div className={leftPane}>x</div>
			<div className={`${rightPane} noselect`}>
				<Input
					type="text"
					placeholder="Search"
					spellCheck={false}
					onChange={doSearch}
				/>
				<List title="Factions" list={factions} />
				{factions.length && players.length ? <hr /> : ""}
				<List title="Players" list={players} />
			</div>
		</main>
	);
}

export default Dashboard;
