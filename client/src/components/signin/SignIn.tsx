import { faRocket } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import * as React from "react"
import * as api from "../../api"

import "./SignIn.sass"

declare var CLIENT_ID: string;
declare var google: any

export default function SignIn(): JSX.Element {
	const googleButtonRef = React.useRef<HTMLDivElement>(null)

	React.useEffect(() => {
		google.accounts.id.initialize({
			client_id: CLIENT_ID,
			login_uri: api.baseurl + "/auth/login",
			ux_mode: "redirect"
		});
		google.accounts.id.renderButton(googleButtonRef.current, { type: "standard", shape: "pill", theme: "filled_black", text: "signin_with", size: 'large' })
	}, [])

	return <div className="hero is-fullheight is-primary is-bold is-login">
		<div className="hero-body">
			<div className="container has-text-centered">
				<h1 className="is-size-1"><FontAwesomeIcon icon={faRocket} /></h1>
				<h1 className="title is-size-1">Cornell Rocketry Team</h1>
				<h1 className="subtitle is-size-3">Administration panel</h1>

				<p className="block">Sign in with your Cornell Google account.</p>

				<div className="block">
					<div className="signin-button" ref={googleButtonRef}></div>
				</div>
			</div>
		</div>
	</div>
}