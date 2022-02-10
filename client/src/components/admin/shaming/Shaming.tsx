import { faCheckCircle, faTimesCircle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import * as React from "react"
import * as api from "../../../api"

export default function Shaming() {

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

	return <div className="shame-grid">
		{roster.map((person, i) => {
			let hasLoggedHours = person.totalHours > 0
			return <div className="shame-box" key={i}>
				<strong className={hasLoggedHours ? "has-text-success" : "has-text-primary"}>
					<FontAwesomeIcon fixedWidth icon={hasLoggedHours ? faCheckCircle : faTimesCircle} />
					{person.lname}, {person.fname}
				</strong>
			</div>
		})}
	</div>
}