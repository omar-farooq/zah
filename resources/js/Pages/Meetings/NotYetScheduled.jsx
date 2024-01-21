import Agenda from '@/Components/Meeting/Agenda'
import { InertiaLink } from '@inertiajs/inertia-react'

export default function NotYetScheduled({auth}) {
    return (
        <>
            <div className="mt-4 text-lg"> 
                Meeting not yet scheduled. 

                You can still set the agenda for the next meeting:
            </div>
            <div className="w-full lg:w-1/2 mt-4 mb-4"> 
                <Agenda 
                    auth={auth}
                />
            </div>
                <InertiaLink 
                    href={route("schedule")}
                    className="text-xl text-sky-600"
                >
                    Click here to schedule a meeting
                </InertiaLink>
        </>
    )
}
