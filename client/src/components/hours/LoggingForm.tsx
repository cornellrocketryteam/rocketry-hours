import * as React from "react"
import * as api from "../../api"

export default function LoggingForm({ categories, refresh }: { categories: api.RocketryAdminAPI_category[], refresh(): void }): JSX.Element {

	let [hours, setHours] = React.useState("" as string | number)
	let [categoryId, setCategoryId] = React.useState("-1")
	let [date, setDate] = React.useState("")
	let [goalsMet, setGoalsMet] = React.useState("true")
	let [desc, setDesc] = React.useState("")
	let [isLoading, setLoading] = React.useState(false)
	let [error, setError] = React.useState("")
	let [success, setSuccess] = React.useState(false)

	let submit = async () => {
		setLoading(true)
		setError("")
		try {
			await api.POST("hours/report", { hours: hours as string, categoryId, date, goalsMet, desc })
			setSuccess(true)
			setCategoryId("-1")
			setDate("")
			setGoalsMet("true")
			setDesc("")
			setHours("")
			refresh()
		} catch (err) {
			setError(err as string)
		} finally {
			setLoading(false)
		}
	}

	return <div className="section">
		<div className="container">
			{error && <div className="notification is-danger is-light">{error}</div>}
			{success && <div className="notification is-success is-light">Your hours have been logged!</div>}
			<div className="field is-horizontal">
				<div className="field-body">
					<div className="field">
						<label className="label">How many hours did you work?</label>
						<div className="control">
							<input className="input" type="number" min="0" max="24" placeholder="Hours" value={hours} onChange={(e) => setHours(e.target.value)} />
						</div>
					</div>
					<div className="field">
						<label className="label">What category do these hours fall in?</label>
						<div className="control">
							<div className="select is-fullwidth">
								<select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
									<option value={"-1"}>Uncategorized</option>
									{categories.map((cat, i) => <option value={cat.id + ""} key={i}>{cat.name}</option>)}
								</select>
							</div>
						</div>
					</div>
					<div className="field">
						<label className="label">What day was this?</label>
						<div className="control">
							<input className="input" type="date" max={new Date().toISOString().split("T")[0]} placeholder="Date"
								value={date} onChange={(e) => setDate(e.target.value)}
							/>
						</div>
					</div>
					<div className="field">
						<div className="control">
							<label className="label">Did you meet your goals?</label>
							<div className="select is-fullwidth">
								<select value={goalsMet} onChange={(e) => setGoalsMet(e.target.value)}>
									<option value={"true"}>I met my goals!</option>
									<option value={"false"}>I'll get 'em next time.</option>
								</select>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="field">
				<label className="label">What did you work on?</label>
				<div className="control">
					<textarea className="textarea" placeholder="I built a rocket today." rows={2} value={desc} onChange={(e) => setDesc(e.target.value)}></textarea>
				</div>
			</div>
			<button className="button is-primary" disabled={isLoading} onClick={submit}>Submit</button>
		</div>
	</div>
}