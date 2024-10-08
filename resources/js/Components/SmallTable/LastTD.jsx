import { PencilSquareIcon, EyeIcon } from '@heroicons/react/24/outline'
import { Link } from '@inertiajs/react'

export default function LastTD({children}) {
    return (
        <td className="border-b border-slate-100 px-0 md:pl-4 p-4 md:pr-8 text-slate-500 dark:text-slate-400 dark:border-slate-700 flex flex-row text-center md:text-left">
            {children}
        </td>
    )
}
