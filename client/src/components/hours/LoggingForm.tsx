import * as React from "react"

export default function LoggingForm(): JSX.Element {

	let [doubleCheck, setDoubleCheck] = React.useState(false)

	return <div className="section">
		<div className="container">
			<div className="field is-horizontal">
				<div className="field-body">
					<div className="field">
						<label className="label">How many hours did you work?</label>
						<div className="control">
							<input className="input" type="number" min="0" max="144" placeholder="Hours" />
						</div>
					</div>
					<div className="field">
						<label className="label">What category do these hours fall in?</label>
						<div className="control">
							<div className="select is-fullwidth">
								<select>
									<option>Uncategorized</option>
									<option>Something else</option>
								</select>
							</div>
						</div>
					</div>
					<div className="field">
						<div className="control">
							<label className="label">Did you meet your goals?</label>
							<div className="select is-fullwidth">
								<select>
									<option>I met my goals!</option>
									<option>I'll get 'em next time.</option>
								</select>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="field">
				<label className="label">What did you work on?</label>
				<div className="control">
					<textarea className="textarea" placeholder="I built a rocket today." rows={2}></textarea>
				</div>
			</div>
			<button className="button is-primary">Submit</button>
		</div>
	</div>
}