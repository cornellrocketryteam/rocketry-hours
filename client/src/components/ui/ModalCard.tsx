import * as React from "react";
import Modal, { ModalProps } from "./Modal";

interface ModalCardProps extends ModalProps {
	title: string
	onClose(): void
	buttons: JSX.Element[]
	nonCloseable?: boolean
}

export default function ModalCard({ active, children, title, onClose, buttons, nonCloseable, backdrop }: ModalCardProps): JSX.Element {
	return <Modal active={active} backdrop={backdrop}>
		<div className="modal-card">
			<header className="modal-card-head">
				<p className="modal-card-title">{title}</p>
				{!nonCloseable && <button className="delete" aria-label="close" onClick={onClose}></button>}
			</header>
			<section className="modal-card-body">
				{children}
			</section>
			<footer className="modal-card-foot">
				{buttons.map((Button, i) => <div key={i}>{Button}</div>)}
			</footer>
		</div>
	</Modal>;
}