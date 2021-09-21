import * as React from "react"
import * as api from "../../../api"
import AddSubteam from "./AddSubteam"
import Subteam from "./Subteam"

export default function Subteams({ subteams, refresh }: { subteams: api.RocketryAdminAPI_subteam[], refresh(): void }) {
	return <>
		<AddSubteam refresh={refresh} />
		<ul>
			{subteams.map((subteam, i) => <Subteam subteam={subteam} refresh={refresh} key={i} />)}
		</ul>
	</>
}