import React from "react";
import axios from "axios";

import Input from "../components/Input";
import { useState } from "react";
import { useEffect } from "react";
import {
	container,
	leftPane,
	rightPane,
	listStyle,
	listItemStyle,
} from "./Dashboard.style";

function ListItem({ img, title, subtitle, ...props }) {
	return (
		<li className={`${props.className || ""} noselect`} {...props}>
			<img src={img}></img>
			<div>
				<h5>{title}</h5>
				<h6>{subtitle}</h6>
			</div>
		</li>
	);
}

function List({ title, list }) {
	return !list.length ? (
		""
	) : (
		<div className={listStyle}>
			<h3>{title} ▾</h3>
			<ul>
				{list.map(item => (
					<ListItem
						className={listItemStyle}
						key={item._id}
						img={item.flag}
						title={item.memberName}
						subtitle={
							item.type === "PLAYER" && item.faction
								? item.faction
								: ""
						}
					/>
				))}
			</ul>
		</div>
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

	useEffect(() => {
		getAll();
	}, []);

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
			<div className={rightPane}>
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
