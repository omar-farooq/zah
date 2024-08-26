import Agenda from '@/Components/Meeting/Agenda'

export default function AgendaDisplay({auth, meetingId}) {
    return (
        <>
            <div className="w-full lg:w-1/2 mt-8 mb-4"> 
                <Agenda 
                    auth={auth}
                    meetingId={meetingId}
                />
            </div>
        </>
    )
}
