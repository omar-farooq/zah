export default function Historical ({meeting}) {

    //need to add secretary's and treasurer's reports
    console.log(meeting)
    return (
        <div>
            <div>Meeting Time: {meeting.time_of_meeting}</div>

            <div>In Attendance:
                <ul> {meeting.attendees.map(x =>
                    <li key={x.id}>
                        {x.user?.name}
                    </li>
                )}
                </ul>
            </div>

            <div>Meeting Agenda:
                <ul> {meeting.meeting_agenda?.map(x => 
                    <li key={x.id}>{x.item}</li>
                )}   
                </ul>
            </div>

            <div>Minutes: 
                <ul> {meeting.minutes?.map(x => 
                    <li key={x.id}>{x.minute_text}</li>
                )}
                </ul>
            </div>
        </div>

    )
}
