import { faCheckCircle, faTimesCircle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import * as React from "react"
import * as api from "../../../api"

import "./Shaming.sass"

export default function Shaming({ subteams }: { subteams: api.RocketryAdminAPI_subteam[] }) {

	let [roster, setRoster] = React.useState([] as api.RocketryAdminAPI_rosterItem[])
	let [isLoading, setIsLoading] = React.useState(true)

	React.useEffect(() => {
		let getRoster = async () => {
			let roster = await api.GET("admin/shame")
			setRoster(roster as api.RocketryAdminAPI_rosterItem[])
			setIsLoading(false)
		}

		if (isLoading) {
			getRoster();
		}

	}, [isLoading, setIsLoading])

	if (isLoading) {
		return <p>Loading!</p>
	}

	const sortedRoster = roster.reduce((acc: Record<number, api.RocketryAdminAPI_rosterItem[]>, cv) => {
		if (acc[cv.subteamId]) {
			acc[cv.subteamId].push(cv);
		} else {
			acc[cv.subteamId] = [cv]
		};
		return acc;
	}, {})

	console.log(sortedRoster)

	return <ul className="shame">
		{subteams.map((subteam, i) => {
			return <>
				<li key={i}><strong>{subteams.find(s => s.id == subteam.id)?.name}</strong></li>
				{
					sortedRoster[subteam.id].map((person, i) => {
						const hasLoggedHours = person.totalHours > 0
						return <li key={i}>
							<span className={hasLoggedHours ? "has-text-success" : "has-text-danger"}>
								<FontAwesomeIcon fixedWidth icon={hasLoggedHours ? faCheckCircle : faTimesCircle} />&nbsp;
							</span>
							<span className={hasLoggedHours ? "" : "has-text-weight-bold has-text-danger"}>
								{person.lname}, {person.fname}
							</span>
						</li>
					})
				}
			</>
		})}
	</ul>
}