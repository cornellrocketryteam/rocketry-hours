import * as React from "react"
import * as api from "../../../api"

export default function RosterItem({ member, subteams, refresh }: { member: api.RocketryAdminAPI_rosterItem, subteams: api.RocketryAdminAPI_subteam[], refresh(): void }) {
	const [userLevel, setUserLevel] = React.useState(member.userLevel + "")
	const [subteam, setSubteam] = React.useState(member.subteamId + "")
	const [loading, setLoading] = React.useState(false)

	const updateUser = async () => {
		setLoading(true)
		try {
			await api.POST("admin/roster/update", { id: member.id + "", subteamId: subteam, userLevel })
			refresh()
		} catch (err) {
			alert(err)
		} finally {
			setLoading(false)
		}
	}

	const deleteUser = async () => {
		if (!confirm("Are you sure you want to delete this member?")) {
			return
		}

		setLoading(true)
		try {
			await api.POST("admin/roster/delete", { id: member.id + "" })
			refresh()
		} catch (err) {
			alert(err)
		} finally {
			setLoading(false)
		}
	}

	return <tr>
		<th>{member.id}</th>
		<td>{member.netId}</td>
		<td>{member.lname}</td>
		<td>{member.fname}</td>
		<td>{member.totalHours}</td>
		<td>{member.email}</td>
		<td>
			<div className="select">
				<select value={subteam} disabled={loading} onChange={(e) => setSubteam(e.target.value)}>
					{subteams.map((subteam, i) => <option value={subteam.id} key={i}>{subteam.name}</option>)}
				</select>
			</div>
		</td>
		<td>
			<div className="select">
				<select value={userLevel} disabled={loading} onChange={(e) => setUserLevel(e.target.value)}>
					<option value={0}>Member</option>
					<option value={1}>Subteam lead</option>
					<option value={2}>Team lead</option>
				</select>
			</div>
		</td>
		<td>
			<button className="button" onClick={updateUser}>Update</button>
			<button className="button is-danger" onClick={deleteUser}>Delete</button>
		</td>
	</tr>
}