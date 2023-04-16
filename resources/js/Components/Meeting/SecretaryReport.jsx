import { useRef, useState, useEffect, useReducer } from 'react'
import { Document, Page } from 'react-pdf/dist/esm/entry.vite'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { Alert, MantineProvider, Text, Group, Button, createStyles, Textarea, rem } from '@mantine/core'
import { Dropzone, MIME_TYPES } from '@mantine/dropzone'
import { Notifications, showNotification } from '@mantine/notifications'
import { SuccessNotificationSettings } from '@/Shared/Functions'
import { DocumentArrowDownIcon, XMarkIcon, ArrowDownIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline'
import Input from '@/Components/Input'

const useStyles = createStyles((theme) => ({
      wrapper: {
              position: 'relative',
              marginBottom: rem(30),
            },

      dropzone: {
              borderWidth: rem(1),
              paddingBottom: rem(50),
            },

      control: {
              backgroundColor: '#228be6 !important',
              position: 'absolute',
              width: rem(250),
              left: `calc(50% - ${rem(125)})`,
              bottom: rem(-20),
            },
}));

export default function SecretaryReport() {

    const { classes, theme } = useStyles()
    const openRef = useRef(null)

	//Reducer
	const initialReportState = {
        id: '',
        written_report: '',
        attachment: '',
        uploaded: '',
        attachment_link: '',
        composeType: 'write',
        _method: ''
	}
	
	function reducer(report, action) {
		switch (action.type) {
			case 'initialFetch':
				return {...report, id: action.fetched.id, written_report: action.fetched.written_report, uploaded: action.fetched.attachment, composeType: action.fetched.attachment ? 'upload' : 'write', _method: action.fetched.id ? 'patch' : 'post'}
			case 'add':
				return {...report, id: action.id, written_report: action.report, uploaded: action.uploaded, attachment: '', _method: 'patch'}
			case 'edit':
				return {...report, written_report: action.report, uploaded: action.uploaded, attachment: ''}
            case 'write':
                return {...report, written_report: action.report}
            case 'attach':
                return {...report, attachment: action.attachment} 
			case 'setComposeType':
				return {...report, composeType: action.composeType}
            case 'setAttachmentLink':
                return {...report, attachment_link: action.link}
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
                dispatch({type: 'add', id: e.model.id, report: e.model.written_report, uploaded: e.model.attachment})
            })
            .listen('.SecretaryReportUpdated', (e) => {
                dispatch({type: 'edit', report: e.model.written_report, uploaded: e.model.attachment})
            })
        return function cleanup() {
            Echo.leaveChannel('meeting')
        }
    }, [])

    //Set the link for viewing the pdf
    //Force the link to change when the upload changes
    useEffect(() => {
        dispatch({type: 'setAttachmentLink', link: `/secretary-reports/${report.id}?type=view&key=${report.uploaded}`})
    },[report.uploaded])

    async function handleSubmit(e) {
        e.preventDefault()

        if(report.id) {
            try {
                let config = { headers: { 'content-type': 'multipart/form-data' }}
                let res = await axios.post('/secretary-reports/'+report.id, report, config)
                showNotification(SuccessNotificationSettings(res.data.status, res.data.message, theme))
               
            } catch (error) {
                console.log(error)
  //            messages.current.show({severity: 'error', summary: 'Error!'})
            }
        } else {
            let config = { headers: { 'content-type': 'multipart/form-data' }}
            let res = await axios.post('/secretary-reports', report, config)
            showNotification(SuccessNotificationSettings(res.data.status, res.data.message, theme))
        }
    }

    return (
        <>
            <MantineProvider withNormalizeCSS withGlobalStyles>
                <Notifications />
                    <form onSubmit={handleSubmit} className="grid grid-cols-8 gap-4">
                        <div className="text-xl col-start-1 md:col-start-3 col-end-9 md:col-end-5 bg-sky-700 text-white flex justify-center">Secretary's Report</div>
                        <div className="col-start-1 md:col-start-3 md:col-end-6 col-end-9">
                            <label htmlFor="write">Write Report</label>
                            <input 
                                type="radio" 
                                value="write" 
                                id="write" 
                                checked={report.composeType == 'write'}
                                onChange={(e) => dispatch({type: 'setComposeType', composeType: 'write'})}
                                className="mr-2 ml-1"
                            />
                            <label htmlFor="upload">Upload Report</label>
                            <input 
                                type="radio" 
                                value="upload" 
                                id="upload" 
                                checked={report.composeType == 'upload'}
                                onChange={(e) => dispatch({type: 'setComposeType', composeType: 'upload'})}
                                className="mr-3 ml-1"
                            />
                        </div>

                        {report.composeType == 'write' &&
                            <>
                            {report.uploaded ? <Alert title="Warning" color="red" className="col-start-3 col-end-7"> writing a report will remove your attached report</Alert> : ''}
                            <Textarea 
                                value={report.written_report? report.written_report : ''} 
                                onChange={(e) => dispatch({type: 'write', report: e.target.value})} 
                                autosize
                                label="Write Report"
                                minRows={3}
                                className="col-start-1 md:col-start-3 col-end-9 md:col-end-7"
                            />
                            </>
                        }
                        
                        {report.composeType == 'upload' &&
                        <>
                            {report.written_report ? <Alert title="Warning" color="red" className="col-start-3 col-end-7"> uploading a report will delete your written report</Alert> : ''}
                            <div className="col-start-1 col-end-9">
                                <div className={classes.wrapper}>
                                    <Dropzone
                                        openRef={openRef}
                                        onDrop={(e) => dispatch({type: 'attach' , attachment: e[0]})}
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
                                                    report.attachment ? 'attached ' + report.attachment.name 
                                                    : report.uploaded ? 'Upload a different report'
                                                    : 'Upload Report'}</Dropzone.Idle>
                                            </Text>
                                            <Text align="center" size="sm" mt="xs" color="dimmed">
                                                {
                                                    report.attachment 
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
                            </div>
                        </>
                    }
                        <Button type="submit" color="dark" className="col-start-1 lg:col-start-4 col-end-9 lg:col-end-6 bg-black md:w-1/3 lg:w-1/2 w-1/2 place-self-center mb-10">{report.composeType == 'write' ? 'Save' : 'Upload'}</Button>
                    </form>
            </MantineProvider>
            <div className="flex flex-col items-center">
                {report.uploaded &&
                    <>
                        <Document file={report.attachment_link} onLoadSuccess={onDocumentLoadSuccess}>
                            <Page pageNumber={pageNumber} />
                        </Document>
                        <p>
                            Page {pageNumber} of {numPages}
                        </p>
                        <a href={`/secretary-reports/${report.id}?type=download`}>
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
