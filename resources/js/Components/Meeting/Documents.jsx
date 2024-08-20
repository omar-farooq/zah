import { useState, useEffect } from 'react'
import { DocumentArrowDownIcon, XMarkIcon } from '@heroicons/react/24/outline'
import DocumentUploadForm from '@/Components/DocumentUploadForm'

export default function Documents({auth, meetingId}) {

    //States
    const [docs, setDocs] = useState([])

    const getDocs = async () => {
        let res = await axios.get('/documents?meeting_id='+meetingId)
        setDocs(res.data)
    }

    useEffect(() => {
        getDocs()
        //Join websocket channel and listen for updates. Update on event changes.
        Echo.private(`meeting`)
            .listen('.DocumentCreated', (e) => {
                getDocs()
            })
            .listen('.DocumentDeleted', (e) => {
                getDocs()
            })
        return () => {
            Echo.private(`meeting`).stopListening('.DocumentCreated').stopListening('.DocumentDeleted')
            Echo.leaveChannel('meeting')
        }
    }, [])

    const deleteDoc = (id) => {
        axios.delete('/documents/'+id)
    }

    return (
        <>
            <DocumentUploadForm 
                auth={auth}
                meetingId={meetingId}
            />
            {docs.length > 0 ?
                <table className="table-auto col-start-1 col-end-9 mb-4 border border-collapse border-slate-800 mt-8">
                    <thead>
                        <tr>
                            <th className="border border-collapse border-slate-600">Description</th>
                            <th className="border border-collapse border-slate-600">Download</th>
                            <th className="border border-collapse border-slate-600"/>
                        </tr>
                    </thead>
                    <tbody>
                        {docs.map(doc =>
                            <tr key={doc.id} className="text-center">
                                <td className="border border-collapse border-slate-600" >{doc.description}</td>
                                <td className="border border-collapse border-slate-600" >
                                    <a href={`/documents/${doc.id}`} className="flex justify-center">
                                        <DocumentArrowDownIcon className="h-6 w-6" />
                                    </a>
                                </td>
                                <td className="border border-collapse border-slate-600" >
                                    {
                                        doc.user_id === auth.user.id ?
                                            <button onClick={(e) => deleteDoc(doc.id)}>delete</button>
                                        :
                                            ''
                                    }
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            : ''
            }
        </>
    )
}
