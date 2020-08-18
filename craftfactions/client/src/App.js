import React, { useState } from "react";
import { Router } from "@reach/router";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
	const [loggedIn, setLoggedIn] = useState(false);

	return (
		<Router>
			{!loggedIn ? (
				<Login path="/" login={() => setLoggedIn(true)} />
			) : (
				<Dashboard path="/" />
			)}
		</Router>
	);
}

export default App;
