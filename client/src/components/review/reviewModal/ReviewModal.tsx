import * as React from "react";
import * as api from "../../../api";
import ModalCard from "../../ui/ModalCard";
import HoursList from "../../hours/HoursList";

export default function ReviewModal(props: { onClose(): void, userId: number }) {
    let [hours, setHours] = React.useState(null as null | api.RocketryAdminAPI_hoursResponse)
    let [isLoading, setIsLoading] = React.useState(true)

    React.useEffect(() => {
        let getHours = async () => {
            let hours: api.RocketryAdminAPI_hoursResponse = await api.GET(`hours/review?id=${props.userId}`)
            setHours(hours)
            setIsLoading(false)
        }

        if (isLoading) {
            getHours();
        }

    }, [isLoading, setIsLoading])

    if (isLoading) {
        return <p>Loading...</p>
    }


    return <ModalCard active={true} title="Review Hours" buttons={[
        <button className="button is-default" onClick={props.onClose}>Done</button>,
    ]} onClose={props.onClose}>
        <HoursList noEdit hours={hours!.hour.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())} categories={hours!.categories} refresh={() => setIsLoading(true)} />
    </ModalCard>
}