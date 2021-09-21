import * as React from "react"
import * as api from "../../../api"
import AddUser from "./AddUser"
import RosterItem from "./RosterItem"

export default function Roster({ subteams }: { subteams: api.RocketryAdminAPI_subteam[] }) {

	let [roster, setRoster] = React.useState([] as api.RocketryAdminAPI_rosterItem[])
	let [isLoading, setIsLoading] = React.useState(true)

	React.useEffect(() => {
		let getRoster = async () => {
			let subteams = await api.GET("admin/roster")
			setRoster(subteams as api.RocketryAdminAPI_rosterItem[])
			setIsLoading(false)
		}

		if (isLoading) {
			getRoster();
		}

	}, [isLoading, setIsLoading])

	if (isLoading) {
		return <p>Loading!</p>
	}

	return <>
		<table className="table is-fullwidth">
			<thead>
				<tr>
					<th>ID</th>
					<th>netID</th>
					<th>Last name</th>
					<th>First name</th>
					<th>Email</th>
					<th>Subteam</th>
					<th>Lead status</th>
					<th>Actions</th>
				</tr>
			</thead>
			<tbody>
				{roster.map((item, i) => <RosterItem member={item} key={i} subteams={subteams} refresh={() => setIsLoading(true)} />)}
			</tbody>
		</table>
		<AddUser refresh={() => setIsLoading(true)} subteams={subteams} />
	</>
}