import * as React from 'react';
import * as API from "../api";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import "./App.sass"
import Hours from './hours/Hours';
import SignIn from './signin/SignIn';
import Navbar from './ui/Navbar';
import Categories from './categories/Categories';

// FIXME: should have default value
//@ts-expect-error see https://github.com/DefinitelyTyped/DefinitelyTyped/pull/24509#issuecomment-382213106
export const UserData = React.createContext<userData>();

interface userData {
	user: API.RocketryAdminAPI_user
	refreshUser(): void
}

async function getUser(setIsLoading: React.Dispatch<React.SetStateAction<boolean>>, setUser: React.Dispatch<React.SetStateAction<null | API.RocketryAdminAPI_user>>) {
	try {
		const contextData = await API.GET<API.RocketryAdminAPI_user>("auth/me");
		setUser(contextData);
	} catch {
		// ignore this
	} finally {
		setIsLoading(false);
	}
}



export default function App(): JSX.Element {
	const [isLoading, setIsLoading] = React.useState(true);
	const [user, setUser] = React.useState(null as null | API.RocketryAdminAPI_user);

	const reload = () => setIsLoading(true);

	if (isLoading) {
		getUser(setIsLoading, setUser);
		return <p>Loading...</p>;
	}

	if (!user) {
		return <SignIn />
	}

	return <UserData.Provider value={{
		user: user, refreshUser: () => {
			setUser(null);
			setIsLoading(true);
			getUser(setIsLoading, setUser);
		}
	}}>
		<Router>
			<Navbar />
			<Switch>
				<Route exact path="/">
					<Hours />
				</Route>
				<Route exact path="/categories">
					<Categories />
				</Route>
			</Switch>
		</Router>
	</UserData.Provider>
}