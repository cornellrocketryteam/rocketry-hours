import * as React from 'react';
import * as api from '../../api';

interface addCategoryProps {
	refresh(): void
}

export default function AddCategory(props: addCategoryProps) {
	const [name, setName] = React.useState("")
	const [isLoading, setLoading] = React.useState(false)
	const [error, setError] = React.useState("")

	let submit = async () => {
		setLoading(true)
		setError("")
		try {
			await api.POST("categories/new", { name })
			props.refresh();
			setName("")
		} catch (err) {
			setError(err as string)
		} finally {
			setLoading(false)
		}

	}

	return <>
		{error && <div className="notification is-danger is-light">{error}</div>}
		<div className="field has-addons">
			<div className="control">
				<input className="input" type="text" placeholder="Building rockets" value={name} onChange={(e) => setName(e.target.value)} />
			</div>
			<div className="control">
				<button className="button is-primary" disabled={isLoading} onClick={submit}>
					Add category
				</button>
			</div>
		</div>
	</>
}