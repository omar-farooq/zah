import { Fragment, useEffect, useState } from 'react'
import { Input, Pagination } from '@mantine/core'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { DateToUKLocale } from '@/Shared/Functions'
import Table, { FirstTD, FirstTH, LastTD, LastTH, TBody, TD, THead, TH } from '@/Components/Table'

export default function Browse({auth}) {

    //Array of maintenance objects
    const [documents, setDocuments] = useState([])

    //Pagination
    const [activeDocumentsPage, setActiveDocumentsPage] = useState(1)
    const [totalPages, setTotalPages] = useState('')

    const getDocuments = async (page, search) => {
        let res = await axios.get('/documents?all&page='+page+'&search='+search)
        setDocuments(res.data.data)
        setTotalPages(res.data.last_page)
    }

    useEffect(() => {
            getDocuments(activeDocumentsPage, '')
    },[activeDocumentsPage])

    return (
            <div className="w-full flex flex-col items-center">
                <>
                    <div className="sm:w-5/6 flex mt-4">
                    <Input 
                        icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                        placeholder="search"
                        className="ml-0"
                        onChange={(e) => getDocuments(1, e.target.value)}
                    />
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900 mt-4">Documents</h2>
                    <div className="max-w-sm md:max-w-none md:w-full md:flex md:justify-center">
                        <Table>
                            <THead>
                                <FirstTH heading="Description" />
                                <TH heading="Upload Date" />
                                <LastTH />
                            </THead>
                            <TBody>
                                {documents.map(x =>
                                    <Fragment key={x.id}>
                                        <tr>
                                            <FirstTD data={x.description} />
                                            <TD data={DateToUKLocale(x.created_at)} />
                                            <LastTD
                                                file
                                                href={"documents"}
                                                itemID={x.id}
                                                commentRoute={`/documents/${x.id}/comments`}
                                                model={{name: "App\\Models\\Document", id: x.id}}
                                            />
                                        </tr>
                                    </Fragment>
                                )}
                            </TBody>
                        </Table>
                    </div>
                    <Pagination 
                        className="mt-5" 
                        total={totalPages} 
                        page={activeDocumentsPage}
                        onChange={setActiveDocumentsPage}
                        withEdges 
                    />
                </>
            </div>

    )
}
