import * as React from 'react'
import { UserData } from '../App'

export default function HoursHero(): JSX.Element {

	const userData = React.useContext(UserData)

	return <section className="hero is-light">
		<div className="hero-body">
			<div className="container">
				<p className="title">
					Hi, <span className="has-text-primary">{userData.user.fname}</span>.
				</p>
				<p className="subtitle">
					You've logged <span className="has-text-primary">6 hours</span> this week on the <span className="has-text-primary">{userData.user.subteam}</span> subteam. Keep up the good work!
				</p>
			</div>
		</div>
	</section>
}