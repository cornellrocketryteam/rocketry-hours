import * as React from "react"
import * as api from "../../api"
import Hero from "../ui/Hero"
import Shaming from "./shaming/Shaming"
import ReviewModal from "./reviewModal/ReviewModal"

import "./Review.sass"

export default function Review() {

	let [users, setUsers] = React.useState([] as api.RocketryAdminAPI_rosterItem[])
	let [subteams, setSubteams] = React.useState([] as api.RocketryAdminAPI_subteam[])
	let [usersLoading, setUsersLoading] = React.useState(true)
	let [subteamsLoading, setSubteamsLoading] = React.useState(true)

	let [currentReview, setCurrentReview] = React.useState(0);

	React.useEffect(() => {
		let getRoster = async () => {
			let users: api.RocketryAdminAPI_rosterItem[] = await api.GET("admin/roster")
			setUsers(users);
			setUsersLoading(false);
		}

		if (usersLoading) {
			getRoster();
		}

	}, [usersLoading, setUsersLoading])

	React.useEffect(() => {
		let getSubteams = async () => {
			let subteams: api.RocketryAdminAPI_subteam[] = await api.GET("admin/subteams")
			setSubteams(subteams);
			setSubteamsLoading(false);
		}

		if (subteamsLoading) {
			getSubteams();
		}

	}, [subteamsLoading, setSubteamsLoading])

	return <>
		{currentReview != 0 && <ReviewModal onClose={() => setCurrentReview(0)} userId={currentReview} />}
		<Hero title="Hour Report" subtitle="View hours submitted this week" />
		{subteamsLoading ? <p>Loading</p> : <div className="section">
			<div className="container Review">
				<div className="block">
					<h1 className="title is-3 pt-4">Hour report</h1>
					<div className="shame-section">
						<Shaming subteams={subteams} />
					</div>
				</div>
				<div className="block">
					<h1 className="title is-3">Review Hours</h1>
					<ul className="review-columns">
						{users.sort((a, b) => a.lname.localeCompare(b.lname)).map((user, i) => <li key={i}><a onClick={() => setCurrentReview(user.id)}>{user.lname}, {user.fname}</a></li>)}
					</ul>
				</div>
			</div>
		</div>}
	</>
}