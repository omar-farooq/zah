import { ExclamationCircleIcon } from '@heroicons/react/24/outline'
import { notifications } from '@mantine/notifications'
export default function ErrorNotification(title, error) {
    return (
        notifications.show({
            title: title,
            message: error.response.data.message,
            color: 'red',
            icon: <ExclamationCircleIcon className="h-6 w-6" />
        })
    )
}
