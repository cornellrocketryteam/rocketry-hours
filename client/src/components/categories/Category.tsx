import { faPencilAlt } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import * as React from "react"
import * as api from "../../api"
import ModalCard from "../ui/ModalCard"

export default function Category({ category, refresh }: { category: api.RocketryAdminAPI_category, refresh(): void }) {
	const [editing, setEditing] = React.useState(false)
	const [newName, setNewName] = React.useState(category.name)
	const [loading, setLoading] = React.useState(false)
	const [error, setError] = React.useState("")

	const update = async () => {
		setLoading(true)
		setError("")
		try {
			await api.POST("categories/update", { name: newName, id: category.id + "" })
			refresh()
		} catch (err) {
			setError(err as string)
		} finally {
			setLoading(false)
		}
	}
	return <li>
		{
			editing && <ModalCard title="Edit category" onClose={() => setEditing(false)} active={editing} buttons={[
				<button className="button is-primary" disabled={loading} onClick={update}>Save</button>,
			]}>
				<div className="field">
					{error && <div className="notification is-danger is-light">{error}</div>}
					<label className="label">Category Name</label>
					<div className="control">
						<input className="input" type="text" placeholder="Text input" value={newName} onChange={(e) => setNewName(e.target.value)} />
					</div>
				</div>
			</ModalCard>
		}

		{category.name}&nbsp;
		<button className="button is-small" onClick={() => setEditing(true)}>
			<FontAwesomeIcon icon={faPencilAlt} />
		</button>
	</li>
}