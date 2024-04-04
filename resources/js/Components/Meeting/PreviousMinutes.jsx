import { useEffect, useState } from 'react'
import { ComponentTitle } from '@/Components/Meeting'

export default function PreviousMinutes() {

    const [minutes, setMinutes] = useState([])

    useEffect(() => {
        const getMinutes = async () => {
            let res = await axios.get('/minutes?latest')
            setMinutes(res.data)
        }
        getMinutes()
    },[])

    return (
        <>
            <ComponentTitle bg="bg-purple-700">
                Previous Minutes
            </ComponentTitle>
            <ul className="col-start-1 col-end-9 list-disc p-2">
                {minutes.map(x => (
                    <li key={x.id}>
                        {x.minute_text}
                    </li>
                ))}
            </ul>
        </>
    )
}
