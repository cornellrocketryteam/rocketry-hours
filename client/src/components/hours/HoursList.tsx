import * as React from "react"
import * as api from "../../api"
import Hour from "./Hour"

export default function HoursList({ hours, categories, refresh, noEdit }: { noEdit?: boolean, hours: api.RocketryAdminAPI_hour[], categories: api.RocketryAdminAPI_category[], refresh(): void }) {
	return <div className="container">
		{hours.map((hour, i) => <Hour hour={hour} categories={categories} key={i} refresh={refresh} noEdit={noEdit} />)}
	</div>
}