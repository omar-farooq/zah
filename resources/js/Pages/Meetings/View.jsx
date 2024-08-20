import { ComponentWrapper, ComponentTitle, DisplayPoll } from '@/Components/Meeting'
export default function Historical ({meeting, auth}) {
    //need to add treasurer's reports
    return (
        <div className="w-full">
            <div className="text-2xl mt-3 mb-5 text-center">Meeting Recap: {meeting.time_of_meeting}</div>

            <div className="grid grid-cols-4 w-full gap-2">
                <div className="lg:col-start-2 lg:col-end-2 col-start-1 col-end-5">
                    <ComponentTitle bg="bg-violet-800">
                        In Attendance
                    </ComponentTitle>
                    <ul> {meeting.attendees.map(x =>
                        <li key={x.id} className="text-xl">
                            {x.name}
                            {x.pivot.late ? <span className="text-red-500"> (L)</span> : ""}
                        </li>
                    )}
                    </ul>
                    <ul> {meeting.guests?.map(x =>
                        <li key={x.id} className="text-xl text-green-700">
                            {x.name}
                        </li>
                    )}
                    </ul>
                </div>
            </div>

            <div className="w-full">
                <ComponentWrapper>
                    <div className="col-start-1 col-end-9 lg:col-end-5 lg:col-start-3">
                        <ComponentTitle bg="bg-rose-700">
                            Agenda
                        </ComponentTitle>
                    </div>
                    <ul className="lg:col-start-3 lg:col-end-7 col-start-1 col-end-9"> 
                        {
                            meeting.meeting_agenda.length > 0 ?                            
                                meeting.meeting_agenda?.map(x => 
                                    <li key={x.id} className='border-black bg-white text-black flex justify-between items-center m-1 border'>
                                        <div className="ml-2 whitespace-pre-line">{x.item}</div>
                                    </li>
                                )
                            :
                                <div className="text-lg">No Agenda was set for this meeting</div>
                        }   
                    </ul>
                </ComponentWrapper>

                <ComponentWrapper>
                    <div className="col-start-1 col-end-9 lg:col-end-5 lg:col-start-3">
                        <ComponentTitle bg="bg-sky-700">
                            Secretary's Report
                        </ComponentTitle>
                    </div>
                    <div className="lg:col-start-3 lg:col-end-7 col-start-1 col-end-9">
                        {
                            meeting.secretary_report?.written_report ?
                                meeting.secretary_report.written_report
                            : meeting.secretary_report?.attachment ?
                                <a href={`/secretary-reports/${meeting.secretary_report.id}?type=download`}>Click to Download</a>
                            :
                                <div className="text-lg">There's nothing to report</div>
                        }
                    </div>
                </ComponentWrapper>

                <ComponentWrapper>
                    <div className="col-start-1 col-end-9 lg:col-end-5 lg:col-start-3">
                        <ComponentTitle bg="bg-emerald-700">
                            Minutes
                        </ComponentTitle>
                    </div>
                    <ul className="col-start-1 lg:col-start-3 col-end-9 lg:col-end-7"> {meeting.minutes?.map(x => 
                        <li key={x.id} className='bg-white flex justify-between border m-1 bg-white border-sky-700 text-slate-700'>
                            <div className="ml-2 whitespace-pre-line">{x.minute_text}</div>
                        </li>
                    )}
                    </ul>
                </ComponentWrapper>

                <ComponentWrapper>
                    <div className="col-start-1 col-end-9 lg:col-end-5 lg:col-start-3">
                        <ComponentTitle bg="bg-yellow-600">
                            Polls
                        </ComponentTitle>
                    </div>
                    
                    <div className="col-start-1 lg:col-start-3 col-end-9 lg:col-end-7">
                        {
                            meeting.polls.length > 0 ?
                                meeting.polls.map(poll => (
                                    <DisplayPoll auth={auth} poll={poll} key={poll.id} />
                                ))
                            :
                                <div className="text-lg">No polls were created</div>
                        }
                    </div>
                </ComponentWrapper>
            </div>
        </div>

    )
}
