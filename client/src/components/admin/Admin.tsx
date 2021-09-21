import * as React from "react"
import * as api from "../../api"
import Hero from "../ui/Hero"
import Roster from "./roster/Roster"
import Shaming from "./shaming/Shaming"
import Subteams from "./subteams/Subteams"

export default function Admin() {

	let [subteams, setSubteams] = React.useState([] as api.RocketryAdminAPI_subteam[])
	let [isLoading, setIsLoading] = React.useState(true)

	React.useEffect(() => {
		let getSubteams = async () => {
			let subteams: api.RocketryAdminAPI_subteam[] = await api.GET("admin/subteams")
			setSubteams(subteams)
			setIsLoading(false)
		}

		if (isLoading) {
			getSubteams();
		}

	}, [isLoading, setIsLoading])

	return <>
		<Hero title="Administrative utilities" subtitle="Look at you, you fancy team lead!" />
		<div className="section">
			<div className="container">
				<h1 className="title is-3">Subteams</h1>
				<Subteams subteams={subteams} refresh={() => setIsLoading(true)} />
				<h1 className="title is-3 pt-4">Roster</h1>
				<Roster subteams={subteams} />
				<h1 className="title is-3 pt-4">Hour shaming</h1>
				<Shaming />
			</div>
		</div>
	</>
}