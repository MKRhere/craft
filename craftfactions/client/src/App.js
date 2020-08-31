import React, { useState } from "react";
import { Router } from "@reach/router";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Stats from "./pages/Stats";
import Profile from "./pages/Profile"

function App() {
	const [loggedIn, setLoggedIn] = useState(false);

	return (
		<Router>
			{!loggedIn ? (
				<Login path="/" login={() => setLoggedIn(true)} />
			) : (
					<Dashboard path="/" />
				)}
			<Stats path="/stats" />
			<Profile path='/profile' />
		</Router>
	);
}

export default App;
