import { useRef, useState, useEffect, useReducer } from 'react'
import { Document, Page } from 'react-pdf/dist/esm/entry.vite'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { MantineProvider, Text, Group, Button, createStyles, Textarea } from '@mantine/core'
import { Dropzone, MIME_TYPES } from '@mantine/dropzone'
import { NotificationsProvider, showNotification } from '@mantine/notifications'
import { SuccessNotificationSettings } from '@/Shared/Functions'
import { DocumentArrowDownIcon, XMarkIcon, ArrowDownIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline'
import Input from '@/Components/Input'

const useStyles = createStyles((theme) => ({
      wrapper: {
              position: 'relative',
              marginBottom: 30,
            },

      dropzone: {
              borderWidth: 1,
              paddingBottom: 50,
            },

      control: {
              backgroundColor: '#228be6 !important',
              position: 'absolute',
              width: 250,
              left: 'calc(50% - 125px)',
              bottom: -20,
            },
}));

export default function SecretaryReport() {

    const { classes, theme } = useStyles()
    const openRef = useRef(null)

	//Reducer
	const initialReportState = {
		id: '',
		report: '',
		uploaded: '',
		composeType: 'write',
		_method: 'patch'
	}
	
	function reducer(report, action) {
		switch (action.type) {
			case 'initialFetch':
				return {...report, id: action.id, report: action.report, uploaded: action.attachment}
			case 'add':
				return report
			case 'edit':
				return report
            case 'write':
                return {...report, report: action.report}
			case 'setComposeType':
				return {...report, composeType: action.composeType}
		}
	}

	const [report, dispatch] = useReducer(reducer, initialReportState)

    //Used for PDF viewer
    const [numPages, setNumPages] = useState(null)
    const [pageNumber, setPageNumber] = useState(1)

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages)
    }

    // Check if a report exists that's eligible to be edited
    // (i.e.) hasn't yet been saved to a meeting
    useEffect(() => {
        async function GetReport() { 
            let oldReport = await axios.get('/secretary-reports?not-saved-in-meeting=true')
            dispatch({type: 'initialFetch', fetched: oldReport.data})
        }
        GetReport()

        //Join websocket channel and listen for updates. Update on event changes.
        Echo.private(`meeting`)
            .listen('.SecretaryReportCreated', (e) => {
				console.log(e)
//                dispatch({type: 'add', id: e.model.id, text: e.model.minute_text})
            })
            .listen('.SecretaryReportUpdated', (e) => {
				console.log(e)
//                dispatch({type: 'edit', itemId: e.model.id})
            })
        return function cleanup() {
            Echo.leaveChannel('meeting')
        }
    }, [])
 

    async function handleSubmit(e) {
        e.preventDefault()

        if(secretaryReport.id) {
            try {
                let config = { headers: { 'content-type': 'multipart/form-data' }}
                let res = await axios.post('/secretary-reports/'+secretaryReport.id, secretaryReport, config)
                showNotification(SuccessNotificationSettings(res.data.status, res.data.message, theme))
                fetchReport()
               
            } catch (error) {
                console.log(error)
  //            messages.current.show({severity: 'error', summary: 'Error!'})
            }
        } else {
            let config = { headers: { 'content-type': 'multipart/form-data' }}
            let res = await axios.post('/secretary-reports', secretaryReport, config)
            setSecretaryReport({...secretaryReport, id: res.data.id, attachment: '', uploaded: res.data.uploaded_report})
            showNotification(SuccessNotificationSettings(res.data.status, res.data.message, theme))
        }
    }

    return (
        <>
            <MantineProvider withNormalizeCSS withGlobalStyles>
                <NotificationsProvider>
                    <form onSubmit={handleSubmit} className="grid grid-cols-8 gap-4">
                        <div className="text-xl col-start-1 lg:col-start-3 col-end-5 bg-sky-700 text-white flex justify-center">Secretary's Report</div>
                        <div className="col-start-1 lg:col-start-3 col-end-6">
                            <label htmlFor="write">Write Report</label>
                            <input 
                                type="radio" 
                                value="write" 
                                id="write" 
                                checked={report.composeType == 'write'}
                                onChange={(e) => dispatch({type: 'setComposeType', composeType: 'write'})}
                            />
                            <label htmlFor="upload">Upload Report</label>
                            <input 
                                type="radio" 
                                value="upload" 
                                id="upload" 
                                checked={report.composeType == 'upload'}
                                onChange={(e) => dispatch({type: 'setComposeType', composeType: 'upload'})}
                            />
                        </div>

                        {composeType == 'write' &&
                        <Textarea 
                            value={report.report? report.report : ''} 
                            onChange={(e) => setSecretaryReport({...secretaryReport, report: e.target.value})} 
                            autosize
                            label="Write Report"
                            minRows={3}
                            className="col-start-2 lg:col-start-3 col-end-8 lg:col-end-7"
                        />}
                        
                        {composeType == 'upload' &&
                        <div className="col-start-1 col-end-9">
                            <div className={classes.wrapper}>
                                <Dropzone
                                    openRef={openRef}
                                    onDrop={(e) => {setSecretaryReport({...secretaryReport, attachment: e[0]})}}
                                    className={classes.dropzone}
                                    radius="sm"
                                    accept={[MIME_TYPES.pdf]}
                                    maxSize={30 * 1024 ** 2}
                                >
        
                                    <div style={{ pointerEvents: 'none' }}>
                                        <Group position="center">
                                            <Dropzone.Accept>
                                                <ArrowDownIcon className="w-12 h-12" />
                                            </Dropzone.Accept>
                                            <Dropzone.Reject>
                                                <XMarkIcon className="text-red-500 w-12 h-12" />
                                            </Dropzone.Reject>
                                            <Dropzone.Idle>
                                                <CloudArrowUpIcon className="w-12 h-12" />
                                            </Dropzone.Idle>
                                        </Group>

                                        <Text align="center" weight={700} size="lg" mt="xl">
                                            <Dropzone.Accept>Drop report here</Dropzone.Accept>
                                            <Dropzone.Reject>Pdf file less than 30mb</Dropzone.Reject>
                                            <Dropzone.Idle>{
                                                secretaryReport.attachment ? 'attached ' + secretaryReport.attachment.name 
                                                : secretaryReport.uploaded ? 'Upload a different report'
                                                : 'Upload Report'}</Dropzone.Idle>
                                        </Text>
                                        <Text align="center" size="sm" mt="xs" color="dimmed">
                                            {
                                                secretaryReport.attachment 
                                                ? 'Drop a different report to change. '
                                                : 'Drag & drop report here to upload. '
                                            }
                                            We can accept only <i>.pdf</i> files that
                                            are less than 30mb in size.
                                        </Text>
                                    </div>
                                </Dropzone>

                                <Button className={classes.control} size="md" radius="xl" onClick={() => openRef.current?.()}>
                                    Select files
                                </Button>
                            </div>
                        </div>}
                        <Button type="submit" color="dark" className="col-start-2 lg:col-start-4 col-end-8 lg:col-end-6 bg-black w-1/2 place-self-center mb-10">{composeType == 'write' ? 'Save' : 'Upload'}</Button>
                    </form>
                </NotificationsProvider>
            </MantineProvider>
            <div className="flex flex-col items-center">
                {secretaryReport.uploaded &&
                    <>
                        <Document file={`/secretary-reports/${secretaryReport.id}?type=view`} onLoadSuccess={onDocumentLoadSuccess}>
                            <Page pageNumber={pageNumber} />
                        </Document>
                        <p>
                            Page {pageNumber} of {numPages}
                        </p>
                        <a href={`/secretary-reports/${secretaryReport.id}?type=download`}>
                            <div className="flex flex-col items-center">
                                <DocumentArrowDownIcon className="h-12 w-12" />Download Report
                            </div>
                        </a>
                    </>
                }
            </div>
        </>
    )
}
