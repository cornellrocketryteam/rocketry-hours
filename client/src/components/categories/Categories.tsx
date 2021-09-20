import * as React from 'react'
import * as api from '../../api'

import Hero from '../ui/Hero'
import Category from './Category'

export default function Categories(): JSX.Element {
	let [categories, setCategories] = React.useState([] as api.RocketryAdminAPI_category[])
	let [isLoading, setIsLoading] = React.useState(true)

	React.useEffect(() => {
		let getCategories = async () => {
			let categories = await api.GET("categories/get")
			setCategories(categories as api.RocketryAdminAPI_category[])
			setIsLoading(false)
		}

		if (isLoading) {
			getCategories();
		}

	}, [isLoading, setIsLoading])

	return <>
		<Hero title="Categories" subtitle="Organize your logged hours." />
		<div className="section">
			<div className="container">
				{!isLoading ? <p>Loading</p> :
					categories.map((cat, i) => <Category category={cat} key={i} />)
				}
			</div>
		</div>
	</>
}