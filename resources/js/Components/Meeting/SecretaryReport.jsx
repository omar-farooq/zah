import { useRef, useState, useEffect } from 'react'
import { MantineProvider, Text, Group, Button, createStyles } from '@mantine/core'
import { Dropzone, MIME_TYPES } from '@mantine/dropzone'
import { NotificationsProvider, showNotification } from '@mantine/notifications'
import { XMarkIcon, CloudArrowDownIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline'
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

      icon: {
              color: theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[4],
            },

      control: {
              'background-color': '#228be6 !important',
              position: 'absolute',
              width: 250,
              left: 'calc(50% - 125px)',
              bottom: -20,
            },
}));

export default function SecretaryReport() {

    const { classes, theme } = useStyles()
    const openRef = useRef(null)

    //States
    const [secretaryReport, setSecretaryReport] = useState({
        id: '',
        report: '',
        attachment: ''
    })

    // Check if a report exists that's eligible to be edited
    // (i.e.) hasn't yet been saved to a meeting
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
               showNotification({
                   title: res.data.status,
                   message: res.data.message,
                   autoClose: 2000,
                   color: 'green',
                   style: { backgroundColor: '#c7d99b' },
                   sx: { backgroundColor: 'c7d99b' },
                   styles: (theme) => ({
                        title: { color: theme.black },
                        description: { color: theme.black },
                        closeButton: {
                            color: theme.black
                        }
                   })
               })
           } catch (error) {
               console.log(error)
  //             messages.current.show({severity: 'error', summary: 'Error!'})
           }
        } else {
            let res = await axios.post('/secretary-reports', secretaryReport)
    //        messages.current.show({severity: res.data.status, summary: res.data.message})
            setSecretaryReport({...secretaryReport, id: res.data.id})
        }
    }

    return (
        <>
            <MantineProvider withNormalizeCSS withGlobalStyles>
                <NotificationsProvider>
                    <form onSubmit={handleSubmit}>
                        <Input type="text" value={secretaryReport.report? secretaryReport.report : ''} handleChange={(e) => setSecretaryReport({...secretaryReport, report: e.target.value})} />

                        <div className={classes.wrapper}>
                            <Dropzone
                                openRef={openRef}
                                onDrop={(e) => {console.log(e)}}
                                className={classes.dropzone}
                                radius="sm"
                                accept={[MIME_TYPES.pdf]}
                                maxSize={30 * 1024 ** 2}
                            >
        
                                <div style={{ pointerEvents: 'none' }}>
                                    <Group position="center">
                                        <Dropzone.Accept>
                                            <CloudArrowDownIcon className="w-6 h-6" />
                                        </Dropzone.Accept>
                                        <Dropzone.Reject>
                                            <XMarkIcon className="text-red-500" />
                                        </Dropzone.Reject>
                                        <Dropzone.Idle>
                                            <CloudArrowUpIcon className="w-12 h-12" />
                                        </Dropzone.Idle>
                                    </Group>

                                    <Text align="center" weight={700} size="lg" mt="xl">
                                        <Dropzone.Accept>Drop report here</Dropzone.Accept>
                                        <Dropzone.Reject>Pdf file less than 30mb</Dropzone.Reject>
                                        <Dropzone.Idle>Upload Report</Dropzone.Idle>
                                    </Text>
                                    <Text align="center" size="sm" mt="xs" color="dimmed">
                                        Drag&apos;n&apos;drop report here to upload. We can accept only <i>.pdf</i> files that
                                        are less than 30mb in size.
                                    </Text>
                                </div>
                            </Dropzone>

                            <Button className={classes.control} size="md" radius="xl" onClick={() => openRef.current?.()}>
                                Select files
                            </Button>
                        </div>
                        <input type="submit" value="save" />
                    </form>
                </NotificationsProvider>
            </MantineProvider>
        </>
    )
}
