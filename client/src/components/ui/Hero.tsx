import * as React from "react"

export default function Hero({ title, subtitle }: { title: string, subtitle: string }): JSX.Element {
	return <section className="hero is-light">
		<div className="hero-body">
			<div className="container">
				<p className="title">
					{title}
				</p>
				<p className="subtitle">
					{subtitle}
				</p>
			</div>
		</div>
	</section>
}