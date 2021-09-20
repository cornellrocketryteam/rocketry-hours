import * as api from "../../api"
import * as React from 'react'
import { UserData } from '../App'

export default function HoursHero({ thisWeek }: { thisWeek: api.RocketryAdminAPI_hour[] }): JSX.Element {

	const userData = React.useContext(UserData)
	const hours = thisWeek.reduce((prev, cv) => prev + cv.hours, 0)

	return <section className="hero is-light">
		<div className="hero-body">
			<div className="container">
				<p className="title">
					Hi, <span className="has-text-primary">{userData.user.fname}</span>.
				</p>
				<p className="subtitle">
					You've logged <span className="has-text-primary">{hours} hours</span> this week on the <span className="has-text-primary">{userData.user.subteam}</span> subteam. {hours > 1 && "Keep up the good work!"}
				</p>
			</div>
		</div>
	</section>
}