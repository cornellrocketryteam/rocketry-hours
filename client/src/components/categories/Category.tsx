import { faPencilAlt } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import * as React from "react"
import * as api from "../../api"

export default function Category({ category }: { category: api.RocketryAdminAPI_category }) {
	return <li>
		{category.name}&nbsp;
		<button className="button is-small">
			<FontAwesomeIcon icon={faPencilAlt} />
		</button>
	</li>
}