import { faTrash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import * as React from "react"
import * as api from "../../api"
import ModalCard from "../ui/ModalCard"

export default function HoursList({ hour, categories, refresh }: { hour: api.RocketryAdminAPI_hour, categories: api.RocketryAdminAPI_category[], refresh(): void }) {
	const [remove, setRemove] = React.useState(false)
	const [loading, setLoading] = React.useState(false)
	const [error, setError] = React.useState("")

	const removeHour = async () => {
		setLoading(true)
		setError("")
		try {
			await api.POST("hours/delete", { id: hour.id + "" })
			refresh()
		} catch (err) {
			setError(err as string)
		} finally {
			setLoading(false)
		}

	}

	return <div>
		{remove &&
			<ModalCard title="Delete hour" onClose={() => setRemove(false)} active={remove} buttons={[
				<button className="button is-default" disabled={loading} onClick={() => setRemove(false)}>Cancel</button>,
				<button className="button is-primary" disabled={loading} onClick={removeHour}>Delete</button>,
			]}>
				<div className="field">
					{error && <div className="notification is-danger is-light">{error}</div>}
					<div className="control">
						<p>Are you sure you want to delete this hour? This action cannot be undone.</p>
					</div>
				</div>
			</ModalCard>
		}
		<h3 className="title is-4 mb-1">
			<button className="button is-small" onClick={() => setRemove(true)}><FontAwesomeIcon icon={faTrash} fixedWidth /></button>&nbsp;
			<strong className="has-text-primary">{hour.hours} hours</strong>{" "}
			on {new Date(hour.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}&nbsp;
			{hour.categoryId != -1 && <span className="tag">
				{categories.find((cat) => cat.id == hour.categoryId)?.name}
			</span>}
		</h3>
		<p className="pb-4">{hour.desc}</p>
	</div>
}