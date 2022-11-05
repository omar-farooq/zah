export default function Historical ({meeting}) {
    console.log(meeting)
    return (
        <div>
            <div>Meeting Time: {meeting.time_of_meeting}</div>
            <div>In Attendance:</div>
            <div>Meeting Agenda: {meeting.agenda?.map(x => x)
            }
            </div>
            <div>Minutes: </div>
        </div>

    )
}
