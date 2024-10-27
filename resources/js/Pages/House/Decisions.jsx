import { Fragment, useState } from 'react'
import { DateTimeToUKDate } from '@/Shared/Functions'
import { Link } from '@inertiajs/react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { Pagination } from '@mantine/core'
import Input from '@/Components/Input'

export default function DecisionsMadeIndex ({decisionsPageOne}) {
    const [decisions, setDecisions] = useState(decisionsPageOne)
    const [searchResults, setSearchResults] = useState([])
    const [searchTerm, setSearchTerm] = useState('')

    const getDecisions = async (page) => {
        let res = await axios.get('/decisions/?index&getDecisions&page='+page)
        setDecisions(res.data)
    }

    const makeSearch = async (query, page=1) => {
        if(query.length > 2) {
            setSearchTerm(query)
            let res = await axios.get('/decisions?index&search='+query+'&page='+page)
            setSearchResults(res.data)
        } else {
            setSearchResults([])
            setSearchTerm('')
        }
    }

    const DecisionCard = ({decision, i}) => {
        return (
           <div key={i} className="bg-white w-4/5 lg:w-1/3 border mt-4 text-center">
               <div className="text-xl">{DateTimeToUKDate(decision.created_at)}</div>
               <div>{decision.decision_text}</div>
           </div>
        )
    }

    return (
        <>
            <div className="w-full flex flex-col items-center">
                <div className="w-5/6 flex flex-row mt-6 justify-center md:justify-start">
                    <Input
                        className="w-full pr-10"
                        placeholder="Search"
                        handleChange={(e) => makeSearch(e.target.value)}
                    />
                <MagnifyingGlassIcon className="h-6 w-6 -ml-10 mt-2 text-slate-400" />
                </div>
                <div className="text-4xl">Decisions</div>
            {
                searchTerm.length > 0 ?
                    <div className="w-full text-center flex flex-col items-center">
                        Found {searchResults.length} Results:
                        {
                            searchResults.length > 0 ?
                                searchResults.map((result, i) => (
                                    <DecisionCard decision={result} i={i} />
                                ))
                            :
                                <div>Please refine your search</div>
                        }
                    </div>
                :
                    <>
                        {decisions.data.map((x, i) => (
                            <DecisionCard key={i} decision={x} i={i} />
                        ))}
                        <Pagination
                            className="mt-5 mb-10"
                            total={decisions.last_page}
                            page={decisions.current_page}
                            onChange={(e) => getDecisions(e)}
                            withEdges
                        />
                    </>
            }
            </div>
        </>
    )
}
