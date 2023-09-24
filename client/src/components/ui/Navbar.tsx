import { faRocket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import { Link } from 'react-router-dom';
import * as api from '../../api'
import App, { UserData } from '../App';

export default function Navbar(): JSX.Element {
	const userData = React.useContext(UserData)

	const [loggingOut, setLoggingOut] = React.useState(false)
	const [navbarExpanded, setExpanded] = React.useState(false)

	const logOut = async () => {
		setLoggingOut(true);
		await api.POST("auth/logout", {});
		userData.refreshUser();
	};

	return <nav className="navbar is-primary" role="navigation" aria-label="main navigation">
		<div className="navbar-brand">
			<div className="navbar-item">
				<strong className="has-text-white">
					<FontAwesomeIcon icon={faRocket} /> &nbsp;
					Cornell Rocketry Team
				</strong>
			</div>

			<a role="button" className={navbarExpanded ? "navbar-burger is-active" : "navbar-burger"} aria-label="menu" aria-expanded="false" onClick={() => setExpanded(!navbarExpanded)}>
				<span aria-hidden="true"></span>
				<span aria-hidden="true"></span>
				<span aria-hidden="true"></span>
			</a>
		</div>



		<div className={navbarExpanded ? "navbar-menu is-active" : "navbar-menu"}>
			<div className="navbar-start">
				<Link to="/" className="navbar-item">
					Hours
				</Link>
				<Link to="/categories" className="navbar-item">
					Categories
				</Link>
				{userData.user.userLevel > 0 && <Link to="/review" className="navbar-item">
					Review
				</Link>}
				{userData.user.userLevel > 1 && <Link to="/admin" className="navbar-item">
					Admin
				</Link>}
			</div>


			<div className="navbar-end">
				<span className="navbar-item">
					{userData.user.fname}&nbsp;{userData.user.lname}&nbsp;
					{userData.user.userLevel == 1 && <span className="tag">
						Subteam Lead
					</span>}
					{userData.user.userLevel == 2 && <span className="tag">
						Team Lead
					</span>}
				</span>
				<div className="navbar-item">
					<div className="buttons">
						<button className={"button is-primary" + (loggingOut ? " is-loading" : "")} disabled={loggingOut} onClick={logOut}>
							<strong>Log out</strong>
						</button>
					</div>
				</div>
			</div>
		</div>
	</nav>
}