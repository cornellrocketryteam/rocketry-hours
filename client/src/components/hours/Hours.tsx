import * as React from 'react'
import * as api from "../../api"
import HoursHero from './HoursHero'
import HoursList from './HoursList';
import LoggingForm from './LoggingForm'

export function getLastSunday() {
	var t = new Date();
	t.setDate(t.getDate() - t.getDay());
	t.setHours(0)
	t.setMinutes(0)
	t.setSeconds(0)
	return t;
}

export default function Hours() {

	let [hours, setHours] = React.useState(null as null | api.RocketryAdminAPI_hoursResponse)
	let [isLoading, setIsLoading] = React.useState(true)
	let [thisWeek, setThisWeek] = React.useState([] as api.RocketryAdminAPI_hour[])

	React.useEffect(() => {
		let getHours = async () => {
			let hours: api.RocketryAdminAPI_hoursResponse = await api.GET("hours/get")
			setHours(hours)

			let now = new Date();
			let today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

			let sunday = getLastSunday()
			console.log(sunday)

			//TODO: cleanup
			let thisWeek = hours.hour.filter((hr) => (new Date(hr.date).getTime() + 14500000) >= sunday.getTime())

			setThisWeek(thisWeek)

			setIsLoading(false)
		}

		if (isLoading) {
			getHours();
		}

	}, [isLoading, setIsLoading])

	if (isLoading) {
		return <p>Loading...</p>
	}

	return <>
		<HoursHero thisWeek={thisWeek} />
		<LoggingForm categories={hours!.categories} refresh={() => setIsLoading(true)} />
		<hr />
		<div className="section">
			<nav className="level">
				<div className="level-item has-text-centered">
					<div>
						<p className="heading">This week</p>
						<p className="title">{thisWeek.reduce((prev, cv) => prev + cv.hours, 0)} hours</p>
					</div>
				</div>
				<div className="level-item has-text-centered">
					<div>
						<p className="heading">This semester</p>
						<p className="title">{hours!.hour.reduce((prev, cv) => prev + cv.hours, 0)} hours</p>
					</div>
				</div>
			</nav>

		</div>
		<HoursList hours={hours!.hour.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())} categories={hours!.categories} refresh={() => setIsLoading(true)} />
	</>
}