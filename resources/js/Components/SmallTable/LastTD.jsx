import { PencilSquareIcon, EyeIcon } from '@heroicons/react/24/outline'
import { InertiaLink } from '@inertiajs/inertia-react'

export default function LastTD({children}) {
    return (
        <td className="border-b border-slate-100 dark:border-slate-700 p-4 pr-8 text-slate-500 dark:text-slate-400 flex flex-row">
            {children}
        </td>
    )
}
