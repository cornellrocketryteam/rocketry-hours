import * as React from 'react';
import * as api from '../../../api';

interface addUserProps {
	refresh(): void
	subteams: api.RocketryAdminAPI_subteam[]
}

export default function AddCategory({ refresh, subteams }: addUserProps) {
	const [netId, setNetId] = React.useState("")
	const [subteam, setSubteam] = React.useState("0")
	const [userLevel, setUserLevel] = React.useState("0")
	const [error, setError] = React.useState("")
	const [loading, setLoading] = React.useState(false)

	let submit = async () => {
		setLoading(true)
		setError("")
		try {
			await api.POST("admin/roster/add", { netId, subteamId: subteam, userLevel })
			refresh();
			setNetId("")
			setSubteam("0")
			setUserLevel("0")
		} catch (err) {
			setError(err as string)
		} finally {
			setLoading(false)
		}

	}

	return <>
		{error && <div className="notification is-danger is-light">{error}</div>}
		<div className="field is-horizontal">
			<div className="field-body">
				<div className="field">
					<label className="label">NetID</label>
					<div className="control">
						<input className="input" type="text" placeholder="abc123" value={netId} onChange={(e) => setNetId(e.target.value)} />
					</div>
				</div>
				<div className="field">
					<label className="label">Subteam</label>
					<div className="control">
						<div className="select is-fullwidth">
							<select value={subteam} disabled={loading} onChange={(e) => setSubteam(e.target.value)}>
								{subteams.map((subteam, i) => <option value={subteam.id} key={i}>{subteam.name}</option>)}
							</select>
						</div>
					</div>
				</div>
				<div className="field">
					<label className="label">Role</label>
					<div className="control">
						<div className="select is-fullwidth">
							<select value={userLevel} disabled={loading} onChange={(e) => setUserLevel(e.target.value)}>
								<option value={0}>Member</option>
								<option value={1}>Subteam lead</option>
								<option value={2}>Team lead</option>
							</select>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div className="field">
			<button className="button is-primary" onClick={submit}>Add member</button>
		</div>
	</>
}