import { useRef, useState, useEffect } from 'react'
import Input from '@/Components/Input'
import { Messages } from 'primereact/messages'

export default function SecretaryReport() {

    //Ref for the message component
    const messages = useRef(null)

    //States
    const [secretaryReport, setSecretaryReport] = useState({
        id: '',
        report: '',
        attachment: ''
    })

    //Attach a report as an option
    
    useEffect(() => {
        const fetchReport = async () => {
            let oldReport = await axios.get('/secretary-reports?not-saved-in-meeting=true')
            setSecretaryReport({id: oldReport.data.id, report: oldReport.data.report, attachment: oldReport.data.attachment})
       }
       fetchReport()
    }, []);

    async function handleSubmit(e) {
        e.preventDefault()

        if(secretaryReport.id) {
           try {
               let res = await axios.patch('/secretary-reports/'+secretaryReport.id, secretaryReport)
               messages.current.show({severity: res.data.status, summary: res.data.message})
           } catch (error) {
               console.log(error)
               messages.current.show({severity: 'error', summary: 'Error!'})
           }
        } else {
            let res = await axios.post('/secretary-reports', secretaryReport)
            messages.current.show({severity: res.data.status, summary: res.data.message})
            setSecretaryReport({...secretaryReport, id: res.data.id})
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <Input type="text" value={secretaryReport.report? secretaryReport.report : ''} handleChange={(e) => setSecretaryReport({...secretaryReport, report: e.target.value})} />
                <input type="submit" value="save" />
            </form>

            <Messages ref={messages} className="w-1/3"></Messages>
        </>
    )
}
