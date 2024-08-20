import { CheckCircleIcon } from '@heroicons/react/24/outline'
import { notifications } from '@mantine/notifications'
export default function SuccessNotification(title, message) {
    return (
        notifications.show({
            title: title,
            message: message,
            color: 'green',
            icon: <CheckCircleIcon className="h-6 w-6" />
        })
    )
}
