import React from "react";
import { Router } from "@reach/router";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
	const loggedIn = true;

	return (
		<Router>
			{!loggedIn ? <Login path="/" /> : <Dashboard path="/" />}
		</Router>
	);
}

export default App;
