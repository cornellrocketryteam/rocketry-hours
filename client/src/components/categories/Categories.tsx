import * as React from 'react'
import * as api from '../../api'

import Hero from '../ui/Hero'
import AddCategory from './AddCategory'
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
				<h1 className="title is-4">Add category</h1>
				<AddCategory refresh={() => setIsLoading(true)} />
			</div>
		</div>
		<div className="section">
			<div className="container">
				<h1 className="title is-4">My categories</h1>
				{isLoading ? <p>Loading</p> :
					<ul>
						{categories.map((cat, i) => <Category category={cat} refresh={() => setIsLoading(true)} key={i} />)}
					</ul>
				}
			</div>
		</div>
	</>
}