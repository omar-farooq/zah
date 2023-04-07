import Agenda from '@/Components/Meeting/Agenda'

export default function NotYetScheduled() {
    return (
        <>
            <div> Meeting not yet scheduled. You can still set the agenda for the next meeting:</div>
            <Agenda />
            <div><a href="/meetings/schedule">Click here to schedule a meeting</a></div>
        </>
    )
}
