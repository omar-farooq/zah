import { useState, useEffect, useRef } from 'react'

export default function useApi(endpoint) {
    const [response, setResponse] = useState([])
    const [fetched, setFetched] = useState(false)
    const isCalled = useRef(false)

    useEffect(() => {
        if(isCalled.current) return

        async function getApiItems() {
            let name = endpoint.name
            let res = await axios.get(endpoint.url)
            setResponse(res.data[endpoint.name])
            setFetched(true)
            isCalled.current = true
        }
        getApiItems()
    }, [])

    return (
        {response, fetched}
    )
}
