import { faRocket } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import * as React from "react"
import * as api from "../../api"

import "./SignIn.sass"

declare var CLIENT_ID: string;

export default function SignIn(): JSX.Element {
	return <div className="hero is-fullheight is-primary is-bold is-login">
		<div className="hero-body">
			<div className="container has-text-centered">
				<h1 className="is-size-1"><FontAwesomeIcon icon={faRocket} /></h1>
				<h1 className="title is-size-1">Cornell Rocketry Team</h1>
				<h1 className="subtitle is-size-3">Administration panel</h1>

				<p className="block">Sign in with your Cornell Google account.</p>

				<div id="g_id_onload"
					data-client_id={CLIENT_ID}
					data-context="signin"
					data-ux_mode="redirect"
					data-login_uri={api.baseurl + "/auth/login"}
					data-auto_select="true">
				</div>

				<div className="g_id_signin"
					data-type="standard"
					data-shape="pill"
					data-theme="filled_black"
					data-text="signin_with"
					data-size="large"
					data-logo_alignment="left">
				</div>
			</div>
		</div>
	</div>
}