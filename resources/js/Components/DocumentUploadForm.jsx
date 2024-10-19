import { useRef, useState, useEffect } from 'react'
import { Alert, MantineProvider, Text, Group, Button, createStyles, Textarea, rem } from '@mantine/core'
import { ComponentTitle } from '@/Components/Meeting'
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


export default function DocumentUploadForm({meetingId=null}) {

    const { classes, theme } = useStyles()
    const openRef = useRef(null)

	const [newDoc, setNewDoc] = useState({attachment: '', description: '', meeting_id: meetingId})
    const [submitted, setSubmitted] = useState(false)

    async function handleSubmit(e) {
        e.preventDefault()
        setSubmitted(true)

        try {
            let config = { headers: { 'content-type': 'multipart/form-data' }}
            let res = await axios.post('/documents', newDoc, config)
            showNotification(SuccessNotificationSettings(res.data.status, res.data.message, theme))
            setNewDoc({attachment: '', description: '', meeting_id: meetingId})
        } catch (error) {
            showNotification({title: 'Error', message: 'Missing content', autoClose: 2000, color: 'red'})
        }
        setSubmitted(false)
    }

    return (
        <>
            <MantineProvider withNormalizeCSS withGlobalStyles>
                <Notifications />
                    <form onSubmit={handleSubmit} className="w-full col-start-1 col-end-9 flex flex-col justify-center">
						{meetingId &&
	                        <div className="md:w-1/2">
    		                    <ComponentTitle bg="bg-yellow-600">Documents</ComponentTitle>
            	            </div>
						}
                        <>
                            <div className="col-start-1 col-end-9">
                                <div className={classes.wrapper}>
                                    <Dropzone
                                        openRef={openRef}
                                        onDrop={(e) => setNewDoc({...newDoc , attachment: e[0]})}
                                        className={classes.dropzone}
                                        radius="sm"
                                        accept={[MIME_TYPES.pdf, MIME_TYPES.png, MIME_TYPES.jpeg, MIME_TYPES.gif]}
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
                                                <Dropzone.Reject>Pdf or Image file less than 30mb</Dropzone.Reject>
                                                <Dropzone.Idle>{
                                                    newDoc.attachment ? 'attached ' + newDoc.attachment.name
                                                    : 'Upload Document'}</Dropzone.Idle>
                                            </Text>
                                            <Text align="center" size="sm" mt="xs" color="dimmed">
                                                Drag & drop documents here to upload.
                                                We can accept only <i>.pdf</i> or <i>image</i> files that
                                                are less than 30mb in size.
                                            </Text>
                                        </div>
                                    </Dropzone>

                                    <Button className={classes.control} size="md" radius="xl" onClick={() => openRef.current?.()}>
                                        Select files
                                    </Button>
                                </div>
                            </div>
                            <label>Description</label>
                            <Input
                                type="text"
                                value={newDoc.description}
                                required={true}
                                handleChange={(e) => setNewDoc({...newDoc, description: e.target.value})}
                                className="w-full"
                                placeholder="e.g. Surveyor's report"
                            />
                        </>
                        {
                            submitted ?  
                                <Button disabled className="col-start-1 col-end-9 w-1/2 md:w-1/3 xl:w-1/4 place-self-center top-4">Submitting</Button>
                            :
                                <Button type="submit" color="dark" className="col-start-1 col-end-9 bg-black w-1/2 md:w-1/3 xl:w-1/4 place-self-center top-4">Upload</Button>
                        }
                    </form>
            </MantineProvider>
        </>
    )
}

