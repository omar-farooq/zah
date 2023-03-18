import { useState } from 'react'
import { Fragment } from 'react'
import { InertiaLink } from '@inertiajs/inertia-react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { Pagination } from '@mantine/core'
import Table, { FirstTD, FirstTH, LastTD, LastTH, TBody, TD, THead, TH } from '@/Components/Table'
import Input from '@/Components/Input'

export default function ListMinutes ({meetingsPageOne}) {

    const [meetings, setMeetings] = useState(meetingsPageOne)
    const [searchResults, setSearchResults] = useState([])
    const [searchTerm, setSearchTerm] = useState('')

    const getMeetings = async (page) => {
        let res = await axios.get('/meetings/?getMeetings=true&page='+page)
        setMeetings(res.data)
    }

    const makeSearch = async (query, page=1) => {
        if(query.length > 2) {
            setSearchTerm(query)
            let res = await axios.get('/meetings?search='+query+'&page='+page)
            setSearchResults(res.data)
        } else {
            setSearchResults([])
            setSearchTerm('')
        }
    }


    const FindResultComponent = () => {
        return (
        searchResults.map((result, i) => {
            let pollResults = result.polls.find(x => x.name.includes(searchTerm))
            let minuteResults = result.minutes.find(x => x.minute_text.includes(searchTerm))

            if(pollResults) {
                return (
                    <div key={i} className="bg-white w-1/3 border mt-4">
                        <div className="text-xl">Poll <br />{pollResults.name}</div>
                        <div>from {result.time_of_meeting}</div>
                        <InertiaLink href={route('meetings.show', result.id)}>
                            <div className="text-cyan-600">Click here to view the original meeting</div>
                        </InertiaLink>
                    </div>
                )
            }
            if(minuteResults) {
                return (
                    <div key={i} className="bg-white w-1/3 border mt-4">
                        <div className="text-xl">Minute </div>
                        <div>{minuteResults.minute_text}</div>
                        <div>from {result.time_of_meeting}</div>
                        <InertiaLink href={route('meetings.show', result.id)}>
                            <div className="text-cyan-600">Click here to view the original meeting</div>
                        </InertiaLink>
                    </div>
                )
            }
        }))
    }

    return (
        <>
            <div className="w-full flex flex-col items-center">
                <div className="w-5/6 flex flex-row mt-6">
                    <Input
                        className="w-full pr-10"
                        placeholder="Search"
                        handleChange={(e) => makeSearch(e.target.value)}
                    />
                    <MagnifyingGlassIcon className="h-6 w-6 -ml-10 mt-2 text-slate-400" />
                </div>
            {
                searchTerm.length > 0 ?
                    <div className="w-full text-center flex flex-col items-center">
                        Found {searchResults.length} Results:
                        {
                            searchResults.length > 0 ?
                                <FindResultComponent />
                            :
                                <div>Please refine your search</div>
                        }
                    </div>
                :
                    <>
                        <Table>
                            <THead>
                                <FirstTH heading="Meeting Date" />
                                <LastTH />
                            </THead>
                            <TBody>
                                {meetings.data.map(meeting =>
                                    <Fragment key={meeting.id}>
                                        <tr>
                                            <FirstTD data={meeting.time_of_meeting} />
                                            <LastTD 
                                                href={"meetings"} 
                                                itemID={meeting.id}
                                            />
                                        </tr>
                                    </Fragment>
                                )}
                            </TBody>
                        </Table>
                        <Pagination
                            className="mt-5 mb-10"
                            total={meetings.last_page}
                            page={meetings.current_page}
                            onChange={(e) => getMeetings(e)}
                            withEdges
                        />
                    </>
            }
            </div>
        </>
    )
}
