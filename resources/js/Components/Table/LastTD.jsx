import { PencilSquareIcon, EyeIcon } from '@heroicons/react/24/outline'
export default function LastTD({href, authUserID, author}) {
    return (
        <td className="border-b border-slate-100 dark:border-slate-700 p-4 pr-8 text-slate-500 dark:text-slate-400 flex flex-row">
            {author && authUserID == author && <a href={`${href}/edit`}><PencilSquareIcon className="w-6 h-6 mr-2" /></a>}
            <a href={href}><EyeIcon className="w-6 h-6" /></a>
        </td>
    )
}
