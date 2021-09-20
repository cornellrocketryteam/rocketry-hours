import * as React from "react";

export interface ModalProps {
	children: React.ReactChild[] | React.ReactChild
	active: boolean
	backdrop?: string
}

export default function Modal({ active, children, backdrop }: ModalProps): JSX.Element {
	return <div className={`modal ${active ? "is-active" : ""}`}>
		{backdrop ? <div className="modal-background" style={{ backgroundImage: `url(${backdrop})`, backgroundSize: "cover" }}></div> : <div className="modal-background"></div>}
		<div className="modal-content">
			{children}
		</div>
	</div>;
}