import { useEffect, useState } from 'react'

export default function MinutesReadAndAgreed({meetingId, minutesReadHook}) {
    
    const [minutesRead, setMinutesRead] = minutesReadHook

    useEffect(() => {
        const getMinutesRead = async () => {
            let res = await axios.get('/meetings/'+meetingId+'?getMinutesRead')
            setMinutesRead(res.data == 0 ? false : true)
        }
        getMinutesRead()
    }, []);

    const updateMeeting = (e) => {
        e.PreventDefault
        axios.patch('/meetings/'+meetingId+'?updateMinutesRead', 
            { minutesReadAndAgreed: e.target.checked }
        )
    }

    return (
        <>
            <div className="flex flex-row space-x-2 mt-6 -mb-6 text-xl">
                <input
                    type="checkbox"
                    className="self-center"
                    checked={minutesRead ? 'checked' : ''}
                    onChange={(e) => updateMeeting(e)}
                />
                <div className="">Minutes Read and Agreed</div>
            </div>
        </>
    )
}
